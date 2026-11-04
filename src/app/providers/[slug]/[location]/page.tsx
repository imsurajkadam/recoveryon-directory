import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getProviderSeoDescription, getProviderSeoTitle } from "@/lib/provider-seo";
import { getNearbyProviders, getProviderByCanonicalPath, getProvidersByOrganizationSlug, providerPath, resolveProviderListing } from "@/lib/providers";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; location: string }> }): Promise<Metadata> {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) return {};
  const resolution = await resolveProviderListing(provider);
  if (resolution.redirectTo) permanentRedirect(resolution.redirectTo);
  if (provider.organizationLocationCount <= 1) permanentRedirect(providerPath(provider));
  return {
    title: getProviderSeoTitle(provider),
    description: getProviderSeoDescription(provider),
    alternates: { canonical: providerPath(provider) },
    robots: { index: resolution.indexable, follow: true },
    openGraph: provider.featuredImageUrl ? { images: [{ url: provider.featuredImageUrl }] } : undefined,
  };
}

export default async function ProviderLocationPage({ params }: { params: Promise<{ slug: string; location: string }> }) {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) notFound();
  const resolution = await resolveProviderListing(provider);
  if (resolution.redirectTo) permanentRedirect(resolution.redirectTo);
  if (provider.organizationLocationCount <= 1) permanentRedirect(providerPath(provider));
  const [organizationProviders, nearbyProviders] = await Promise.all([
    getProvidersByOrganizationSlug(slug),
    getNearbyProviders(provider),
  ]);
  return <ProviderDetailPage provider={provider} organizationProviders={organizationProviders} nearbyProviders={nearbyProviders} />;
}
