export type PaginationItem = number | "gap";

/** Sliding window plus first and last page, for numbered pagination links. */
export function paginationItems(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) return [];
  const pages = new Set<number>([1, totalPages, page]);
  for (let cursor = page - 2; cursor <= page + 2; cursor += 1) {
    if (cursor >= 1 && cursor <= totalPages) pages.add(cursor);
  }
  const ordered = [...pages].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  for (const value of ordered) {
    const previous = items[items.length - 1];
    if (typeof previous === "number" && value - previous > 1) items.push("gap");
    items.push(value);
  }
  return items;
}
