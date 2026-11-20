import Link from "next/link";

export type JumpLink = { href: string; label: string; count?: number };

/** A single scrollable row of chips. Keeps secondary navigation above the fold without pushing listings down. */
export function JumpLinks({ label, links }: { label: string; links: JumpLink[] }) {
  if (!links.length) return null;
  return (
    <nav className="jump-links" aria-label={label}>
      <span className="jump-links-label">{label}</span>
      <div className="jump-links-row">
        {links.map((link) => link.href.startsWith("#")
          ? <a key={link.href + link.label} href={link.href}>{link.label}{link.count !== undefined ? <small>{link.count.toLocaleString("en-US")}</small> : null}</a>
          : <Link key={link.href + link.label} href={link.href} prefetch={false}>{link.label}{link.count !== undefined ? <small>{link.count.toLocaleString("en-US")}</small> : null}</Link>)}
      </div>
    </nav>
  );
}
