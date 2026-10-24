import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedArticleSummaries } from "@/lib/articles";
import { guides } from "@/lib/content";

export const metadata: Metadata = { title: "Recovery and treatment decision guides", description: "Plain-language guides for verifying providers, understanding levels of care, and asking about treatment costs.", alternates: { canonical: "/guides" } };

export default async function GuidesPage() {
  const articles = await getPublishedArticleSummaries();
  const cards = [
    ...articles.map((article) => ({ slug: article.slug, title: article.title, description: article.excerpt, reviewedOn: article.reviewedAt })),
    ...guides,
  ];
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Guides</span><h1>Clear questions for difficult decisions</h1><p>These guides are educational and do not replace an assessment, diagnosis, or advice from a qualified professional.</p></div></section><section className="section"><div className="shell guide-grid">{cards.map((guide) => <article className="guide-card" key={guide.slug}><span>Reviewed {new Date(guide.reviewedOn).toLocaleDateString("en-US", { dateStyle: "medium" })}</span><h2><Link href={`/guides/${guide.slug}`} prefetch={false}>{guide.title}</Link></h2><p>{guide.description}</p><Link className="card-link" href={`/guides/${guide.slug}`} prefetch={false}>Read guide <ArrowRight size={16} /></Link></article>)}</div></section></>;
}
