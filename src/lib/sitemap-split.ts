/** Stay under the sitemap protocol limit of 50,000 URLs per file. */
export const SITEMAP_URL_LIMIT = 45_000;

export function chunkEntries<T>(entries: T[], size = SITEMAP_URL_LIMIT) {
  if (size < 1) throw new Error("Sitemap chunk size must be positive");
  const chunks: T[][] = [];
  for (let index = 0; index < entries.length; index += size) chunks.push(entries.slice(index, index + size));
  return chunks;
}

export function sitemapSegmentId(prefix: string, partIndex: number, partCount: number) {
  return partCount > 1 ? `${prefix}-${partIndex + 1}` : prefix;
}
