import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, MapPin, SearchX } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { buildFaqPageJsonLd, type FaqEntry } from "@/lib/faq-schema";
import { CITY_CARE_MIN_LISTINGS, CITY_INDEX_MIN_LISTINGS, careSearchFilter, cityCarePath, cityCareTypes, cityAliasSlug, cityPath, citySlug, stateBySlug } from "@/lib/city-pages";
import { fitSeoDescription, fitSeoTitle } from "@/lib/provider-seo";
import { getStateCities, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

async function resolveCity(stateSlug: string, slug: string) {
  const state = stateBySlug(stateSlug);
  if (!state) return null;
  const cities = await getStateCities(state.code);
  const match = cities.find((item) => citySlug(item.city) === slug);
  return match ? { state, city: match.city, count: match.count, cities } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: slug } = await params;
  const resolved = await resolveCity(stateSlug, slug);
  if (!resolved) return {};
  const { state, city, count } = resolved;
  return {
    title: { absolute: fitSeoTitle(`${count.toLocaleString("en-US")} Addiction Treatment & Rehab Centers in ${city}, ${state.code}`) },
    description: fitSeoDescription(`Compare ${count.toLocaleString("en-US")} addiction treatment, detox, sober living, and mental health listings in ${city}, ${state.name}, with insurance information and contact details.`),
    alternates: { canonical: cityPath(state, city) },
    robots: { index: count >= CITY_INDEX_MIN_LISTINGS, follow: true },
  };
}

export default async function CityPage({ params, searchParams }: { params: Promise<{ state: string; city: string }>; searchParams: Promise<{ page?: string }> }) {
  const { state: stateSlug, city: slug } = await params;
  const resolved = await resolveCity(stateSlug, slug);
  if (!resolved) {
    const state = stateBySlug(stateSlug);
    const alias = state ? cityAliasSlug(state.code, slug) : null;
    if (state && alias && (await getStateCities(state.code)).some((item) => citySlug(item.city) === alias)) permanentRedirect(`/locations/${state.slug}/${alias}`);
    notFound();
  }
  const { state, city, cities } = resolved;
  const query = await searchParams;
  const page = Math.max(Number.parseInt(query.page || "1", 10) || 1, 1);
  const [result, medicaid, ...careTotals] = await Promise.all([
    searchProviders({ state: state.code, city, page }),
    searchProviders({ state: state.code, city, insurance: "Medicaid", pageSize: 1 }),
    ...cityCareTypes.map((type) => searchProviders({ state: state.code, city, ...careSearchFilter(type), pageSize: 1 })),
  ]);
  const careLinks = cityCareTypes
    .map((type, index) => ({ type, count: careTotals[index].total }))
    .filter((item) => item.count >= CITY_CARE_MIN_LISTINGS);
  const nearbyCities = cities.filter((item) => item.city !== city && item.count >= 10).slice(0, 8);
  const path = cityPath(state, city);

  const faqs: FaqEntry[] = [
    { question: `How many addiction treatment centers are in ${city}, ${state.code}?`, answer: `TreatmentLane lists ${result.total.toLocaleString("en-US")} published addiction treatment, detox, sober living, and mental health listings in ${city}, ${state.name}. Confirm licensing, services, and availability directly with each provider.` },
    ...(medicaid.total > 0 ? [{ question: `Are there rehabs in ${city} that accept Medicaid?`, answer: `${medicaid.total.toLocaleString("en-US")} listings in ${city} report accepting Medicaid. Insurance participation can change, so confirm network status with the provider and your plan before starting treatment.` }] : []),
    ...careLinks.map(({ type, count }) => ({ question: `How many ${type.short} options are in ${city}?`, answer: `TreatmentLane lists ${count.toLocaleString("en-US")} ${count === 1 ? type.singular : `${type.singular}s`} in ${city}, ${state.code}. See the ${type.label.toLowerCase()} page for the full list.` })),
  ];
  const itemListJsonLd = result.providers.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: result.providers.map((provider, index) => ({ "@type": "ListItem", position: index + 1, name: provider.name, url: absoluteUrl(providerPath(provider)) })),
  } : null;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Locations", item: absoluteUrl("/locations") },
      { "@type": "ListItem", position: 2, name: state.name, item: absoluteUrl(`/locations/${state.slug}`) },
      { "@type": "ListItem", position: 3, name: city, item: absoluteUrl(path) },
    ],
  };

  return <>
    <JsonLd data={breadcrumbJsonLd} />
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    {faqs.length ? <JsonLd data={buildFaqPageJsonLd(faqs)} /> : null}
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/locations" prefetch={false}>Locations</Link><span>/</span><Link href={`/locations/${state.slug}`} prefetch={false}>{state.name}</Link><span>/</span><span>{city}</span></div>
      <h1>Addiction treatment and rehab centers in {city}, {state.code}</h1>
      <p>TreatmentLane lists {result.total.toLocaleString("en-US")} published treatment and recovery listings in {city}, {state.name}{medicaid.total > 0 ? `, including ${medicaid.total.toLocaleString("en-US")} that report accepting Medicaid` : ""}. Compare services and insurance, then confirm details directly with each provider.</p>
      <div className="inline-actions"><a className="button" href="#listings">View {result.total.toLocaleString("en-US")} listings</a><Link className="button button-secondary" href={`/directory?state=${state.code}&location=${encodeURIComponent(city)}`} prefetch={false}>Use advanced filters</Link></div>
    </div></section>

    {careLinks.length ? <section className="section"><div className="shell">
      <div className="results-heading"><div><h2>Types of care in {city}</h2><p>Browse {city} listings by the kind of support you need.</p></div></div>
      <div className="provider-location-grid">
        {careLinks.map(({ type, count }) => <Link className="provider-location-link" href={cityCarePath(state, city, type.slug)} key={type.slug} prefetch={false}><ArrowRight size={18} /><span><strong>{type.label} in {city}</strong><small>{count.toLocaleString("en-US")} {count === 1 ? "listing" : "listings"}</small></span></Link>)}
      </div>
    </div></section> : null}

    <section className="section section-tint" id="listings"><div className="shell">
      <div className="results-heading"><div><h2>{result.total.toLocaleString("en-US")} listings in {city}</h2><p>Featured listings appear first and are clearly labeled. TreatmentLane Verified listings were claimed and confirmed by the provider.</p></div></div>
      {result.providers.length
        ? <><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname={path} page={result.page} totalPages={result.totalPages} /></>
        : <div className="empty-state"><SearchX size={36} /><h2>No listings yet</h2><p>Suggest an organization for review.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}
    </div></section>

    {nearbyCities.length ? <section className="section"><div className="shell">
      <div className="results-heading"><div><h2>Other cities in {state.name}</h2><p>Compare treatment options in nearby cities, or <Link href={`/locations/${state.slug}`} prefetch={false}>see all of {state.name}</Link>.</p></div></div>
      <div className="provider-location-grid">
        {nearbyCities.map((item) => <Link className="provider-location-link" href={cityPath(state, item.city)} key={item.city} prefetch={false}><MapPin size={18} /><span><strong>{item.city}</strong><small>{item.count.toLocaleString("en-US")} listings</small></span></Link>)}
      </div>
    </div></section> : null}

    <FaqSection faqs={faqs} />
  </>;
}
