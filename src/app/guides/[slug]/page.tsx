import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { RelatedGuides } from "@/components/related-guides";
import { relatedGuidesFor } from "@/lib/internal-links";
import { blockText, getPublishedArticleBySlug, type ArticleBlock, type ArticleSource } from "@/lib/articles";
import { guides } from "@/lib/content";
import { ArrowRight } from "lucide-react";
import { CareLadder, IllustratedHero, StepsDiagram } from "@/components/illustrations";
import { insuranceSteps, listingSteps } from "@/lib/care-facts";
import { guideTopic, readingMinutes, slugifyHeading, type GuideTopic } from "@/lib/guide-topics";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { withQuestionMark } from "@/lib/text-question";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export const dynamicParams = true;
// Hourly refresh so "Keep reading" picks up newly published guides (publishing also revalidates).
export const revalidate = 3600;

const publisher = { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") } };
const editorialAuthor = (name: string) => ({ "@type": "Organization", name, url: absoluteUrl("/about/editorial-standards") });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) return { title: withQuestionMark(guide.title), description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { type: "article", title: withQuestionMark(guide.title), description: guide.description } };
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};
  const image = article.heroImageUrl || (article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined);
  return {
    // seo_title is written to fit search results (max 60 characters), so the site-name suffix is skipped.
    title: { absolute: withQuestionMark(article.seoTitle) },
    description: article.metaDescription,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords].filter(Boolean),
    alternates: { canonical: `/guides/${article.slug}` },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: { type: "article", url: absoluteUrl(`/guides/${article.slug}`), siteName: SITE_NAME, title: withQuestionMark(article.title), description: article.excerpt, publishedTime: article.publishedAt, modifiedTime: article.updatedAt, section: article.category || undefined, tags: article.secondaryKeywords, images: image ? [{ url: image, width: 1536, height: 1024, alt: article.imageAlt }] : undefined },
    twitter: { card: "summary_large_image", title: withQuestionMark(article.title), description: article.excerpt, images: image ? [image] : undefined },
  };
}

function safeSource(source: ArticleSource) {
  try {
    const url = new URL(source.url);
    return url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

// Turns [label](/path) and [label](https://...) into links. Anything else stays plain text.
function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]{1,200})\]\(((?:https:\/\/|\/)[^\s)]{0,500})\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href] = match;
    parts.push(href.startsWith("/")
      ? <Link key={match.index} href={href} prefetch={false}>{label}</Link>
      : <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">{label}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function renderBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case "heading":
      if (!block.text) return null;
      return block.level === 3 ? <h3 key={index}>{withQuestionMark(block.text)}</h3> : <h2 key={index} id={slugifyHeading(block.text)}>{withQuestionMark(block.text)}</h2>;
    case "paragraph":
      return block.text ? <p key={index}><InlineText text={block.text} /></p> : null;
    case "callout":
      if (!block.text) return null;
      return <div className={`notice article-callout is-${block.tone || "info"}`} key={index} role={block.tone === "warning" ? "alert" : undefined}>
        {block.title ? <strong className="article-callout-title">{block.title}</strong> : null}
        <span><InlineText text={block.text} /></span>
      </div>;
    case "list": {
      if (!block.items?.length) return null;
      const items = block.items.map((item, itemIndex) => <li key={itemIndex}><InlineText text={item} /></li>);
      return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
    }
    case "key_takeaways":
      if (!block.items?.length) return null;
      return <aside className="article-takeaways" key={index} aria-label="Key takeaways">
        <h2 className="article-box-title">{block.title || "Key takeaways"}</h2>
        <ul>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineText text={item} /></li>)}</ul>
      </aside>;
    case "table":
      if (!block.headers?.length || !block.rows?.length) return null;
      return <figure className="article-table" key={index}>
        <div className="article-table-scroll"><table>
          <thead><tr>{block.headers.map((header, cellIndex) => <th key={cellIndex} scope="col">{header}</th>)}</tr></thead>
          <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{block.headers.map((_, cellIndex) => cellIndex === 0
            ? <th key={cellIndex} scope="row"><InlineText text={row[cellIndex] || ""} /></th>
            : <td key={cellIndex}><InlineText text={row[cellIndex] || ""} /></td>)}</tr>)}</tbody>
        </table></div>
        {block.caption ? <figcaption>{block.caption}</figcaption> : null}
      </figure>;
    case "steps":
      if (!block.items?.length) return null;
      return <section className="article-steps" key={index}>
        {block.title ? <h3>{withQuestionMark(block.title)}</h3> : null}
        <ol>{block.items.map((item, itemIndex) => <li key={itemIndex}><strong>{item.title}</strong><p><InlineText text={item.text} /></p></li>)}</ol>
      </section>;
    case "checklist":
      if (!block.items?.length) return null;
      return <section className="article-checklist" key={index}>
        <h3 className="article-box-title">{block.title || "Checklist"}</h3>
        <ul>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineText text={item} /></li>)}</ul>
      </section>;
    case "stats":
      if (!block.items?.length) return null;
      return <section className="article-stats" key={index} aria-label={block.title || "TreatmentLane data"}>
        {block.title ? <h3 className="article-box-title">{block.title}</h3> : null}
        <div className="article-stats-grid">{block.items.map((item, itemIndex) => <div key={itemIndex}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
        {block.note ? <p className="article-stats-note">{block.note}</p> : null}
      </section>;
    case "image":
      if (!block.src) return null;
      return <figure className="article-figure" key={index}>
        <Image src={block.src} alt={block.alt} width={1200} height={800} loading="lazy" />
        {block.caption ? <figcaption>{block.caption}</figcaption> : null}
      </figure>;
    case "cta":
      if (!block.href?.startsWith("/")) return null;
      return <div className="article-inline-cta" key={index}>
        <p><InlineText text={block.text} /></p>
        <Link className="button" href={block.href} prefetch={false}>{block.label} <ArrowRight size={16} /></Link>
      </div>;
    default:
      return null;
  }
}

