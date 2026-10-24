import { careCategories } from "@/lib/content";
import { getDirectoryFacets } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

const staticPages = [
  ["/", "2026-09-28", 1],
  ["/directory", "2026-10-24", 0.8],
  ["/care", "2026-09-28", 0.8],
  ["/locations", "2026-09-28", 0.8],
  ["/guides", "2026-09-28", 0.8],
  ["/about", "2026-09-28", 0.6],
  ["/about/editorial-standards", "2026-10-24", 0.7],
  ["/how-we-verify", "2026-10-20", 0.7],
  ["/emergency-help", "2026-09-28", 0.7],
  ["/providers/apply", "2026-10-20", 0.6],
  ["/advertise", "2026-10-20", 0.5],
  ["/corrections", "2026-09-28", 0.5],
  ["/contact", "2026-09-28", 0.5],
  ["/privacy", "2026-10-17", 0.3],
  ["/terms", "2026-09-28", 0.3],
  ["/compare", "2026-10-18", 0.6],
] as const;

export async function GET() {
  const facets = await getDirectoryFacets();
  const populatedCategories = careCategories.filter((category) => facets.categories.includes(category.name));
  return sitemapResponse([
    ...staticPages.map(([path, lastmod, priority]) => ({
      loc: absoluteUrl(path), lastmod, changefreq: path === "/" ? "weekly" as const : "monthly" as const, priority,
    })),
    ...populatedCategories.map((category) => ({
      loc: absoluteUrl(`/care/${category.slug}`), lastmod: "2026-10-24", changefreq: "monthly" as const, priority: 0.7,
    })),
  ]);
}
