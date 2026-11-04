import { locationSitemapEntries } from "@/lib/sitemap-documents";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  return sitemapResponse(await locationSitemapEntries());
}
