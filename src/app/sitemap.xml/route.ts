import { sitemapIndexEntries } from "@/lib/sitemap-documents";
import { sitemapIndexResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  return sitemapIndexResponse(await sitemapIndexEntries());
}
