import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderCard } from "@/components/provider-card";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getOrganizationCtrMetadata, getProviderCtrMetadata } from "@/lib/provider-metadata";
import { fitSeoDescription, fitSeoTitle, isProviderIndexable } from "@/lib/provider-seo";
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

  return <>
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/directory" prefetch={false}>Directory</Link><span>/</span><span>{providers[0].name}</span></div>
      <span className="kicker plain">Provider locations</span>
      <h1>{providers[0].name}</h1>
      <p>Compare {providers.length.toLocaleString()} published locations. Each location has its own services, source evidence, and verification status.</p>
    </div></section>
    <section className="section"><div className="shell">
      <div className="provider-list">{providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
    </div></section>
  </>;
}
