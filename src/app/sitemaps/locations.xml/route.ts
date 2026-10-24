import { states } from "@/lib/content";
import { getDirectoryFacets } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  const facets = await getDirectoryFacets();
  const populatedStates = states.filter((state) => facets.states.includes(state.code));
  return sitemapResponse(populatedStates.map((state) => ({
    loc: absoluteUrl(`/locations/${state.slug}`),
    lastmod: "2026-10-24",
    changefreq: "monthly",
    priority: 0.7,
  })));
}
