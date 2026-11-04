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
import { listingRobots } from "@/lib/listing-robots";
import { slugifyPlace } from "@/lib/places";
import { getPublishedCities, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() { return states.map((state) => ({ state: state.slug })); }

export async function generateMetadata({ params, searchParams }: { params: Promise<{ state: string }>; searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const query = await searchParams;
  const state = states.find((item) => item.slug === slug);
  if (!state) return {};
  const robots = listingRobots(query, `/locations/${state.slug}`);
  const page = Math.max(Number.parseInt(query.page || "1", 10) || 1, 1);
  return {
    title: page > 1 ? `Treatment resources in ${state.name}, page ${page}` : `Treatment resources in ${state.name}`,
    description: `Find and compare published addiction treatment, detox, mental health, and recovery resources in ${state.name}. Verify licensing, services, and insurance.`,
    alternates: { canonical: robots.canonical },
    robots: { index: robots.index, follow: true },
  };
}

export default async function StatePage({ params, searchParams }: { params: Promise<{ state: string }>; searchParams: Promise<{ page?: string }> }) {
  const { state: slug } = await params;
  const state = states.find((item) => item.slug === slug);
  if (!state) notFound();
  const editorial = stateEditorial[slug];
  const query = await searchParams;
  const [result, cities] = await Promise.all([
    searchProviders({ state: state.code, page: Math.max(Number.parseInt(query.page || "1", 10) || 1, 1) }),
    getPublishedCities(state.code),
  ]);
  if (result.outOfRange) notFound();
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
  const stateFaq = result.total > 0 ? [{
    question: `How many providers does TreatmentLane list in ${state.name}?`,
    answer: `TreatmentLane publishes ${result.total.toLocaleString()} ${result.total === 1 ? "listing" : "listings"} in ${state.name}.`,
  }] : [];
  const editorialJsonLd = { "@context": "https://schema.org", "@type": "WebPage", name: `Treatment and recovery resources in ${state.name}`, dateModified: EDITORIAL_REVIEWED_ON, author: { "@type": "Organization", name: editorialAuthor.name, url: absoluteUrl(editorialAuthor.url) }, citation: editorialSources.map((source) => source.href), mainEntityOfPage: absoluteUrl(`/locations/${state.slug}`) };
  return <>
    <JsonLd data={editorialJsonLd} />
    {stateFaq.length > 0 && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: stateFaq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />}
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/locations" prefetch={false}>Locations</Link><span>/</span><span>{state.name}</span></div>
      <h1>Treatment and recovery resources in {state.name}</h1>
      <p>Compare published listings and confirm licensing, services, insurance, and availability directly.</p>
      {stateFaq.map((item) => <div className="article-faq" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
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
      {cities.length > 0 && <nav className="city-index" aria-label={`Cities in ${state.name}`}><h2>Cities in {state.name}</h2><div className="all-states">{cities.map((city) => <Link key={`${city.city}-${city.count}`} href={`/locations/${state.slug}/${slugifyPlace(city.city)}`} prefetch={false}>{city.city} <span>({city.count.toLocaleString()})</span></Link>)}</div></nav>}
    </> : <div className="empty-state"><SearchX size={36} /><h2>No listings published for {state.name} yet</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}</div></section>
  </>;
}