function TopicDiagram({ topic }: { topic: GuideTopic }) {
  if (topic.diagram === "insurance") return <figure><StepsDiagram steps={insuranceSteps} /><figcaption className="section-caution">How to check your coverage before admission.</figcaption></figure>;
  if (topic.diagram === "levels") return <CareLadder />;
  if (topic.diagram === "choosing") return <figure><StepsDiagram steps={listingSteps} /><figcaption className="section-caution">Four steps from first search to a decision.</figcaption></figure>;
  return null;
}

function GuideAside({ headings, topic, hasFaq }: { headings: string[]; topic: GuideTopic; hasFaq: boolean }) {
  return <aside className="article-aside">
    {headings.length > 1 && <nav aria-label="In this guide"><h2>In this guide</h2><ol>{headings.map((heading) => <li key={heading}><a href={`#${slugifyHeading(heading)}`}>{withQuestionMark(heading)}</a></li>)}{hasFaq ? <li><a href="#faqs">Frequently asked questions</a></li> : null}</ol></nav>}
    <div className="article-cta"><h2>Next step</h2><p>{topic.cta.text}</p><Link className="button" href={topic.cta.href} prefetch={false}>{topic.cta.label} <ArrowRight size={16} /></Link></div>
  </aside>;
}

// Two levels only: topic groups are anchors on /guides, and breadcrumb items should be distinct pages.
function breadcrumbFor(name: string, path: string) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
    { "@type": "ListItem", position: 3, name, item: absoluteUrl(path) },
  ] };
}

