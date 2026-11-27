import "server-only";

import { revalidatePath } from "next/cache";
import { revalidateGuideSurfaces, saveArticlePackage, validateArticlePackage } from "@/lib/article-store";
import { pipelineChat, usingClaude } from "@/lib/article-pipeline/llm";
import { MODELS, openAiImage, openRouterChat, parseJsonReply } from "@/lib/article-pipeline/openrouter";
import { checkerMessages, imagePrompt, interlinkMessages, researchMessages, VOICES, writerMessages } from "@/lib/article-pipeline/prompts";
import { ARTICLE_TOPICS, type ArticleTopic } from "@/lib/article-pipeline/topics";
import { careCategories, guides } from "@/lib/content";
import { pingIndexNow } from "@/lib/indexnow";
import { insurers } from "@/lib/insurance-data";
import { clearLinkableGuidesCache, getLinkableGuides, rankRelated, STATIC_LINK_TARGETS } from "@/lib/internal-links";
import { getDatabase } from "@/lib/db";
import { notifyArticlePipeline } from "@/lib/form-notifications";
import { getListingContext } from "@/lib/listing-context";
import { uploadArticleWebp } from "@/lib/r2";

// The article pipeline runs one stage per call so every call fits in a serverless time limit:
//   research -> write -> check -> publish -> link -> done
// "link" adds a contextual link to the new article from up to 3 related older articles, then pings IndexNow.
// Jobs live in content_pipeline_jobs; each day gets a random target (IST): 5-10 articles while
// Claude credits are in use, 1-2 once the pipeline is back on DeepSeek (OpenRouter).

type Stage = "research" | "write" | "check" | "publish" | "link" | "done" | "failed";
type JobData = {
  voice?: string;
  research?: Record<string, unknown> & { sources?: { title?: string; url: string; publisher?: string }[] };
  listing?: unknown;
  article?: Record<string, unknown>;
  feedback?: string[];
  check?: unknown;
  cost?: number;
  models?: Record<string, string>;
  published_url?: string;
  link_retry?: boolean;
  internal_links?: { total: number; guides: number; removed: string[] };
  linked_from?: string[];
  link_error?: string;
};
type Job = { id: string; topic_id: string; slug: string; stage: Stage; attempts: number; revisions: number; data: JobData };

const MAX_STAGE_ATTEMPTS = 3;
const MAX_REVISIONS = 1;
const MAX_STEPS_PER_DAY = 120;

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function topicFor(job: Pick<Job, "topic_id">): ArticleTopic {
  const topic = ARTICLE_TOPICS.find((item) => item.id === job.topic_id);
  if (!topic) throw new Error(`Unknown topic ${job.topic_id}`);
  return topic;
}

function addCost(data: JobData, cost: number | undefined) {
  data.cost = Math.round(((data.cost || 0) + (cost || 0)) * 10000) / 10000;
}

/** Removes em and en dashes everywhere (house style) and trims strings. */
function cleanStrings<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1-$2")
      .replace(/\s*[\u2014\u2013]\s*/g, ", ")
      .replace(/ {2,}/g, " ")
      .trim() as T;
  }
  if (Array.isArray(value)) return value.map(cleanStrings) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanStrings(item)])) as T;
  return value;
}

async function existingGuidePaths() {
  const sql = getDatabase();
  const rows = sql ? await sql`select slug from content_articles where status = 'published'` : [];
  return [...new Set([...guides.map((guide) => guide.slug), ...rows.map((row) => String(row.slug))])].map((slug) => `/guides/${slug}`);
}

const LINK_PATTERN = /\[([^\]]{1,200})\]\(([^)\s]{1,500})\)/g;

function linkTargets(existing: string[], topic: ArticleTopic) {
  return new Set([
    ...existing,
    ...STATIC_LINK_TARGETS,
    topic.pillar,
    ...careCategories.map((category) => `/care/${category.slug}`),
    ...insurers.map((insurer) => `/insurance/${insurer.slug}`),
  ]);
}

/** Turns links to unknown internal paths (or to the article itself) back into plain text and counts the rest. */
export function sanitizeInternalLinks(article: Record<string, unknown>, allowed: Set<string>, selfPath: string) {
  const removed: string[] = [];
  const kept = new Set<string>();
  const fix = (text: string) => text.replace(LINK_PATTERN, (whole, label: string, href: string) => {
    if (!href.startsWith("/")) return whole;
    const path = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (path === selfPath || !allowed.has(path) || kept.has(path)) {
      if (path !== selfPath && !allowed.has(path)) removed.push(href);
      return label;
    }
    kept.add(path);
    return whole;
  });
  const walk = (value: unknown, key = ""): unknown => {
    if (typeof value === "string") return key === "href" || key === "src" ? value : fix(value);
    if (Array.isArray(value)) return value.map((item) => walk(item));
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, walk(item, childKey)]));
    return value;
  };
  article.article_blocks = walk(article.article_blocks);
  return { total: kept.size, guides: [...kept].filter((path) => path.startsWith("/guides/")).length, removed };
}

