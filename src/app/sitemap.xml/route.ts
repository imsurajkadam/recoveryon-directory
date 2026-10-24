import { absoluteUrl } from "@/lib/site";
import { sitemapIndexResponse } from "@/lib/sitemap-xml";

const SITEMAP_ARCHITECTURE_UPDATED_ON = "2026-10-24";

export function GET() {
  return sitemapIndexResponse([
    { loc: absoluteUrl("/sitemaps/core.xml"), lastmod: SITEMAP_ARCHITECTURE_UPDATED_ON },
    { loc: absoluteUrl("/sitemaps/guides.xml"), lastmod: SITEMAP_ARCHITECTURE_UPDATED_ON },
    { loc: absoluteUrl("/sitemaps/locations.xml"), lastmod: SITEMAP_ARCHITECTURE_UPDATED_ON },
    { loc: absoluteUrl("/sitemaps/providers.xml"), lastmod: SITEMAP_ARCHITECTURE_UPDATED_ON },
  ]);
}
