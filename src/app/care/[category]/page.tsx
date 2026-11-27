import type { Metadata } from "next";
import { RelatedGuides } from "@/components/related-guides";
import { guidesForPillar } from "@/lib/internal-links";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { CareLadder } from "@/components/illustrations";
import { JumpLinks } from "@/components/jump-links";
import { careFacts } from "@/lib/care-facts";
import { withQuestionMark } from "@/lib/text-question";
import { ListingTrustNote } from "@/components/listing-trust-note";
import { JsonLd } from "@/components/json-ld";
import { EditorialTrust } from "@/components/editorial-trust";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { careCategories } from "@/lib/content";
import { careEditorial } from "@/lib/care-editorial";
import { EDITORIAL_REVIEWED_ON, editorialAuthor, editorialSources } from "@/lib/editorial-trust";
import { providerPath, searchProviders } from "@/lib/providers";
import { buildFaqPageJsonLd, getCareFaqs } from "@/lib/faq-schema";
import { FaqSection } from "@/components/faq-section";
import { fitSeoDescription, fitSeoTitle } from "@/lib/provider-seo";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return careCategories.map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = careCategories.find((item) => item.slug === slug);
  if (!category) return {};
  const { total } = await searchProviders({ category: category.name, pageSize: 1 });
  const count = total > 0 ? `${total.toLocaleString("en-US")} ` : "";
  return {
    title: { absolute: fitSeoTitle(`Compare ${count}${category.name}: Costs & Insurance`) },
    description: fitSeoDescription(`${category.description} Compare ${count}listings, with costs and insurance explained.`),
    alternates: { canonical: `/care/${category.slug}` },
    robots: { index: total >= 10, follow: true },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> }) {
  const { category: slug } = await params;
  const category = careCategories.find((item) => item.slug === slug);
  if (!category) notFound();
  const editorial = careEditorial[slug];
  const facts = careFacts[slug];
  const query = await searchParams;
  const result = await searchProviders({ category: category.name, page: Math.max(Number.parseInt(query.page || "1", 10) || 1, 1) });
  const itemListJsonLd = result.providers.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: result.providers.map((provider, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: provider.name,
      url: absoluteUrl(providerPath(provider)),
    })),
  } : null;
  const editorialJsonLd = { "@context": "https://schema.org", "@type": "MedicalWebPage", name: category.name, description: category.description, dateModified: EDITORIAL_REVIEWED_ON, author: { "@type": "Organization", name: editorialAuthor.name, url: absoluteUrl(editorialAuthor.url) }, citation: editorialSources.map((source) => source.href), mainEntityOfPage: absoluteUrl(`/care/${category.slug}`) };
  const faqs = getCareFaqs(category.name, category.shortName, category.guidance, result.total, editorial);
  const topicGuides = await guidesForPillar(`/care/${category.slug}`, [category.name]);
  return <><JsonLd data={editorialJsonLd} />{itemListJsonLd && <JsonLd data={itemListJsonLd} />}{faqs.length ? <JsonLd data={buildFaqPageJsonLd(faqs)} /> : null}<section className="page-hero page-hero-compact"><div className="shell"><div className="breadcrumb"><Link href="/care" prefetch={false}>Types of care</Link><span>/</span><span>{category.name}</span></div><h1>{category.name}</h1><p>{category.description}</p><JumpLinks label="On this page" links={[...(facts ? [{ href: "#at-a-glance", label: "At a glance" }] : []), { href: "#guide", label: "What to know" }, ...(faqs.length ? [{ href: "#faqs", label: "FAQs" }] : []), { href: `/directory?category=${encodeURIComponent(category.name)}`, label: "Filter by state and insurance" }]} /></div></section>
    <section className="section section-listings" id="listings"><div className="shell">{result.providers.length ? <><div className="results-bar"><h2>{result.total.toLocaleString("en-US")} {category.name.toLowerCase()} {result.total === 1 ? "listing" : "listings"}</h2><Link className="verified-toggle" href={`/directory?category=${encodeURIComponent(category.name)}`} prefetch={false}><SlidersHorizontal size={16} /> Filters</Link></div><ListingTrustNote /><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname={`/care/${category.slug}`} page={result.page} totalPages={result.totalPages} /></> : <div className="empty-state"><SearchX size={36} /><h2>Listings are being added</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}</div></section>
    {facts ? <section className="section section-snug section-tint" id="at-a-glance"><div className="shell">
      <div className="section-heading"><div><h2>{category.name} at a glance</h2><p>General information only. Programs differ, so confirm the details with each provider.</p></div></div>
      <dl className="fact-grid">
        <div><dt>Where it happens</dt><dd>{facts.setting}</dd></div>
        <div><dt>Typical schedule</dt><dd>{facts.schedule}</dd></div>
        <div><dt>Typical length</dt><dd>{facts.length}</dd></div>
        <div><dt>Often a fit for</dt><dd>{facts.fits}</dd></div>
        <div className="fact-wide"><dt>Good to know</dt><dd>{facts.next}</dd></div>
      </dl>
      <div style={{ marginTop: 30 }}><h3 style={{ marginBottom: 14 }}>Where {category.shortName.toLowerCase()} sits among the levels of care</h3><CareLadder current={facts.ladder} /></div>
    </div></section> : null}
    <div className="shell detail-grid" id="guide"><article className="prose"><EditorialTrust /><h2>What to know</h2><p>{category.guidance}</p>{editorial ? <><p>{editorial.intro}</p>{editorial.sections.map((section) => <section key={section.heading}><h3>{withQuestionMark(section.heading)}</h3><p>{section.body}</p></section>)}</> : null}<h2>Questions worth asking</h2><ul><li>Who provides clinical oversight, and what credentials do they hold?</li><li>Which services are included, and which are billed separately?</li><li>How are emergencies, transfers, and aftercare handled?</li><li>How can licensing, accreditation, and insurance status be confirmed?</li></ul><div className="notice">TreatmentLane does not determine clinical suitability. Confirm important details directly and seek a professional assessment when appropriate.</div></article><aside className="detail-sidebar"><h2>Explore this category</h2><p>{result.total.toLocaleString()} published {result.total === 1 ? "listing" : "listings"}</p><Link className="button" href={`/directory?category=${encodeURIComponent(category.name)}`} prefetch={false}>Search directory</Link></aside></div>{topicGuides.length ? <section className="section"><div className="shell"><RelatedGuides guides={topicGuides} title={`Guides on ${category.name.toLowerCase()}`} id="category-guides" className="is-wide" /></div></section> : null}<FaqSection faqs={faqs} /></>;
}
