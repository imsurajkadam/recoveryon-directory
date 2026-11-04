import { providerSitemapDocument } from "@/lib/sitemap-documents";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET(_request: Request, context: { params: Promise<{ segment: string }> }) {
  const { segment } = await context.params;
  const entries = await providerSitemapDocument(segment.toLowerCase().replace(/\.xml$/, ""));
  if (!entries) return new Response("Not found", { status: 404 });
  return sitemapResponse(entries);
}
