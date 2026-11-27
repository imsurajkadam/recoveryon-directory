import "server-only";

import { getPublishedArticleSummaries } from "@/lib/articles";
import { guides } from "@/lib/content";
import { guideTopic } from "@/lib/guide-topics";

// Site-wide internal linking. Every guide (hand-written or pipeline) can find its closest relatives, so:
//  - new articles are told which existing guides to link to while they are written,
//  - every guide page shows related guides (old pages link to new ones the moment they publish),
//  - pillar pages (types of care, insurers, near-me pages) list the guides written for them.

export type LinkableGuide = {
  slug: string;
  path: string;
  title: string;
  description: string;
  category: string;
  pillar: string;
  topicId: string;
  publishedAt: string;
  automated: boolean;
  tokens: Set<string>;
};

const STOPWORDS = new Set("a an and are at be by can do does for from how i in is it its me my near of on or the to vs what when where which who why will with you your rehab treatment guide".split(" "));

export function keywordTokens(...texts: string[]) {
  const tokens = new Set<string>();
  for (const text of texts) {
    for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
      if (raw.length < 3 || STOPWORDS.has(raw)) continue;
      tokens.add(raw.replace(/(ies)$/, "y").replace(/([^s])s$/, "$1"));
    }
  }
  return tokens;
}

function overlap(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const token of a) if (b.has(token)) shared += 1;
  return shared / Math.min(a.size, b.size);
}

/** All published guides: hand-written ones from content.ts plus pipeline articles from the database. */
export async function getLinkableGuides(): Promise<LinkableGuide[]> {
  const articles = await getPublishedArticleSummaries().catch(() => []);
  const fromCode: LinkableGuide[] = guides.map((guide) => ({
    slug: guide.slug,
    path: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.description,
    category: "",
    pillar: "",
    topicId: guideTopic(guide.slug).id,
    publishedAt: guide.reviewedOn,
    automated: false,
    tokens: keywordTokens(guide.slug, guide.title),
  }));
  const fromDatabase: LinkableGuide[] = articles
    .filter((article) => !fromCode.some((guide) => guide.slug === article.slug))
    .map((article) => ({
      slug: article.slug,
      path: `/guides/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      category: article.category,
      pillar: article.internalLinks[0] || "",
      topicId: guideTopic(article.slug).id,
      publishedAt: article.publishedAt,
      automated: true,
      tokens: keywordTokens(article.slug, article.title, article.primaryKeyword, ...article.secondaryKeywords),
    }));
  const seen = new Set<string>();
  return [...fromCode, ...fromDatabase].filter((guide) => !seen.has(guide.slug) && Boolean(seen.add(guide.slug)));
}

type Subject = { slug?: string; title?: string; keyword?: string; category?: string; pillar?: string; extra?: string[] };

/** Scores how closely a guide relates to a subject (topic group, category, pillar and shared keywords). */
function relatedness(subject: Subject, subjectTokens: Set<string>, subjectTopic: string, guide: LinkableGuide) {
  let score = overlap(subjectTokens, guide.tokens) * 6;
  if (guide.topicId === subjectTopic && subjectTopic !== "more") score += 2.5;
  if (subject.category && guide.category && subject.category === guide.category) score += 2;
  if (subject.pillar && guide.pillar && subject.pillar === guide.pillar) score += 3;
  return score;
}

/** The closest guides to a subject, best first. Excludes the subject itself. */
export function rankRelated(subject: Subject, all: LinkableGuide[], limit = 6) {
  const tokens = keywordTokens(subject.slug || "", subject.title || "", subject.keyword || "", ...(subject.extra || []));
  const topic = guideTopic(subject.slug || subject.keyword || "").id;
  return all
    .filter((guide) => guide.slug !== subject.slug)
    .map((guide) => ({ guide, score: relatedness(subject, tokens, topic, guide) }))
    .filter((item) => item.score > 0.8)
    .sort((a, b) => b.score - a.score || (b.guide.publishedAt > a.guide.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map((item) => item.guide);
}

/** Related guides for a guide page. Tops up with the newest guides on the same topic if matches are thin. */
export async function relatedGuidesFor(slug: string, limit = 6) {
  const all = await getLinkableGuides();
  const self = all.find((guide) => guide.slug === slug);
  const subject: Subject = self
    ? { slug, title: self.title, category: self.category, pillar: self.pillar }
    : { slug };
  const ranked = rankRelated(subject, all, limit);
  if (ranked.length >= limit) return ranked;
  const topic = guideTopic(slug).id;
  const extras = all
    .filter((guide) => guide.slug !== slug && !ranked.includes(guide) && guide.topicId === topic)
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  return [...ranked, ...extras].slice(0, limit);
}

/** Guides written for a pillar page (by pillar path) plus close keyword matches. */
export async function guidesForPillar(path: string, keywords: string[], limit = 6) {
  const all = await getLinkableGuides();
  const direct = all.filter((guide) => guide.pillar === path).sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  const tokens = keywordTokens(...keywords);
  const close = all
    .filter((guide) => !direct.includes(guide))
    .map((guide) => ({ guide, score: overlap(tokens, guide.tokens) }))
    .filter((item) => item.score >= 0.3)
    .sort((a, b) => b.score - a.score || (b.guide.publishedAt > a.guide.publishedAt ? 1 : -1))
    .map((item) => item.guide);
  return [...direct, ...close].slice(0, limit);
}

/** Internal paths an article may link to (anything else is turned back into plain text). */
export const STATIC_LINK_TARGETS = ["/directory", "/insurance", "/care", "/emergency-help", "/sober-living-near-me", "/iop-near-me", "/detox-centers-near-me", "/guides", "/how-we-verify"];
