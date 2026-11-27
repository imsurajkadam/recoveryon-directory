import { getPublishedArticleSummaries } from "@/lib/articles";
import { guides } from "@/lib/content";
import { getLatestProviderUpdate } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { sitemapIndexResponse } from "@/lib/sitemap-xml";

const SITEMAP_ARCHITECTURE_UPDATED_ON = "2026-10-24";

export const revalidate = 3600;

export async function GET() {
  const dataUpdatedOn = (await getLatestProviderUpdate()) || SITEMAP_ARCHITECTURE_UPDATED_ON;
  const articles = await getPublishedArticleSummaries().catch(() => []);
  const guidesUpdatedOn = [SITEMAP_ARCHITECTURE_UPDATED_ON, ...guides.map((guide) => guide.reviewedOn), ...articles.map((article) => article.updatedAt)].sort().at(-1) || SITEMAP_ARCHITECTURE_UPDATED_ON;
  return sitemapIndexResponse([
    { loc: absoluteUrl("/sitemaps/core.xml"), lastmod: SITEMAP_ARCHITECTURE_UPDATED_ON },
    { loc: absoluteUrl("/sitemaps/guides.xml"), lastmod: guidesUpdatedOn },
    { loc: absoluteUrl("/sitemaps/locations.xml"), lastmod: dataUpdatedOn },
    { loc: absoluteUrl("/sitemaps/cities.xml"), lastmod: dataUpdatedOn },
    { loc: absoluteUrl("/sitemaps/providers.xml"), lastmod: dataUpdatedOn },
  ]);
}
