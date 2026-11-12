import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { FaqSection } from "@/components/faq-section";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { buildFaqPageJsonLd, type FaqEntry } from "@/lib/faq-schema";
import { CITY_CARE_MIN_LISTINGS, careSearchFilter, careTypeBySlug, cityCarePath, cityCareTypes, cityPath, citySlug, isIndexedCityCarePage, stateBySlug } from "@/lib/city-pages";
import { fitSeoDescription, fitSeoTitle } from "@/lib/provider-seo";
import { getStateCities, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

async function resolvePage(stateSlug: string, slug: string, careSlug: string) {
  const state = stateBySlug(stateSlug);
  const type = careTypeBySlug(careSlug);
  if (!state || !type) return null;
  const cities = await getStateCities(state.code);
  const match = cities.find((item) => citySlug(item.city) === slug);
  if (!match) return null;
  const { total } = await searchProviders({ state: state.code, city: match.city, ...careSearchFilter(type), pageSize: 1 });
  if (total < CITY_CARE_MIN_LISTINGS) return null;
  return { state, type, city: match.city, total, cities };
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; city: string; care: string }> }): Promise<Metadata> {
  const { state: stateSlug, city: slug, care } = await params;
  const resolved = await resolvePage(stateSlug, slug, care);
  if (!resolved) return {};
  const { state, type, city, total } = resolved;
  return {
    title: { absolute: fitSeoTitle(`${total.toLocaleString("en-US")} ${type.label} in ${city}, ${state.code}`) },
    description: fitSeoDescription(`Compare ${total.toLocaleString("en-US")} ${type.label.toLowerCase()} in ${city}, ${state.name}. See insurance, services, and contact details, with TreatmentLane Verified listings shown first.`),
    alternates: { canonical: cityCarePath(state, city, type.slug) },
    robots: { index: isIndexedCityCarePage(state.code, city, type.slug), follow: true },
  };
}