async function runResearch(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  data.voice = data.voice || VOICES[ARTICLE_TOPICS.indexOf(topic) % VOICES.length];
  data.listing = await getListingContext(topic.filters).catch(() => null);
  const reply = await pipelineChat("research", researchMessages(topic), {
    temperature: 0.2,
    max_tokens: 6000,
    tools: [{ type: "openrouter:web_search", parameters: { engine: "exa", max_results: 4, max_total_results: 8 } }],
  });
  addCost(data, reply.usage?.cost);
  data.models = { ...data.models, research: reply.model };
  const research = parseJsonReply<NonNullable<JobData["research"]>>(reply.content);
  const sources = (research.sources || []).filter((source) => typeof source?.url === "string" && source.url.startsWith("https://"));
  for (const citation of reply.citations) {
    if (sources.length >= 8) break;
    if (citation.url.startsWith("https://") && !sources.some((source) => source.url === citation.url)) sources.push({ title: citation.title, url: citation.url });
  }
  if (sources.length < 2) throw new Error("Research found fewer than 2 usable sources");
  research.sources = sources;
  data.research = research;
  return "write" as Stage;
}

async function runWrite(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  const existing = await existingGuidePaths();
  clearLinkableGuidesCache();
  const linkable = await getLinkableGuides();
  const relatedGuides = rankRelated({ slug: topic.slug, keyword: topic.keyword, category: topic.category, pillar: topic.pillar }, linkable, 10)
    .map((guide) => ({ path: guide.path, title: guide.title }));
  const messages = writerMessages({ topic, voice: data.voice || VOICES[0], research: data.research, listingData: data.listing, existingGuides: existing, relatedGuides, feedback: data.feedback });
  const reply = await pipelineChat("write", messages, {
    temperature: 0.7,
    max_tokens: 24000,
    reasoning: { effort: "low" },
    response_format: { type: "json_object" },
  });
  addCost(data, reply.usage?.cost);
  data.models = { ...data.models, write: reply.model };
  const article = cleanStrings(parseJsonReply<Record<string, unknown>>(reply.content));
  const links = sanitizeInternalLinks(article, linkTargets(existing, topic), `/guides/${topic.slug}`);
  data.internal_links = links;
  const wantedGuideLinks = Math.min(3, relatedGuides.length);
  if ((links.total < 4 || links.guides < wantedGuideLinks) && !data.link_retry) {
    // One retry with explicit feedback; after that the draft is accepted with what it has.
    data.link_retry = true;
    data.feedback = [...(data.feedback || []), `The draft had only ${links.total} valid internal links (${links.guides} to guides). Add 5-9 descriptive internal links, including at least ${wantedGuideLinks || 1} from the related guides list and the pillar page ${topic.pillar}.`];
    throw new Error(`Too few internal links (${links.total} total, ${links.guides} guides)`);
  }
  const blocks = Array.isArray(article.article_blocks) ? article.article_blocks as Record<string, unknown>[] : [];
  if (blocks.length < 8) throw new Error(`Draft too thin (${blocks.length} blocks)`);
  const kinds = new Set(blocks.map((block) => block.type));
  if (!kinds.has("key_takeaways") || (!kinds.has("table") && !kinds.has("steps") && !kinds.has("checklist"))) {
    throw new Error("Draft is missing key takeaways or a structured block (table, steps or checklist)");
  }
  data.article = article;
  return "check" as Stage;
}

async function runCheck(job: Job) {
  const data = job.data;
  const reply = await pipelineChat("check", checkerMessages(data.article, data.research, data.listing), {
    temperature: 0,
    max_tokens: 8000,
    reasoning: { effort: "low" },
    response_format: { type: "json_object" },
  });
  addCost(data, reply.usage?.cost);
  data.models = { ...data.models, check: reply.model };
  const verdict = parseJsonReply<{ approved?: boolean; blocking_issues?: string[]; suggestions?: string[] }>(reply.content);
  data.check = verdict;
  const issues = (verdict.blocking_issues || []).filter((issue) => typeof issue === "string" && issue.trim());
  if (verdict.approved === true && issues.length === 0) return "publish" as Stage;
  if (job.revisions < MAX_REVISIONS) {
    data.feedback = issues.length ? issues : ["The checker did not approve the draft. Tighten sourcing and safety language."];
    job.revisions += 1;
    return "write" as Stage;
  }
  throw Object.assign(new Error(`Fact check rejected the article twice: ${issues.join(" | ").slice(0, 600)}`), { final: true });
}

