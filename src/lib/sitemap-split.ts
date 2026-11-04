/** Stay under the sitemap protocol limits of 50,000 URLs and 50MB per file. */
export const SITEMAP_URL_LIMIT = 45_000;
export const SITEMAP_BYTE_LIMIT = 45_000_000;

export function chunkEntries<T>(items: T[], size = SITEMAP_URL_LIMIT) {
  return chunkByLimits(items, () => 1, size, Number.POSITIVE_INFINITY);
}

export function chunkByLimits<T>(items: T[], sizeOf: (item: T) => number, maxCount = SITEMAP_URL_LIMIT, maxBytes = SITEMAP_BYTE_LIMIT) {
  if (maxCount < 1 || maxBytes < 1) throw new Error("Sitemap chunk limits must be positive");
  const chunks: T[][] = [];
  let current: T[] = [];
  let bytes = 0;
  for (const item of items) {
    const size = Math.max(1, sizeOf(item));
    if (current.length > 0 && (current.length >= maxCount || bytes + size > maxBytes)) {
      chunks.push(current);
      current = [];
      bytes = 0;
    }
    current.push(item);
    bytes += size;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

export function sitemapSegmentId(prefix: string, partIndex: number, partCount: number) {
  return partCount > 1 ? `${prefix}-${partIndex + 1}` : prefix;
}

/** Approximate uncompressed sitemap XML bytes for one URL entry. */
export function sitemapEntryBytes(loc: string, lastmod: string, priority: number) {
  return `<url><loc>${loc}</loc><lastmod>${lastmod.slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>${priority.toFixed(1)}</priority></url>`.length;
}
