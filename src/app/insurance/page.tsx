import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IllustratedHero } from "@/components/illustrations";
import { InsuranceExplainer } from "@/components/insurance-explainer";
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
    <IllustratedHero kind="insurance" kicker="Insurance" title="Find treatment centers that accept your insurance">
      <p>Coverage is often the first question families ask. Pick your insurer to see tagged listings, then confirm network status and your costs with both the provider and your plan.</p>
    </IllustratedHero>
    <section className="section section-snug"><div className="shell category-grid">
      {insurers.map((insurer, index) => <Link className="category-card" key={insurer.slug} href={`/insurance/${insurer.slug}`} prefetch={false}><h2>{insurer.name}</h2><p>{insurer.description}</p><span className="card-link">{counts[index].toLocaleString("en-US")} listings <ArrowRight size={16} /></span></Link>)}
    </div></section>
    <InsuranceExplainer />
  </>;
}