async function generateImage(description: string) {
  const prompt = imagePrompt(description);
  const viaOpenAi = await openAiImage(prompt).catch(() => null);
  if (viaOpenAi) return { base64: viaOpenAi, cost: 0.006 };
  const reply = await openRouterChat({
    model: MODELS.image,
    messages: [{ role: "user", content: prompt }],
    modalities: ["image", "text"],
    image_config: { aspect_ratio: "3:2" },
  }, 120_000);
  const dataUrl = reply.images[0];
  return { base64: dataUrl ? dataUrl.replace(/^data:image\/[a-z+]+;base64,/, "") : null, cost: reply.usage?.cost };
}

async function runPublish(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  const article = { ...(data.article || {}) };
  const prompts = (article.image_prompts || {}) as { hero?: string; inline?: string };
  const stamp = Date.now().toString(36);

  let heroUrl: string | null = null;
  let inlineUrl: string | null = null;
  for (const [kind, description] of [["hero", prompts.hero || topic.keyword], ["inline", prompts.inline]] as const) {
    if (!description) continue;
    try {
      const image = await generateImage(description);
      addCost(data, image.cost);
      const url = image.base64 ? await uploadArticleWebp(`${topic.slug}/${stamp}-${kind}`, image.base64) : null;
      if (kind === "hero") heroUrl = url; else inlineUrl = url;
    } catch (error) {
      console.error("Article image failed", topic.slug, kind, error);
    }
  }

  const blocks = (Array.isArray(article.article_blocks) ? article.article_blocks as Record<string, unknown>[] : []).flatMap((block) => {
    if (block.type !== "image") return [block];
    return inlineUrl ? [{ type: "image", src: inlineUrl, alt: block.alt || topic.keyword, caption: block.caption }] : [];
  });
  const clip = (value: unknown, max: number) => String(value || "").slice(0, max).trim();
  const pkg = {
    content_unit_id: `TLP-${topic.id}`,
    title: clip(article.title, 180),
    slug: topic.slug,
    excerpt: clip(article.excerpt, 500),
    seo_title: clip(article.seo_title || article.title, 60),
    meta_description: clip(article.meta_description, 175),
    primary_keyword: topic.keyword,
    secondary_keywords: (Array.isArray(article.secondary_keywords) ? article.secondary_keywords : []).slice(0, 12).map((item) => clip(item, 180)).filter((item) => item.length >= 2),
    category: topic.category,
    author_name: "TreatmentLane Editorial Team",
    automated_quality_gate_passed: true,
    article_blocks: blocks,
    faq: (Array.isArray(article.faq) ? article.faq : []).slice(0, 8),
    sources: (Array.isArray(article.sources) && article.sources.length ? article.sources : data.research?.sources || []).filter((source: { url?: string }) => typeof source?.url === "string" && source.url.startsWith("https://")).slice(0, 12),
    claim_source_map: [],
    internal_links: [topic.pillar],
    image_alt: clip(article.image_alt || `Illustration for ${topic.keyword}`, 300),
    hero_image_url: heroUrl || undefined,
    status: "published" as const,
  };
  const parsed = validateArticlePackage(pkg);
  if (!parsed.success) {
    const problems = parsed.error.issues.slice(0, 8).map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    if (job.revisions < MAX_REVISIONS + 1) {
      data.feedback = [`The article JSON failed validation. Fix: ${problems.join("; ")}`];
      job.revisions += 1;
      return "write" as Stage;
    }
    throw Object.assign(new Error(`Article failed validation: ${problems.join("; ")}`), { final: true });
  }
  const result = await saveArticlePackage(parsed.data, `pipeline-${topic.slug}`);
  if (result.status >= 300) throw new Error(`Saving failed (${result.status}): ${JSON.stringify(result.body).slice(0, 300)}`);
  data.published_url = `https://treatmentlane.com/guides/${topic.slug}`;
  return "link" as Stage;
}

