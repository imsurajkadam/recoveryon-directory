import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getProviderCtrMetadata } from "@/lib/provider-metadata";
import { fitSeoDescription, fitSeoTitle, isProviderIndexable } from "@/lib/provider-seo";
import { getProviderByCanonicalPath, getProvidersByOrganizationSlug, getNearbyProviders, providerPath } from "@/lib/providers";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; location: string }> }): Promise<Metadata> {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) return {};
  const ctrMetadata = getProviderCtrMetadata(provider);
  return {
    title: { absolute: fitSeoTitle(ctrMetadata.title) },
    description: fitSeoDescription(ctrMetadata.description),
    alternates: { canonical: providerPath(provider) },
    robots: { index: isProviderIndexable(provider), follow: true },
    openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
  };
}

export default async function ProviderLocationPage({ params }: { params: Promise<{ slug: string; location: string }> }) {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) notFound();
  if (provider.organizationLocationCount <= 1) permanentRedirect(providerPath(provider));
  const organizationProviders = await getProvidersByOrganizationSlug(slug);
  const nearbyProviders = await getNearbyProviders(provider.id, provider.city, provider.state);
  return <ProviderDetailPage provider={provider} organizationProviders={organizationProviders} nearbyProviders={nearbyProviders} />;
}
