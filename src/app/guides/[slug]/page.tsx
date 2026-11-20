import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getPublishedArticleBySlug, type ArticleBlock, type ArticleSource } from "@/lib/articles";
import { guides } from "@/lib/content";
import { ArrowRight } from "lucide-react";
import { CareLadder, IllustratedHero, StepsDiagram } from "@/components/illustrations";
import { insuranceSteps, listingSteps } from "@/lib/care-facts";
import { guideTopic, readingMinutes, slugifyHeading, type GuideTopic } from "@/lib/guide-topics";
import { absoluteUrl } from "@/lib/site";
import { withQuestionMark } from "@/lib/text-question";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) return { title: withQuestionMark(guide.title), description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { type: "article", title: withQuestionMark(guide.title), description: guide.description } };
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};
  const image = article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined;
  return {
    title: withQuestionMark(article.seoTitle),
    description: article.metaDescription,
    alternates: { canonical: `/guides/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.publishedAt, modifiedTime: article.updatedAt, images: image ? [image] : undefined },
  };
}

function safeSource(source: ArticleSource) {
  try {
    const url = new URL(source.url);
    return url.protocol === "https:" ? url.toString() : null;
  } catch { return null; }
}

function renderBlock(block: ArticleBlock, index: number) {
  if (block.type === "heading" && block.text) return block.level === 3 ? <h3 key={index}>{withQuestionMark(block.text)}</h3> : <h2 key={index} id={slugifyHeading(block.text)}>{withQuestionMark(block.text)}</h2>;
  if (block.type === "paragraph" && block.text) return <p key={index}>{block.text}</p>;
  if (block.type === "callout" && block.text) return <div className="notice" key={index}>{block.text}</div>;
  if (block.type === "list" && block.items?.length) return <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  return null;
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

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) {
    const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: withQuestionMark(guide.title), description: guide.description, dateModified: guide.reviewedOn, author: { "@type": "Organization", name: "TreatmentLane" }, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) };
    const guideFaqSchema = guide.faq?.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: withQuestionMark(item.question), acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
    const guideBreadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Guides", item: absoluteUrl("/guides") }, { "@type": "ListItem", position: 2, name: guide.title, item: absoluteUrl(`/guides/${guide.slug}`) }] };
    const topic = guideTopic(guide.slug);
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
          {guide.related?.length ? <section><h2>Related pages</h2><ul>{guide.related.map((item) => <li key={item.href}><Link href={item.href} prefetch={false}>{item.label}</Link></li>)}</ul></section> : null}
          <h2>Sources and further help</h2><ul>{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
        </article>
        <GuideAside headings={guide.sections.map((section) => section.heading)} topic={topic} hasFaq={Boolean(guide.faq?.length)} />
      </div>
    </>;
  }

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: withQuestionMark(article.title),
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    ...(article.reviewerName ? { reviewedBy: { "@type": "Person", name: article.reviewerName, honorificSuffix: article.reviewerCredentials || undefined } } : {}),
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    image: article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined,
  };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Guides", item: absoluteUrl("/guides") }, { "@type": "ListItem", position: 2, name: article.title, item: absoluteUrl(`/guides/${article.slug}`) }] };
  const faqSchema = article.faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((item) => ({ "@type": "Question", name: withQuestionMark(item.question), acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
  const publicationDate = new Date(article.reviewerName ? article.reviewedAt : article.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" });
  const reviewLabel = article.reviewerName ? `Clinically reviewed ${publicationDate}` : `Editorially checked ${publicationDate}`;
  const byline = article.reviewerName
    ? `Written by ${article.authorName}. Reviewed by ${article.reviewerName}${article.reviewerCredentials ? `, ${article.reviewerCredentials}` : ""}.`
    : `Written and source-checked by ${article.authorName}.`;
  const topic = guideTopic(article.slug);
  const articleHeadings = article.blocks.filter((block) => block.type === "heading" && block.level !== 3 && block.text).map((block) => block.text as string);
  const minutes = readingMinutes(article.blocks.map((block) => [block.text || "", ...(block.items || [])].join(" ")));
  return <><JsonLd data={articleSchema} /><JsonLd data={breadcrumbSchema} />{faqSchema ? <JsonLd data={faqSchema} /> : null}
    <IllustratedHero kind={topic.art} title={withQuestionMark(article.title)}>
      <p>{article.excerpt}</p>
      <p className="article-byline">{byline}</p>
      <ul className="article-meta"><li>{topic.label}</li><li>{minutes} min read</li><li>{reviewLabel}</li><li>{article.sources.length} {article.sources.length === 1 ? "source" : "sources"}</li></ul>
    </IllustratedHero>
    <div className="article-layout">
      <article className="prose">
        <div className="breadcrumb"><Link href="/guides" prefetch={false}>Guides</Link><span>/</span><Link href={`/guides#${topic.id}`} prefetch={false}>{topic.label}</Link></div>
        {article.hasThumbnail ? <Image className="article-thumbnail" src={`/api/content/articles/${article.id}/thumbnail`} alt={article.imageAlt} width={1200} height={800} priority /> : null}
        <div className="notice">Educational information only. This article does not provide a diagnosis or replace advice from a qualified healthcare professional.</div>
        {article.blocks.map(renderBlock)}
        <TopicDiagram topic={topic} />
        {article.faq.length ? <section id="faqs"><h2>Frequently asked questions</h2>{article.faq.map((item) => <div className="article-faq" key={item.question}><h3>{withQuestionMark(item.question)}</h3><p>{item.answer}</p></div>)}</section> : null}
        <h2>Sources</h2><ul>{article.sources.map((source) => { const href = safeSource(source); return href ? <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{source.title || source.label || source.publisher || href}</a></li> : null; })}</ul>
      </article>
      <GuideAside headings={articleHeadings} topic={topic} hasFaq={article.faq.length > 0} />
    </div>
  </>;
}