/** Adds a contextual link to the new article from up to 3 related older pipeline articles, then pings IndexNow. */
async function runLink(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  const sql = getDatabase();
  const newPath = `/guides/${topic.slug}`;
  const linkedFrom: string[] = [];
  try {
    if (!sql) throw new Error("Database unavailable");
    clearLinkableGuidesCache();
    const all = await getLinkableGuides();
    const self = all.find((guide) => guide.slug === topic.slug);
    const candidates = rankRelated(
      { slug: topic.slug, title: self?.title, keyword: topic.keyword, category: topic.category, pillar: topic.pillar },
      all.filter((guide) => guide.automated),
      6,
    );
    for (const candidate of candidates) {
      if (linkedFrom.length >= 3) break;
      try {
        const [row] = await sql`select id, title, payload from content_articles where slug = ${candidate.slug} and status = 'published' limit 1`;
        if (!row) continue;
        const payload = (row.payload || {}) as Record<string, unknown>;
        const blocks = Array.isArray(payload.article_blocks) ? payload.article_blocks as Record<string, unknown>[] : [];
        if (JSON.stringify(blocks).includes(`](${newPath})`)) { linkedFrom.push(candidate.slug); continue; }
        const paragraphs = blocks.flatMap((block, index) => block.type === "paragraph" && typeof block.text === "string" && block.text.length > 120 && index > 1
          ? [{ index, text: block.text as string }] : []).slice(0, 30);
        if (!paragraphs.length) continue;
        const reply = await pipelineChat("link", interlinkMessages({
          newTitle: String(data.article?.title || topic.keyword),
          newPath,
          newSummary: String(data.article?.excerpt || ""),
          oldTitle: String(row.title),
          paragraphs,
        }), { temperature: 0.2, max_tokens: 2000, response_format: { type: "json_object" } });
        addCost(data, reply.usage?.cost);
        const answer = parseJsonReply<{ block_index?: number; text?: string; skip?: boolean }>(reply.content);
        if (answer.skip || typeof answer.block_index !== "number" || typeof answer.text !== "string") continue;
        const original = paragraphs.find((paragraph) => paragraph.index === answer.block_index);
        if (!original) continue;
        const text = cleanStrings(answer.text);
        const originalLinks = [...original.text.matchAll(LINK_PATTERN)].map((match) => match[2]);
        const newLinks = [...text.matchAll(LINK_PATTERN)].map((match) => match[2]);
        const ratio = text.length / original.text.length;
        const valid = newLinks.filter((href) => href === newPath).length === 1
          && originalLinks.every((href) => newLinks.includes(href))
          && ratio >= 0.9 && ratio <= 1.8;
        if (!valid) continue;
        blocks[answer.block_index] = { ...blocks[answer.block_index], text };
        const internalLinks = Array.isArray(payload.internal_links) ? payload.internal_links as string[] : [];
        const updated = { ...payload, article_blocks: blocks, internal_links: [...new Set([...internalLinks, newPath])].slice(0, 20) };
        await sql`update content_articles set payload = ${sql.json(JSON.parse(JSON.stringify(updated)))}::jsonb, updated_at = now() where id = ${row.id}`;
        revalidatePath(candidate.path);
        linkedFrom.push(candidate.slug);
      } catch (error) {
        console.error("Interlink failed", candidate.slug, error);
      }
    }
  } catch (error) {
    data.link_error = error instanceof Error ? error.message.slice(0, 300) : String(error);
  }
  data.linked_from = linkedFrom;
  revalidateGuideSurfaces(topic.slug);
  await pingIndexNow([newPath, ...linkedFrom.map((slug) => `/guides/${slug}`), "/guides", topic.pillar]);
  return "done" as Stage;
}

const RUNNERS: Record<"research" | "write" | "check" | "publish" | "link", (job: Job) => Promise<Stage>> = {
  research: runResearch,
  write: runWrite,
  check: runCheck,
  publish: runPublish,
  link: runLink,
};

export async function pipelineStatus() {
  const sql = getDatabase();
  if (!sql) return null;
  const day = todayInIndia();
  const [today] = await sql`select * from content_pipeline_days where day = ${day}`;
  const jobs = await sql`select topic_id, slug, stage, attempts, revisions, last_error, data->>'cost' as cost, data->'models' as models,
    data->>'published_url' as published_url, updated_at from content_pipeline_jobs order by created_at desc limit 25`;
  return { day, today: today || null, topics_total: ARTICLE_TOPICS.length, recent_jobs: jobs };
}

