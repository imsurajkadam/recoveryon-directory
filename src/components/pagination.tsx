import Link from "next/link";
import { paginationItems } from "@/lib/pagination";

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
  const items = paginationItems(page, totalPages);
  return <nav className="pagination" aria-label="Pages">
    {page > 1 ? <Link href={pageHref(pathname, params, page - 1)} rel="prev" prefetch={false}>Previous</Link> : <span aria-disabled="true">Previous</span>}
    <ol>
      {items.map((item, index) => item === "gap"
        ? <li key={`gap-${index}`}><span aria-hidden="true">…</span></li>
        : <li key={item}><Link href={pageHref(pathname, params, item)} aria-current={item === page ? "page" : undefined} prefetch={false}>{item.toLocaleString()}</Link></li>)}
    </ol>
    {page < totalPages ? <Link href={pageHref(pathname, params, page + 1)} rel="next" prefetch={false}>Next</Link> : <span aria-disabled="true">Next</span>}
  </nav>;
}
