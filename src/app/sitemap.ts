import type { MetadataRoute } from "next";
import { careCategories, guides, states } from "@/lib/content";
import { getPublishedArticleSummaries } from "@/lib/articles";
import { getDirectoryFacets, getSitemapProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/directory", "/care", "/locations", "/guides", "/about", "/how-we-verify", "/emergency-help", "/providers/apply", "/advertise", "/corrections", "/contact", "/privacy", "/terms", "/compare"];
  const [facets, providers, articles] = await Promise.all([getDirectoryFacets(), getSitemapProviders(), getPublishedArticleSummaries()]);
  const now = new Date();
  const populatedCategories = careCategories.filter((item) => facets.categories.includes(item.name));
  const populatedStates = states.filter((state) => facets.states.includes(state.code));
  const providerOrganizations = [...new Map(
    providers
      .filter((provider) => provider.locationCount > 1)
      .map((provider) => [provider.organizationSlug, provider]),
  ).values()];
  return [
    ...staticPages.map((path) => ({ url: absoluteUrl(path || "/"), lastModified: now, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })),
    ...populatedCategories.map((item) => ({ url: absoluteUrl(`/care/${item.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: .7 })),
    ...populatedStates.map((state) => ({ url: absoluteUrl(`/locations/${state.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: .7 })),
    ...guides.map((guide) => ({ url: absoluteUrl(`/guides/${guide.slug}`), lastModified: new Date(guide.reviewedOn), changeFrequency: "monthly" as const, priority: .8 })),
    ...articles.map((article) => ({ url: absoluteUrl(`/guides/${article.slug}`), lastModified: new Date(article.updatedAt), changeFrequency: "monthly" as const, priority: .8 })),
    ...providers.map((provider) => ({
      url: absoluteUrl(provider.locationCount > 1
        ? `/providers/${provider.organizationSlug}/${provider.locationSlug}`
        : `/providers/${provider.organizationSlug}`),
      lastModified: new Date(provider.updatedAt), changeFrequency: "weekly" as const, priority: .8,
    })),
    ...providerOrganizations.map((provider) => ({
      url: absoluteUrl(`/providers/${provider.organizationSlug}`),
      lastModified: new Date(provider.updatedAt), changeFrequency: "weekly" as const, priority: .75,
    })),
  ];
}