/** Runs one stage of one job. Returns whether more work remains today. */
export async function runPipelineStep(): Promise<{ action: string; more: boolean; detail?: string }> {
  const sql = getDatabase();
  if (!sql) return { action: "no-database", more: false };
  const day = todayInIndia();
  // Idle calls (the 10-minute trigger after the day's articles are out) should not use up the step budget.
  const [today] = await sql`select target, published from content_pipeline_days where day = ${day}`;
  if (today && today.published >= today.target) {
    const [active] = await sql`select count(*)::int as n from content_pipeline_jobs where stage in ('research', 'write', 'check', 'publish', 'link')`;
    if (active.n === 0) return { action: "daily-target-reached", more: false };
  }
  const target = usingClaude() ? 5 + Math.floor(Math.random() * 6) : 1 + Math.floor(Math.random() * 2);
  await sql`insert into content_pipeline_days (day, target) values (${day}, ${target}) on conflict (day) do nothing`;
  const [counter] = await sql`update content_pipeline_days set steps = steps + 1 where day = ${day} returning target, published, steps`;
  if (counter.steps > MAX_STEPS_PER_DAY) return { action: "step-limit", more: false };

  // Claim an unfinished job (the lock stops two overlapping calls from working on the same job).
  let [row] = await sql`update content_pipeline_jobs set locked_until = now() + interval '6 minutes', updated_at = now()
    where id = (select id from content_pipeline_jobs
      where stage in ('research', 'write', 'check', 'publish', 'link') and (locked_until is null or locked_until < now())
      order by created_at limit 1 for update skip locked)
    returning id, topic_id, slug, stage, attempts, revisions, data`;

  if (!row) {
    const [busy] = await sql`select count(*)::int as n from content_pipeline_jobs where stage in ('research', 'write', 'check', 'publish', 'link')`;
    if (busy.n > 0) return { action: "waiting-for-lock", more: false };
    if (counter.published >= counter.target) return { action: "daily-target-reached", more: false };
    const taken = new Set([
      ...(await sql`select slug from content_articles`).map((item) => String(item.slug)),
      ...(await sql`select slug from content_pipeline_jobs`).map((item) => String(item.slug)),
      ...guides.map((guide) => guide.slug),
    ]);
    const topic = ARTICLE_TOPICS.find((item) => !taken.has(item.slug));
    if (!topic) {
      if (counter.published === 0) await notifyArticlePipeline("topic list used up", [{ label: "What to do", value: "All topics in src/lib/article-pipeline/topics.ts are published or failed. Add new topics to keep publishing." }]).catch(() => undefined);
      return { action: "topics-used-up", more: false };
    }
    [row] = await sql`insert into content_pipeline_jobs (topic_id, slug, stage, started_on, locked_until)
      values (${topic.id}, ${topic.slug}, 'research', ${day}, now() + interval '6 minutes')
      on conflict (slug) do nothing
      returning id, topic_id, slug, stage, attempts, revisions, data`;
    if (!row) return { action: "topic-race", more: true };
  }

  const job = { ...row, data: (row.data || {}) as JobData } as Job;
  const stage = job.stage as keyof typeof RUNNERS;
  try {
    const nextStage = await RUNNERS[stage](job);
    await sql`update content_pipeline_jobs set stage = ${nextStage}, attempts = 0, revisions = ${job.revisions},
      data = ${sql.json(JSON.parse(JSON.stringify(job.data)))}::jsonb, last_error = null, locked_until = null, updated_at = now()
      where id = ${job.id}`;
    if (nextStage === "done") await sql`update content_pipeline_days set published = published + 1 where day = ${day}`;
    return { action: `${job.slug}: ${stage} -> ${nextStage}`, more: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const attempts = job.attempts + 1;
    const failed = Boolean((error as { final?: boolean }).final) || attempts >= MAX_STAGE_ATTEMPTS;
    await sql`update content_pipeline_jobs set stage = ${failed ? "failed" : job.stage}, attempts = ${attempts},
      revisions = ${job.revisions}, data = ${sql.json(JSON.parse(JSON.stringify(job.data)))}::jsonb,
      last_error = ${message.slice(0, 2000)}, locked_until = null, updated_at = now() where id = ${job.id}`;
    if (failed) {
      await notifyArticlePipeline(`article failed: ${job.slug}`, [
        { label: "Topic", value: `${job.topic_id} (${job.slug})` },
        { label: "Stage", value: stage },
        { label: "Error", value: message.slice(0, 1500) },
        { label: "What happens next", value: "The pipeline skips this topic and moves on to the next one." },
      ]).catch(() => undefined);
    }
    return { action: `${job.slug}: ${stage} error${failed ? " (gave up)" : ""}`, more: true, detail: message.slice(0, 300) };
  }
}
