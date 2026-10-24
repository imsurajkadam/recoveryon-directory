import Link from "next/link";
import { EDITORIAL_REVIEWED_ON, editorialAuthor, editorialSources } from "@/lib/editorial-trust";

export function EditorialTrust() {
  return <aside className="editorial-trust" aria-label="Editorial information and sources">
    <p className="article-byline">Written and source-checked by <Link href={editorialAuthor.url} prefetch={false}>{editorialAuthor.name}</Link>. Editorial review updated {new Date(EDITORIAL_REVIEWED_ON).toLocaleDateString("en-US", { dateStyle: "long" })}. No individual clinical review is claimed.</p>
    <details>
      <summary>Editorial sources</summary>
      <ul>{editorialSources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
    </details>
  </aside>;
}
