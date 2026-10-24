import Link from "next/link";

function pageHref(pathname: string, params: Record<string, string>, page: number) {
  const search = new URLSearchParams(params);
  if (page > 1) search.set("page", String(page)); else search.delete("page");
  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function Pagination({ pathname, params = {}, page, totalPages }: {
  pathname: string; params?: Record<string, string>; page: number; totalPages: number;
}) {
  if (totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Directory pages">
    {page > 1 ? <Link href={pageHref(pathname, params, page - 1)} prefetch={false}>Previous</Link> : <span aria-disabled="true">Previous</span>}
    <span>Page {page.toLocaleString()} of {totalPages.toLocaleString()}</span>
    {page < totalPages ? <Link href={pageHref(pathname, params, page + 1)} prefetch={false}>Next</Link> : <span aria-disabled="true">Next</span>}
  </nav>;
}
