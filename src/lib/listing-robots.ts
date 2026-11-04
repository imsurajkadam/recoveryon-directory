function single(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] || "" : value || "").trim();
}

/** Index listing pages only when the query is empty or page-only. Other params canonical to the clean URL. */
export function listingRobots(params: object, cleanPath: string) {
  const populated = Object.entries(params as Record<string, string | string[] | undefined>).filter(([, value]) => single(value));
  const filtered = populated.some(([key]) => key !== "page");
  const page = Math.max(Number.parseInt(single((params as { page?: string | string[] }).page), 10) || 1, 1);
  return {
    index: !filtered,
    canonical: !filtered && page > 1 ? `${cleanPath}?page=${page}` : cleanPath,
  };
}
