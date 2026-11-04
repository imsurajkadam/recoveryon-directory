import { citySitemapChunks } from "@/lib/sitemap-documents";
import { sitemapResponse } from "@/lib/sitemap-xml";

export const revalidate = 86400;

export async function GET(_request: Request, context: { params: Promise<{ segment: string }> }) {
  const { segment } = await context.params;
  const part = Number.parseInt(segment.toLowerCase().replace(/\.xml$/, ""), 10);
  if (!Number.isInteger(part) || part < 1) return new Response("Not found", { status: 404 });
  const chunks = await citySitemapChunks();
  const entries = chunks[part - 1];
  if (!entries?.length) return new Response("Not found", { status: 404 });
  return sitemapResponse(entries);
}
