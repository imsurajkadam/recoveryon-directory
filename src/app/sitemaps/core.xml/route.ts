import { careCategories } from "@/lib/content";
import { stateByCode } from "@/lib/city-pages";
import { insurers } from "@/lib/insurance-data";
import { medicaidStates } from "@/lib/medicaid-states";
import { nearMePages } from "@/lib/near-me";
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
  ["/insurance", "2026-11-09", 0.8],
] as const;

export async function GET() {
  const facets = await getDirectoryFacets();
  const populatedCategories = careCategories.filter((category) => facets.categories.includes(category.name) && category.slug !== "support-groups");
  return sitemapResponse([
    ...staticPages.map(([path, lastmod, priority]) => ({
      loc: absoluteUrl(path), lastmod, changefreq: path === "/" ? "weekly" as const : "monthly" as const, priority,
    })),
    ...populatedCategories.map((category) => ({
      loc: absoluteUrl(`/care/${category.slug}`), lastmod: "2026-10-24", changefreq: "monthly" as const, priority: 0.7,
    })),
    ...insurers.map((insurer) => ({
      loc: absoluteUrl(`/insurance/${insurer.slug}`), lastmod: "2026-11-12", changefreq: "monthly" as const, priority: 0.7,
    })),
    ...medicaidStates.flatMap((item) => {
      const state = stateByCode(item.code);
      return state ? [{ loc: absoluteUrl(`/insurance/medicaid/${state.slug}`), lastmod: "2026-11-12", changefreq: "weekly" as const, priority: 0.7 }] : [];
    }),
    ...nearMePages.map((page) => ({
      loc: absoluteUrl(page.path), lastmod: "2026-11-12", changefreq: "weekly" as const, priority: 0.8,
    })),
  ]);
}
