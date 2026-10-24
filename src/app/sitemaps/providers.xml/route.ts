import { getSitemapProviders, providerPath } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  const providers = await getSitemapProviders();
  const organizationDates = new Map<string, string>();
  for (const provider of providers) {
    if (provider.organizationLocationCount <= 1) continue;
    const existing = organizationDates.get(provider.organizationSlug);
    if (!existing || provider.updatedAt > existing) organizationDates.set(provider.organizationSlug, provider.updatedAt);
  }

  return sitemapResponse([
    ...providers.map((provider) => ({
      loc: absoluteUrl(providerPath(provider)), lastmod: provider.updatedAt, changefreq: "monthly" as const, priority: 0.8,
    })),
    ...Array.from(organizationDates, ([organizationSlug, lastmod]) => ({
      loc: absoluteUrl(`/providers/${organizationSlug}`), lastmod, changefreq: "monthly" as const, priority: 0.7,
    })),
  ]);
}