function readingWordCount(texts: string[]) {
  return texts.join(" ").split(/\s+/).filter(Boolean).length;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) {
    const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: withQuestionMark(guide.title), description: guide.description, dateModified: guide.reviewedOn, author: editorialAuthor("TreatmentLane Editorial Team"), publisher, inLanguage: "en-US", mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) };
    const guideFaqSchema = guide.faq?.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: withQuestionMark(item.question), acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
    const topic = guideTopic(guide.slug);
    const guideBreadcrumb = breadcrumbFor(withQuestionMark(guide.title), `/guides/${guide.slug}`);
    const related = await relatedGuidesFor(guide.slug);
    const minutes = readingMinutes(guide.sections.map((section) => section.body));
    return <><JsonLd data={jsonLd} /><JsonLd data={guideBreadcrumb} />{guideFaqSchema ? <JsonLd data={guideFaqSchema} /> : null}
      <IllustratedHero kind={topic.art} title={withQuestionMark(guide.title)}>
        <p>{guide.description}</p>
        <ul className="article-meta"><li>{topic.label}</li><li>{minutes} min read</li><li>Reviewed {new Date(guide.reviewedOn).toLocaleDateString("en-US", { dateStyle: "long" })}</li><li>{guide.sources.length} {guide.sources.length === 1 ? "source" : "sources"}</li></ul>
      </IllustratedHero>
      <div className="article-layout">
        <article className="prose">
          <div className="breadcrumb"><Link href="/guides" prefetch={false}>Guides</Link><span>/</span><Link href={`/guides#${topic.id}`} prefetch={false}>{topic.label}</Link></div>
          <div className="notice">Educational information only. Individual circumstances differ, and this guide does not provide medical, legal, or insurance advice.</div>
          {guide.sections.map((section, index) => <section key={section.heading} id={slugifyHeading(section.heading)}><h2>{withQuestionMark(section.heading)}</h2><p>{section.body}</p>{index === 0 ? <TopicDiagram topic={topic} /> : null}</section>)}
          {guide.faq?.length ? <section id="faqs"><h2>Frequently asked questions</h2>{guide.faq.map((item) => <div key={item.question}><h3>{withQuestionMark(item.question)}</h3><p>{item.answer}</p></div>)}</section> : null}
          <RelatedGuides guides={related} />
          {guide.related?.length ? <section><h2>Related pages</h2><ul>{guide.related.map((item) => <li key={item.href}><Link href={item.href} prefetch={false}>{item.label}</Link></li>)}</ul></section> : null}
          <h2>Sources and further help</h2><ul>{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
        </article>
        <GuideAside headings={guide.sections.map((section) => section.heading)} topic={topic} hasFaq={Boolean(guide.faq?.length)} />
      </div>
    </>;
  }

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const heroSrc = article.heroImageUrl || (article.hasThumbnail ? `/api/content/articles/${article.id}/thumbnail` : "");
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: withQuestionMark(article.title),
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: editorialAuthor(article.authorName),
    publisher,
    inLanguage: "en-US",
    articleSection: article.category || undefined,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords].filter(Boolean).join(", ") || undefined,
    wordCount: readingWordCount(article.blocks.map(blockText)),
    ...(article.reviewerName ? { reviewedBy: { "@type": "Person", name: article.reviewerName, honorificSuffix: article.reviewerCredentials || undefined } } : {}),
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    image: heroSrc ? { "@type": "ImageObject", url: heroSrc.startsWith("http") ? heroSrc : absoluteUrl(heroSrc), width: 1536, height: 1024, caption: article.imageAlt } : undefined,
  };
  const articleTopic = guideTopic(article.slug);
  const breadcrumbSchema = breadcrumbFor(withQuestionMark(article.title), `/guides/${article.slug}`);
  const related = await relatedGuidesFor(article.slug);
  const faqSchema = article.faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((item) => ({ "@type": "Question", name: withQuestionMark(item.question), acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
  const publicationDate = new Date(article.reviewerName ? article.reviewedAt : article.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" });
  const reviewLabel = article.reviewerName ? `Clinically reviewed ${publicationDate}` : `Editorially checked ${publicationDate}`;
  const byline = article.reviewerName
    ? `Written by ${article.authorName}. Reviewed by ${article.reviewerName}${article.reviewerCredentials ? `, ${article.reviewerCredentials}` : ""}.`
    : `Written and source-checked by ${article.authorName}.`;
  const topic = articleTopic;
  const articleHeadings = article.blocks.flatMap((block) => block.type === "heading" && block.level !== 3 && block.text ? [block.text] : []);
  const minutes = readingMinutes(article.blocks.map(blockText));
  const hasOwnImages = article.blocks.some((block) => block.type === "image" && block.src);
  return <><JsonLd data={articleSchema} /><JsonLd data={breadcrumbSchema} />{faqSchema ? <JsonLd data={faqSchema} /> : null}
    <IllustratedHero kind={topic.art} title={withQuestionMark(article.title)}>
      <p>{article.excerpt}</p>
      <p className="article-byline">{byline}</p>
      <ul className="article-meta"><li>{topic.label}</li><li>{minutes} min read</li><li>{reviewLabel}</li><li>{article.sources.length} {article.sources.length === 1 ? "source" : "sources"}</li></ul>
    </IllustratedHero>
    <div className="article-layout">
      <article className="prose">
        <div className="breadcrumb"><Link href="/guides" prefetch={false}>Guides</Link><span>/</span><Link href={`/guides#${topic.id}`} prefetch={false}>{topic.label}</Link></div>
        {heroSrc ? <Image className="article-thumbnail" src={heroSrc} alt={article.imageAlt} width={1200} height={800} priority /> : null}
        <div className="notice">Educational information only. This article does not provide a diagnosis or replace advice from a qualified healthcare professional.</div>
        {article.blocks.map(renderBlock)}
        {hasOwnImages ? null : <TopicDiagram topic={topic} />}
        {article.faq.length ? <section id="faqs"><h2>Frequently asked questions</h2>{article.faq.map((item) => <div className="article-faq" key={item.question}><h3>{withQuestionMark(item.question)}</h3><p>{item.answer}</p></div>)}</section> : null}
        <RelatedGuides guides={related} />
        <h2>Sources</h2><ul>{article.sources.map((source) => { const href = safeSource(source); return href ? <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{source.title || source.label || source.publisher || href}</a></li> : null; })}</ul>
      </article>
      <GuideAside headings={articleHeadings} topic={topic} hasFaq={article.faq.length > 0} />
    </div>
  </>;
}
