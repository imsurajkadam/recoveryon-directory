import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getPublishedArticleBySlug, type ArticleBlock, type ArticleSource } from "@/lib/articles";
import { guides } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` }, openGraph: { type: "article", title: guide.title, description: guide.description } };
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};
  const image = article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined;
  return {
    title: article.seoTitle,
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
  if (block.type === "heading" && block.text) return block.level === 3 ? <h3 key={index}>{block.text}</h3> : <h2 key={index}>{block.text}</h2>;
  if (block.type === "paragraph" && block.text) return <p key={index}>{block.text}</p>;
  if (block.type === "callout" && block.text) return <div className="notice" key={index}>{block.text}</div>;
  if (block.type === "list" && block.items?.length) return <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  return null;
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (guide) {
    const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, dateModified: guide.reviewedOn, author: { "@type": "Organization", name: "TreatmentLane" }, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) };
    return <><JsonLd data={jsonLd} /><section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/guides" prefetch={false}>Guides</Link><span>/</span><span>{guide.title}</span></div><span className="kicker plain">Reviewed {new Date(guide.reviewedOn).toLocaleDateString("en-US", { dateStyle: "long" })}</span><h1>{guide.title}</h1><p>{guide.description}</p></div></section><article className="content-shell prose"><div className="notice">Educational information only. Individual circumstances differ, and this guide does not provide medical, legal, or insurance advice.</div>{guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<h2>Sources and further help</h2><ul>{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></article></>;
  }

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    ...(article.reviewerName ? { reviewedBy: { "@type": "Person", name: article.reviewerName, honorificSuffix: article.reviewerCredentials || undefined } } : {}),
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    image: article.hasThumbnail ? absoluteUrl(`/api/content/articles/${article.id}/thumbnail`) : undefined,
  };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Guides", item: absoluteUrl("/guides") }, { "@type": "ListItem", position: 2, name: article.title, item: absoluteUrl(`/guides/${article.slug}`) }] };
  const faqSchema = article.faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;
  const publicationDate = new Date(article.reviewerName ? article.reviewedAt : article.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" });
  const reviewLabel = article.reviewerName ? `Clinically reviewed ${publicationDate}` : `Editorially checked ${publicationDate}`;
  const byline = article.reviewerName
    ? `Written by ${article.authorName}. Reviewed by ${article.reviewerName}${article.reviewerCredentials ? `, ${article.reviewerCredentials}` : ""}.`
    : `Written and source-checked by ${article.authorName}.`;
  return <><JsonLd data={articleSchema} /><JsonLd data={breadcrumbSchema} />{faqSchema ? <JsonLd data={faqSchema} /> : null}<section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/guides" prefetch={false}>Guides</Link><span>/</span><span>{article.title}</span></div><span className="kicker plain">{reviewLabel}</span><h1>{article.title}</h1><p>{article.excerpt}</p><p className="article-byline">{byline}</p></div></section><article className="content-shell prose">{article.hasThumbnail ? <Image className="article-thumbnail" src={`/api/content/articles/${article.id}/thumbnail`} alt={article.imageAlt} width={1200} height={800} priority /> : null}<div className="notice">Educational information only. This article does not provide a diagnosis or replace advice from a qualified healthcare professional.</div>{article.blocks.map(renderBlock)}{article.faq.length ? <section><h2>Frequently asked questions</h2>{article.faq.map((item) => <div className="article-faq" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section> : null}<h2>Sources</h2><ul>{article.sources.map((source) => { const href = safeSource(source); return href ? <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{source.title || source.label || source.publisher || href}</a></li> : null; })}</ul></article></>;
}
