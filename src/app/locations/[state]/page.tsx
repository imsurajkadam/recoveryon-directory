import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers3, MapPin, SearchX } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { EditorialTrust } from "@/components/editorial-trust";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { careCategories, states } from "@/lib/content";
import { stateEditorial } from "@/lib/state-editorial";
import { EDITORIAL_REVIEWED_ON, editorialAuthor, editorialSources } from "@/lib/editorial-trust";
import { getStateCategoryCounts, getStateTopCities, providerPath, searchProviders } from "@/lib/providers";
import { buildFaqPageJsonLd, getStateFaqs } from "@/lib/faq-schema";
import { FaqSection } from "@/components/faq-section";
import { fitSeoDescription, fitSeoTitle } from "@/lib/provider-seo";
import { absoluteUrl } from "@/lib/site";
import { cityPath } from "@/lib/city-pages";

export const revalidate = 3600;

export function generateStaticParams() { return states.map((state) => ({ state: state.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) return {};
  const { total } = await searchProviders({ state: state.code, pageSize: 1 });
  const count = total > 0 ? `${total.toLocaleString("en-US")} ` : "";
  return {
    title: { absolute: fitSeoTitle(`Compare ${count}Addiction Treatment Centers in ${state.name}`) },
    description: fitSeoDescription(`Compare ${count}addiction treatment centers in ${state.name}, with verified contacts, insurance info, and cost guidance to help you choose.`),
    alternates: { canonical: `/locations/${state.slug}` },
    robots: { index: total > 0, follow: true },
  };
}

export default async function StatePage({ params, searchParams }: { params: Promise<{ state: string }>; searchParams: Promise<{ page?: string }> }) {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) notFound();
  const editorial = stateEditorial[slug];
  const query = await searchParams;
  const result = await searchProviders({ state: state.code, page: Math.max(Number.parseInt(query.page || "1", 10) || 1, 1) });
  const [topCities, categoryCounts] = await Promise.all([getStateTopCities(state.code), getStateCategoryCounts(state.code)]);
  const categoryCountByName = new Map(categoryCounts.map((item) => [item.category, item.count]));
  const careTypes = careCategories
    .map((category) => ({ ...category, count: categoryCountByName.get(category.name) || 0 }))
    .filter((category) => category.count > 0);
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
  const faqs = getStateFaqs(state.name, result.total, editorial);
  return <>
    <JsonLd data={editorialJsonLd} />
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    {faqs.length ? <JsonLd data={buildFaqPageJsonLd(faqs)} /> : null}
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
    {topCities.length ? <section className="section"><div className="shell">
      <div className="results-heading"><div><h2>Top cities for treatment in {state.name}</h2><p>These cities have the most published listings in {state.name}. Select a city to filter the directory.</p></div></div>
      <div className="provider-location-grid">
        {topCities.map((item) => <Link className="provider-location-link" href={cityPath(state, item.city)} key={item.city} prefetch={false}><MapPin size={18} /><span><strong>{item.city}</strong><small>{item.count.toLocaleString("en-US")} {item.count === 1 ? "listing" : "listings"}</small></span></Link>)}
      </div>
    </div></section> : null}
    {careTypes.length ? <section className="section"><div className="shell">
      <div className="results-heading"><div><h2>Types of care in {state.name}</h2><p>Published listings in {state.name} by type of care. Select a type to filter the directory.</p></div></div>
      <div className="provider-location-grid">
        {careTypes.map((category) => <Link className="provider-location-link" href={`/directory?state=${state.code}&category=${encodeURIComponent(category.name)}`} key={category.slug} prefetch={false}><Layers3 size={18} /><span><strong>{category.name}</strong><small>{category.count.toLocaleString("en-US")} {category.count === 1 ? "listing" : "listings"}</small></span></Link>)}
      </div>
    </div></section> : null}
    <FaqSection faqs={faqs} />
    <section className="section" id="listings"><div className="shell">{result.providers.length ? <>
      <div className="results-heading"><div><h2>{result.total.toLocaleString()} listings in {state.name}</h2><p>Showing {result.providers.length} listings on this page. Use the advanced directory filters to narrow by insurance, level of care, and specialty.</p></div></div>
      <div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
      <Pagination pathname={`/locations/${state.slug}`} page={result.page} totalPages={result.totalPages} />
    </> : <div className="empty-state"><SearchX size={36} /><h2>No listings published for {state.name} yet</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}</div></section>
  </>;
}
