import { getPublishedArticleSummaries } from "@/lib/articles";
import { guides } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { sitemapResponse } from "@/lib/sitemap-xml";

// Publishing revalidates this route; the hourly fallback keeps it fresh if that ever misses.
export const revalidate = 3600;

export async function GET() {
  const articles = await getPublishedArticleSummaries();
  return sitemapResponse([
    ...guides.map((guide) => ({
      loc: absoluteUrl(`/guides/${guide.slug}`), lastmod: guide.reviewedOn, changefreq: "monthly" as const, priority: 0.8,
    })),
    ...articles.map((article) => ({
      loc: absoluteUrl(`/guides/${article.slug}`), lastmod: article.updatedAt, changefreq: "monthly" as const, priority: 0.8,
    })),
  ]);
}