export default async function CityCarePage({ params, searchParams }: { params: Promise<{ state: string; city: string; care: string }>; searchParams: Promise<{ page?: string }> }) {
  const { state: stateSlug, city: slug, care } = await params;
  const resolved = await resolvePage(stateSlug, slug, care);
  if (!resolved) notFound();
  const { state, type, city, cities } = resolved;
  const query = await searchParams;
  const page = Math.max(Number.parseInt(query.page || "1", 10) || 1, 1);
  const filter = careSearchFilter(type);
  const otherTypes = cityCareTypes.filter((item) => item.slug !== type.slug);
  const nearby = cities.filter((item) => item.city !== city && item.count >= 10).slice(0, 10);
  const [result, medicaid, verified, ...otherTotals] = await Promise.all([
    searchProviders({ state: state.code, city, ...filter, page }),
    searchProviders({ state: state.code, city, ...filter, insurance: "Medicaid", pageSize: 1 }),
    searchProviders({ state: state.code, city, ...filter, verified: true, pageSize: 1 }),
    ...otherTypes.map((item) => searchProviders({ state: state.code, city, ...careSearchFilter(item), pageSize: 1 })),
    ...nearby.map((item) => searchProviders({ state: state.code, city: item.city, ...filter, pageSize: 1 })),
  ]);
  const otherTypeLinks = otherTypes.map((item, index) => ({ item, count: otherTotals[index].total })).filter((entry) => entry.count >= CITY_CARE_MIN_LISTINGS);
  const nearbyLinks = nearby.map((item, index) => ({ city: item.city, count: otherTotals[otherTypes.length + index].total })).filter((entry) => entry.count >= CITY_CARE_MIN_LISTINGS).slice(0, 6);
  const path = cityCarePath(state, city, type.slug);
  const total = result.total;
  const noun = total === 1 ? type.singular : `${type.singular}s`;

  const faqs: FaqEntry[] = [
    { question: `How many ${type.short} options are in ${city}, ${state.code}?`, answer: `TreatmentLane lists ${total.toLocaleString("en-US")} ${noun} in ${city}, ${state.name}${medicaid.total > 0 ? `, and ${medicaid.total.toLocaleString("en-US")} of them report accepting Medicaid` : ""}. Confirm services, availability, and cost directly with each provider.` },
    ...type.questions,
  ];
  const itemListJsonLd = result.providers.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${type.label} in ${city}, ${state.code}`,
    itemListElement: result.providers.map((provider, index) => ({ "@type": "ListItem", position: index + 1, name: provider.name, url: absoluteUrl(providerPath(provider)) })),
  } : null;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Locations", item: absoluteUrl("/locations") },
      { "@type": "ListItem", position: 2, name: state.name, item: absoluteUrl(`/locations/${state.slug}`) },
      { "@type": "ListItem", position: 3, name: city, item: absoluteUrl(cityPath(state, city)) },
      { "@type": "ListItem", position: 4, name: type.label, item: absoluteUrl(path) },
    ],
  };

  return <>
    <JsonLd data={breadcrumbJsonLd} />
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    <JsonLd data={buildFaqPageJsonLd(faqs)} />
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/locations" prefetch={false}>Locations</Link><span>/</span><Link href={`/locations/${state.slug}`} prefetch={false}>{state.name}</Link><span>/</span><Link href={cityPath(state, city)} prefetch={false}>{city}</Link><span>/</span><span>{type.label}</span></div>
      <h1>{total.toLocaleString("en-US")} {type.label} in {city}, {state.code}</h1>
      <p>TreatmentLane lists {total.toLocaleString("en-US")} {noun} in {city}, {state.name}{medicaid.total > 0 ? `; ${medicaid.total.toLocaleString("en-US")} report accepting Medicaid` : ""}{verified.total > 0 ? ` and ${verified.total.toLocaleString("en-US")} ${verified.total === 1 ? "is" : "are"} TreatmentLane Verified` : ""}. Compare listings below and confirm details directly with each provider.</p>
      <div className="inline-actions"><a className="button" href="#listings">View {total.toLocaleString("en-US")} listings</a><Link className="button button-secondary" href={cityPath(state, city)} prefetch={false}>All care types in {city}</Link></div>
    </div></section>

    <section className="section"><div className="shell content-shell prose">
      <h2>About {type.short} in {city}</h2>
      <p>{type.intro}</p>
      <p>When you compare {type.short} options in {city}, ask about licensing or certification, staffing, insurance and total cost, and what happens after discharge. Verified listings were claimed by the provider, who confirmed their contact details directly with TreatmentLane.</p>
    </div></section>

    <section className="section section-tint" id="listings"><div className="shell">
      <div className="results-heading"><div><h2>{type.label} in {city}</h2><p>Featured listings appear first and are clearly labeled.</p></div></div>
      <div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
      <Pagination pathname={path} page={result.page} totalPages={result.totalPages} />
    </div></section>

    {(otherTypeLinks.length || nearbyLinks.length) ? <section className="section"><div className="shell">
      {otherTypeLinks.length ? <><div className="results-heading"><div><h2>Other care in {city}</h2></div></div>
        <div className="provider-location-grid">
          {otherTypeLinks.map(({ item, count }) => <Link className="provider-location-link" href={cityCarePath(state, city, item.slug)} key={item.slug} prefetch={false}><ArrowRight size={18} /><span><strong>{item.label} in {city}</strong><small>{count.toLocaleString("en-US")} listings</small></span></Link>)}
        </div></> : null}
      {nearbyLinks.length ? <><div className="results-heading spacer-top"><div><h2>{type.label} near {city}</h2></div></div>
        <div className="provider-location-grid">
          {nearbyLinks.map((entry) => <Link className="provider-location-link" href={cityCarePath(state, entry.city, type.slug)} key={entry.city} prefetch={false}><ArrowRight size={18} /><span><strong>{type.label} in {entry.city}</strong><small>{entry.count.toLocaleString("en-US")} listings</small></span></Link>)}
        </div></> : null}
    </div></section> : null}

    <FaqSection faqs={faqs} />
  </>;
}
