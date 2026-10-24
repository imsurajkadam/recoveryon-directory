import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProviderDetailPage } from "@/components/provider-detail-page";
import { getLifeStanceLocationMetadata } from "@/lib/provider-metadata";
import { fitSeoDescription, fitSeoTitle, getProviderSeoDescription, getProviderSeoTitle, isProviderIndexable } from "@/lib/provider-seo";
import { getProviderByCanonicalPath, getProvidersByOrganizationSlug, providerPath } from "@/lib/providers";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; location: string }> }): Promise<Metadata> {
  const { slug, location } = await params;
  const provider = await getProviderByCanonicalPath(slug, location);
  if (!provider) return {};
  const ctrMetadata = getLifeStanceLocationMetadata(provider);
  return {
    title: { absolute: ctrMetadata ? fitSeoTitle(ctrMetadata.title) : getProviderSeoTitle(provider) },
    description: ctrMetadata ? fitSeoDescription(ctrMetadata.description) : getProviderSeoDescription(provider),
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
  return <ProviderDetailPage provider={provider} organizationProviders={organizationProviders} />;
}
