import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ProviderCard } from "@/components/provider-card";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getOrganizationSeoDescription, getOrganizationSeoTitle, getProviderSeoDescription, getProviderSeoTitle, isProviderIndexable } from "@/lib/provider-seo";
import { providerDisplayName } from "@/lib/provider-display";
import { getNearbyProviders, getProviderByLegacySlug, getProvidersByOrganizationSlug, providerPath, resolveProviderListing } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  const providers = await getProvidersByOrganizationSlug(slug);
  if (legacy && legacy.organizationSlug !== slug) return { robots: { index: false, follow: true }, alternates: { canonical: providerPath(legacy) } };
  if (!providers.length) return {};
  if (providers.length === 1) {
    const provider = providers[0];
    const resolution = await resolveProviderListing(provider);
    if (resolution.redirectTo) permanentRedirect(resolution.redirectTo);
    return {
      title: getProviderSeoTitle(provider),
      description: getProviderSeoDescription(provider),
      alternates: { canonical: providerPath(provider) },
      robots: { index: resolution.indexable, follow: true },
      openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
    };
  }
  const name = providerDisplayName(providers[0].name);
  return {
    title: getOrganizationSeoTitle(name),
    description: getOrganizationSeoDescription(name, providers.length),
    alternates: { canonical: `/providers/${slug}` },
    robots: { index: providers.some((provider) => isProviderIndexable(provider)), follow: true },
  };
}

export default async function OrganizationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legacy = await getProviderByLegacySlug(slug);
  if (legacy && legacy.organizationSlug !== slug) permanentRedirect(providerPath(legacy));

  const providers = await getProvidersByOrganizationSlug(slug);
  if (!providers.length) notFound();
  if (providers.length === 1) {
    const provider = providers[0];
    const resolution = await resolveProviderListing(provider);
    if (resolution.redirectTo) permanentRedirect(resolution.redirectTo);
    const nearbyProviders = await getNearbyProviders(provider);
    return <ProviderDetailPage provider={provider} organizationProviders={providers} nearbyProviders={nearbyProviders} />;
  }

  const name = providerDisplayName(providers[0].name);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Directory", item: absoluteUrl("/directory") },
      { "@type": "ListItem", position: 3, name, item: absoluteUrl(`/providers/${slug}`) },
    ],
  };
  return <>
    <JsonLd data={breadcrumb} />
    <section className="page-hero"><div className="shell">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/" prefetch={false}>Home</Link><span aria-hidden="true">/</span><Link href="/directory" prefetch={false}>Directory</Link><span aria-hidden="true">/</span><span>{name}</span></nav>
      <span className="kicker plain">Provider locations</span>
      <h1>{name}</h1>
      <p>Compare {providers.length.toLocaleString()} published locations. Each location has its own services, source evidence, and verification status.</p>
    </div></section>
    <section className="section"><div className="shell">
      <div className="provider-list">{providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
    </div></section>
  </>;
}
