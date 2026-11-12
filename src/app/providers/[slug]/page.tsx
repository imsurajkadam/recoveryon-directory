import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ProviderCard } from "@/components/provider-card";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getOrganizationCtrMetadata, getProviderCtrMetadata } from "@/lib/provider-metadata";
import { fitSeoDescription, fitSeoTitle, isProviderIndexable } from "@/lib/provider-seo";
import { stateByCode } from "@/lib/city-pages";
import { absoluteUrl } from "@/lib/site";
import type { Provider } from "@/lib/types";
import { getProviderByLegacySlug, getProvidersByOrganizationSlug, getNearbyProviders, providerPath } from "@/lib/providers";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  const providers = await getProvidersByOrganizationSlug(slug);
  if (legacy && legacy.organizationSlug !== slug) return { robots: { index: false, follow: true }, alternates: { canonical: providerPath(legacy) } };
  if (!providers.length) return {};
  if (providers.length === 1) {
    const provider = providers[0];
    const ctrMetadata = getProviderCtrMetadata(provider);
    return {
      title: { absolute: fitSeoTitle(ctrMetadata.title) },
      description: fitSeoDescription(ctrMetadata.description),
      alternates: { canonical: providerPath(provider) },
      robots: { index: isProviderIndexable(provider), follow: true },
      openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
    };
  }
  const name = providers[0].name;
  const ctrMetadata = getOrganizationCtrMetadata(slug, name, providers.length);
  const hasIndexableLocation = providers.some(isProviderIndexable);
  return {
    title: { absolute: fitSeoTitle(ctrMetadata.title) },
    description: fitSeoDescription(ctrMetadata.description),
    alternates: { canonical: `/providers/${slug}` },
    robots: { index: hasIndexableLocation, follow: true },
  };
}

export default async function OrganizationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  if (legacy && legacy.organizationSlug !== slug) permanentRedirect(providerPath(legacy));

  const providers = await getProvidersByOrganizationSlug(slug);
  if (!providers.length) notFound();
  if (providers.length === 1) {
    const nearbyProviders = await getNearbyProviders(providers[0].id, providers[0].city, providers[0].state);
    return <ProviderDetailPage provider={providers[0]} organizationProviders={providers} nearbyProviders={nearbyProviders} />;
  }

  const name = topValues(providers.map((provider) => [provider.name]), 1)[0]?.label || providers[0].name;
  const byState = new Map<string, Provider[]>();
  for (const provider of providers) byState.set(provider.state, [...(byState.get(provider.state) || []), provider]);
  const stateGroups = [...byState.entries()]
    .map(([code, items]) => ({ code, name: stateByCode(code)?.name || code, items: items.sort((a, b) => a.city.localeCompare(b.city)) }))
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name));
  const cityCount = new Set(providers.map((provider) => `${provider.state}|${provider.city}`)).size;
  const careTypes = topValues(providers.map((provider) => [...provider.levelsOfCare, ...provider.treatmentTypes]), 8);
  const insurance = topValues(providers.map((provider) => provider.insurance), 8);
  const therapies = topValues(providers.map((provider) => provider.therapies), 6);
  const verifiedCount = providers.filter((provider) => provider.verificationStatus === "provider-confirmed").length;
  const stateSummary = stateGroups.length === 1 ? stateGroups[0].name : `${stateGroups.length} states`;
  const url = absoluteUrl(`/providers/${slug}`);
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name,
    url,
    ...(providers.find((provider) => provider.website)?.website ? { sameAs: [providers.find((provider) => provider.website)!.website] } : {}),
    subOrganization: providers.slice(0, 100).map((provider) => ({
      "@type": "MedicalBusiness",
      name: provider.address ? `${provider.name} (${provider.address.split(",")[0]})` : provider.name,
      url: absoluteUrl(providerPath(provider)),
      address: { "@type": "PostalAddress", streetAddress: provider.address || undefined, addressLocality: provider.city, addressRegion: provider.state, postalCode: provider.postalCode || undefined, addressCountry: "US" },
      ...(provider.phone ? { telephone: provider.phone } : {}),
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Directory", item: absoluteUrl("/directory") },
      { "@type": "ListItem", position: 2, name: `${name} locations`, item: url },
    ],
  };

  return <>
    <JsonLd data={organizationJsonLd} />
    <JsonLd data={breadcrumbJsonLd} />
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/directory" prefetch={false}>Directory</Link><span>/</span><span>{name}</span></div>
      <span className="kicker plain">Provider locations</span>
      <h1>{name}: {providers.length.toLocaleString("en-US")} locations</h1>
      <p>{name} has {providers.length.toLocaleString("en-US")} published locations across {cityCount.toLocaleString("en-US")} {cityCount === 1 ? "city" : "cities"} in {stateSummary}{verifiedCount ? `, ${verifiedCount.toLocaleString("en-US")} of them confirmed by the provider` : ""}. Each location keeps its own services, insurance, contact details, and verification status, so compare the one closest to you.</p>
      {stateGroups.length > 1 ? <div className="inline-actions">{stateGroups.slice(0, 12).map((group) => <a className="button button-secondary" href={`#state-${group.code.toLowerCase()}`} key={group.code}>{group.name} ({group.items.length})</a>)}</div> : null}
    </div></section>
    {careTypes.length || insurance.length || therapies.length ? <section className="section section-tight"><div className="shell">
      <div className="results-heading"><div><h2>What {name} offers</h2><p>Combined from the published records of all {providers.length.toLocaleString("en-US")} locations. Services vary by location.</p></div></div>
      <div className="organization-facts">
        {careTypes.length ? <div><h3>Levels of care</h3><ul>{careTypes.map((item) => <li key={item.label}>{item.label} <small>{item.count} {item.count === 1 ? "location" : "locations"}</small></li>)}</ul></div> : null}
        {insurance.length ? <div><h3>Insurance on file</h3><ul>{insurance.map((item) => <li key={item.label}>{item.label} <small>{item.count} {item.count === 1 ? "location" : "locations"}</small></li>)}</ul></div> : null}
        {therapies.length ? <div><h3>Therapies mentioned</h3><ul>{therapies.map((item) => <li key={item.label}>{item.label} <small>{item.count} {item.count === 1 ? "location" : "locations"}</small></li>)}</ul></div> : null}
      </div>
    </div></section> : null}
    {stateGroups.map((group) => <section className="section" id={`state-${group.code.toLowerCase()}`} key={group.code}><div className="shell">
      <div className="results-heading"><div><h2>{name} in {group.name}</h2><p>{group.items.length.toLocaleString("en-US")} {group.items.length === 1 ? "location" : "locations"}</p></div></div>
      <div className="provider-list">{group.items.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
    </div></section>)}
  </>;
}

/** Counts how many locations list each value (each location counted once per value). */
function topValues(valuesPerLocation: string[][], limit: number) {
  const counts = new Map<string, { label: string; count: number }>();
  for (const values of valuesPerLocation) {
    const seen = new Set<string>();
    for (const value of values) {
      const label = value.trim();
      const key = label.toLowerCase();
      if (!label || seen.has(key)) continue;
      seen.add(key);
      const entry = counts.get(key);
      if (entry) entry.count += 1; else counts.set(key, { label, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, limit);
}
