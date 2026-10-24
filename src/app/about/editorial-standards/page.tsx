import type { Metadata } from "next";
import Link from "next/link";
import { EDITORIAL_REVIEWED_ON, editorialSources } from "@/lib/editorial-trust";

export const metadata: Metadata = {
  title: "Editorial standards and sources",
  description: "How TreatmentLane writes, sources, reviews, updates, and corrects treatment information.",
  alternates: { canonical: "/about/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Editorial standards</span><h1>How TreatmentLane creates and reviews information</h1><p>Our goal is useful, traceable information with clear limits. We do not present directory content as medical advice or promise that a listing is right for a particular person.</p></div></section><article className="content-shell prose">
    <p className="article-byline">Owned by the TreatmentLane Editorial Team. Last reviewed {new Date(EDITORIAL_REVIEWED_ON).toLocaleDateString("en-US", { dateStyle: "long" })}.</p>
    <h2>How pages are written</h2><p>We use plain language, structured provider data, public records, official guidance, and direct provider confirmations when available. A source link or verification label does not replace checking current licensing, services, availability, insurance, or cost directly.</p>
    <h2>Editorial review and clinical review</h2><p>Care and location pages are written and source-checked by the named TreatmentLane Editorial Team. We only name an individual clinical reviewer when that person has actually reviewed the page and their credentials can be shown. Pages without a named clinician should not be read as clinically reviewed.</p>
    <h2>Provider pages and search eligibility</h2><p>Published listings can remain accessible to people using the directory, but only listings that meet our source, completeness, verification, or demonstrated search-demand threshold are eligible for search indexing and the provider sitemap.</p>
    <h2>Corrections and updates</h2><p>Important updates receive a real review date. We do not change a page date merely because the site was rebuilt. Readers and organizations can <Link href="/corrections" prefetch={false}>request a correction</Link>.</p>
    <h2>Core sources</h2><ul>{editorialSources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
  </article></>;
}
