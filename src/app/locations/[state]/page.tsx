import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { EditorialTrust } from "@/components/editorial-trust";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { states } from "@/lib/content";
import { stateEditorial } from "@/lib/state-editorial";
import { EDITORIAL_REVIEWED_ON, editorialAuthor, editorialSources } from "@/lib/editorial-trust";
import { hasPublishedProviders, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() { return states.map((state) => ({ state: state.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) return {};
  const hasListings = await hasPublishedProviders({ state: state.code });
  return { title: `Treatment resources in ${state.name}`, description: `Find and compare published addiction treatment, detox, mental health, and recovery resources in ${state.name}. Verify licensing, services, and insurance.`, alternates: { canonical: `/locations/${state.slug}` }, robots: { index: hasListings, follow: true } };
}

export default async function StatePage({ params, searchParams }: { params: Promise<{ state: string }>; searchParams: Promise<{ page?: string }> }) {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) notFound();
  const editorial = stateEditorial[slug];
  const query = await searchParams;
  const result = await searchProviders({ state: state.code, page: Math.max(Number.parseInt(query.page || "1", 10) || 1, 1) });
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
  const editorialJsonLd = { "@context": "https://schema.org", "@type": "WebPage", name: `Treatment and recovery resources in ${state.name}`, dateModified: EDITORIAL_REVIEWED_ON, author: { "@type": "Organization", name: editorialAuthor.name, url: absoluteUrl(editorialAuthor.url) }, citation: editorialSources.map((source) => source.href), mainEntityOfPage: absoluteUrl(`/locations/${state.slug}`) };
  return <>
    <JsonLd data={editorialJsonLd} />
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/locations" prefetch={false}>Locations</Link><span>/</span><span>{state.name}</span></div>
      <h1>Treatment and recovery resources in {state.name}</h1>
      <p>Compare published listings and confirm licensing, services, insurance, and availability directly.</p>
      <div className="inline-actions"><a className="button" href="#listings">View {result.total.toLocaleString()} listings</a><Link className="button button-secondary" href={`/directory?state=${state.code}`} prefetch={false}>Use advanced filters</Link></div>
    </div></section>
    {editorial ? <section className="section state-guidance"><div className="shell content-shell prose">
      <EditorialTrust />
      <h2>Finding addiction treatment in {state.name}</h2>
      <p>{editorial.intro}</p>
      {editorial.sections.map((section) => <section key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}
    </div></section> : null}
    <section className="section" id="listings"><div className="shell">{result.providers.length ? <>
      <div className="results-heading"><div><h2>{result.total.toLocaleString()} listings in {state.name}</h2><p>Showing {result.providers.length} listings on this page. Use the advanced directory filters to narrow by insurance, level of care, and specialty.</p></div></div>
      <div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
      <Pagination pathname={`/locations/${state.slug}`} page={result.page} totalPages={result.totalPages} />
    </> : <div className="empty-state"><SearchX size={36} /><h2>No listings published for {state.name} yet</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}</div></section>
  </>;
}
