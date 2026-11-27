import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, SearchX, SlidersHorizontal } from "lucide-react";
import { BarList, StepsDiagram } from "@/components/illustrations";
import { JumpLinks } from "@/components/jump-links";
import { listingSteps } from "@/lib/care-facts";
import { withQuestionMark } from "@/lib/text-question";
import { ListingTrustNote } from "@/components/listing-trust-note";
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
    <section className="page-hero page-hero-compact"><div className="shell">
      <div className="breadcrumb"><Link href="/locations" prefetch={false}>Locations</Link><span>/</span><span>{state.name}</span></div>
      <h1>Treatment and recovery resources in {state.name}</h1>
      <p>Compare {result.total.toLocaleString("en-US")} published listings. Confirm licensing, services, insurance, and availability directly with each provider.</p>
      <JumpLinks label="On this page" links={[
        ...(topCities.length ? [{ href: "#cities", label: "Top cities" }] : []),
        ...(careTypes.length ? [{ href: "#care-types", label: "Types of care" }] : []),
        ...(editorial ? [{ href: "#guide", label: `${state.name} treatment guide` }] : []),
        ...(faqs.length ? [{ href: "#faqs", label: "FAQs" }] : []),
        { href: `/directory?state=${state.code}`, label: "Filter by insurance and more" },
      ]} />
    </div></section>
    <section className="section section-listings" id="listings"><div className="shell">{result.providers.length ? <>
      <div className="results-bar"><h2>{result.total.toLocaleString("en-US")} listings in {state.name}</h2><Link className="verified-toggle" href={`/directory?state=${state.code}`} prefetch={false}><SlidersHorizontal size={16} /> Filters</Link></div>
      <ListingTrustNote />
      <div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
      <Pagination pathname={`/locations/${state.slug}`} page={result.page} totalPages={result.totalPages} />
    </> : <div className="empty-state"><SearchX size={36} /><h2>No listings published for {state.name} yet</h2><p>Suggest an organization for review and inclusion.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}</div></section>
    {topCities.length ? <section className="section section-tint" id="cities"><div className="shell">
      <div className="results-heading"><div><h2>Top cities for treatment in {state.name}</h2><p>These cities have the most published listings in {state.name}. Select a city to see its listings.</p></div></div>
      <div className="provider-location-grid">
        {topCities.map((item) => <Link className="provider-location-link" href={cityPath(state, item.city)} key={item.city} prefetch={false}><MapPin size={18} /><span><strong>{item.city}</strong><small>{item.count.toLocaleString("en-US")} {item.count === 1 ? "listing" : "listings"}</small></span></Link>)}
      </div>
    </div></section> : null}
    {careTypes.length ? <section className="section" id="care-types"><div className="shell">
      <div className="results-heading"><div><h2>Types of care in {state.name}</h2><p>Published listings in {state.name} by type of care. Select a type to filter the directory.</p></div></div>
      <BarList items={careTypes.map((category) => ({ label: category.name, count: category.count, href: `/directory?state=${state.code}&category=${encodeURIComponent(category.name)}` }))} />
    </div></section> : null}
    <section className="section section-snug section-tint"><div className="shell">
      <div className="section-heading"><div><h2>How do you use these {state.name} listings?</h2><p>Four steps from first search to a decision.</p></div></div>
      <StepsDiagram steps={listingSteps} />
    </div></section>
    {editorial ? <section className="section state-guidance" id="guide"><div className="shell content-shell prose">
      <EditorialTrust />
      <h2>Finding addiction treatment in {state.name}</h2>
      <p>{editorial.intro}</p>
      {editorial.sections.map((section) => <section key={section.heading}><h3>{withQuestionMark(section.heading)}</h3><p>{section.body}</p></section>)}
    </div></section> : null}
    <FaqSection faqs={faqs} />
  </>;
}
