import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { insurers } from "@/lib/insurance-data";
import { searchProviders } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Rehab centers by insurance coverage",
  description: "Browse addiction treatment centers by the insurance they accept, including Aetna, Cigna, Blue Cross Blue Shield, UnitedHealthcare, Humana, Medicaid, Medicare, and Kaiser Permanente.",
  alternates: { canonical: "/insurance" },
};

export default async function InsuranceIndexPage() {
  const counts = await Promise.all(
    insurers.map(async (insurer) => (await searchProviders({ insurance: insurer.name, pageSize: 1 })).total),
  );

  return <>
    <section className="page-hero"><div className="shell">
      <span className="kicker plain">Insurance</span>
      <h1>Find treatment centers that accept your insurance</h1>
      <p>Coverage is often the first question families ask. Pick your insurer to see tagged listings, then verify in-network status, authorization requirements, and your expected out-of-pocket cost with both the provider and your insurer before committing.</p>
    </div></section>
    <section className="section"><div className="shell category-grid">
      {insurers.map((insurer, index) => <Link className="category-card" key={insurer.slug} href={`/insurance/${insurer.slug}`} prefetch={false}><h2>{insurer.name}</h2><p>{insurer.description}</p><span className="card-link">{counts[index].toLocaleString("en-US")} listings <ArrowRight size={16} /></span></Link>)}
    </div></section>
  </>;
}
