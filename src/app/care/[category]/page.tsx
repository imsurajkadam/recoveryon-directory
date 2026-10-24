import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { EditorialTrust } from "@/components/editorial-trust";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { careCategories } from "@/lib/content";
import { careEditorial } from "@/lib/care-editorial";
import { EDITORIAL_REVIEWED_ON, editorialAuthor, editorialSources } from "@/lib/editorial-trust";
import { hasPublishedProviders, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() { return careCategories.map((category) => ({ category: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = careCategories.find((item) => item.slug === slug);
  if (!category) return {};
  const hasListings = await hasPublishedProviders({ category: category.name });
  return {
    title: `${category.name}: compare options`,
    description: `${category.description} Compare providers, verify licensing, and find the right fit on TreatmentLane.`,
    alternates: { canonical: `/care/${category.slug}` },
    robots: { index: hasListings, follow: true },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> }) {
  const { category: slug } = await params;
  const category = careCategories.find((item) => item.slug === slug);
  if (!category) notFound();
  const editorial = careEditorial[slug];
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
  return <><JsonLd data={editorialJsonLd} />{itemListJsonLd && <JsonLd data={itemListJsonLd} />}<section className="page-hero"><div className="shell"><div className="breadcrumb"><Link href="/care" prefetch={false}>Types of care</Link><span>/</span><span>{category.name}</span></div><h1>{category.name}</h1><p>{category.description}</p></div></section><div className="shell detail-grid"><article className="prose"><EditorialTrust /><h2>What to know</h2><p>{category.guidance}</p>{editorial ? <><p>{editorial.intro}</p>{editorial.sections.map((section) => <section key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}</> : null}<h2>Questions worth asking</h2><ul><li>Who provides clinical oversight, and what credentials do they hold?</li><li>Which services are included, and which are billed separately?</li><li>How are emergencies, transfers, and aftercare handled?</li><li>How can licensing, accreditation, and insurance status be confirmed?</li></ul><div className="notice">TreatmentLane does not determine clinical suitability. Confirm important details directly and seek a professional assessment when appropriate.</div></article><aside className="detail-sidebar"><h2>Explore this category</h2><p>{result.total.toLocaleString()} published {result.total === 1 ? "listing" : "listings"}</p><Link className="button" href={`/directory?category=${encodeURIComponent(category.name)}`} prefetch={false}>Search directory</Link></aside></div><section className="section section-tint"><div className="shell">{result.providers.length ? <><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname={`/care/${category.slug}`} page={result.page} totalPages={result.totalPages} /></> : <div className="empty-state"><SearchX size={36} /><h2>Listings are being added</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}</div></section></>;
}
