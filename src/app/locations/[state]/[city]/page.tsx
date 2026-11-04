import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchX } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { listingRobots } from "@/lib/listing-robots";
import { clampMetaDescription } from "@/lib/provider-display";
import { slugifyPlace } from "@/lib/places";
import { getPublishedCities, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { states } from "@/lib/us-states";

export const revalidate = 3600;

function matches(stateCode: string, citySlug: string, cities: Awaited<ReturnType<typeof getPublishedCities>>) {
  return cities.filter((city) => city.state === stateCode && slugifyPlace(city.city) === citySlug);
}

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const query = await searchParams;
  const state = states.find((item) => item.slug === stateSlug);
  if (!state) return {};
  const cities = matches(state.code, citySlug, await getPublishedCities(state.code));
  if (!cities.length) return {};
  const cityName = cities.length === 1 ? cities[0].city : cities.map((city) => city.city).join(" / ");
  const path = `/locations/${state.slug}/${citySlug}`;
  const robots = listingRobots(query, path);
  const page = Math.max(Number.parseInt(query.page || "1", 10) || 1, 1);
  return {
    title: page > 1 ? `Treatment resources in ${cityName}, ${state.code}, page ${page}` : `Treatment resources in ${cityName}, ${state.code}`,
    description: clampMetaDescription(`Compare ${cities.reduce((sum, city) => sum + city.count, 0).toLocaleString()} published addiction treatment and mental health listings in ${cityName}, ${state.name}. Confirm licensing, services, and insurance.`),
    alternates: { canonical: robots.canonical },
    robots: { index: robots.index, follow: true },
  };
}

export default async function CityPage({ params, searchParams }: {
  params: Promise<{ state: string; city: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = states.find((item) => item.slug === stateSlug);
  if (!state) notFound();
  const cities = matches(state.code, citySlug, await getPublishedCities(state.code));
  if (!cities.length) notFound();
  const cityName = cities.length === 1 ? cities[0].city : cities.map((city) => city.city).join(" / ");
  const query = await searchParams;
  const result = await searchProviders({
    state: state.code,
    cities: cities.map((city) => city.city),
    page: Math.max(Number.parseInt(query.page || "1", 10) || 1, 1),
  });
  if (result.outOfRange) notFound();
  const path = `/locations/${state.slug}/${citySlug}`;
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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Locations", item: absoluteUrl("/locations") },
      { "@type": "ListItem", position: 2, name: state.name, item: absoluteUrl(`/locations/${state.slug}`) },
      { "@type": "ListItem", position: 3, name: cityName, item: absoluteUrl(path) },
    ],
  };
  return <>
    <JsonLd data={breadcrumbJsonLd} />
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    <section className="page-hero"><div className="shell">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/locations" prefetch={false}>Locations</Link><span aria-hidden="true">/</span><Link href={`/locations/${state.slug}`} prefetch={false}>{state.name}</Link><span aria-hidden="true">/</span><span>{cityName}</span></nav>
      <h1>Treatment and recovery resources in {cityName}, {state.name}</h1>
      <p>TreatmentLane publishes {result.total.toLocaleString()} {result.total === 1 ? "listing" : "listings"} in {cityName}. Confirm licensing, services, insurance, and availability directly before making a decision.</p>
    </div></section>
    <section className="section" id="listings"><div className="shell">{result.providers.length ? <>
      <div className="results-heading"><div><h2>{result.total.toLocaleString()} listings in {cityName}</h2><p>Showing {result.providers.length} listings on this page.</p></div></div>
      <div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
      <Pagination pathname={path} page={result.page} totalPages={result.totalPages} />
    </> : <div className="empty-state"><SearchX size={36} /><h2>No listings published for {cityName} yet</h2><p>Browse the rest of {state.name} or suggest an organization for review.</p><Link className="button" href={`/locations/${state.slug}`} prefetch={false}>View {state.name}</Link></div>}</div></section>
  </>;
}
