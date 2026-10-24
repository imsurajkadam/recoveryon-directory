"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const links = [
  { href: "/directory", label: "Find care" },
  { href: "/care", label: "Types of care" },
  { href: "/locations", label: "Locations" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" aria-label="TreatmentLane home" prefetch={false} onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={`main-nav${open ? " is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link className={isActive(link.href) ? "is-active" : undefined} aria-current={isActive(link.href) ? "page" : undefined} key={link.href} href={link.href} prefetch={false} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link className={`button button-small${pathname === "/providers/apply" ? " is-active" : ""}`} aria-current={pathname === "/providers/apply" ? "page" : undefined} href="/providers/apply" prefetch={false} onClick={() => setOpen(false)}>List your organization</Link>
        </nav>
      </div>
    </header>
  );
}
