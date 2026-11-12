import { CITY_INDEX_MIN_LISTINGS, cityCarePath, cityPath, indexedCityCarePages, stateByCode } from "@/lib/city-pages";
import { getCitiesWithMinListings } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  const cities = await getCitiesWithMinListings(CITY_INDEX_MIN_LISTINGS);
  const cityDates = new Map(cities.map((item) => [`${item.state}|${item.city}`, item.updatedAt]));
  const cityEntries = cities.flatMap((item) => {
    const state = stateByCode(item.state);
    return state ? [{ loc: absoluteUrl(cityPath(state, item.city)), lastmod: item.updatedAt, changefreq: "weekly" as const, priority: 0.7 }] : [];
  });
  const careEntries = indexedCityCarePages.flatMap((page) => {
    const state = stateByCode(page.state);
    return state ? [{ loc: absoluteUrl(cityCarePath(state, page.city, page.care)), lastmod: cityDates.get(`${page.state}|${page.city}`) || new Date().toISOString().slice(0, 10), changefreq: "weekly" as const, priority: 0.8 }] : [];
  });
  return sitemapResponse([...careEntries, ...cityEntries]);
}
