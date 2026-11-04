import type { Metadata } from "next";
import { CorrectionForm } from "@/components/correction-form";

export const metadata: Metadata = {
  title: "Request a listing correction",
  description: "Tell TreatmentLane about inaccurate or outdated information in a directory listing.",
  alternates: { canonical: "/corrections" },
  robots: { index: false, follow: true },
};

export default async function CorrectionsPage({ searchParams }: { searchParams: Promise<{ provider?: string }> }) {
  const { provider = "" } = await searchParams;
  return <>
    <section className="page-hero"><div className="shell"><span className="kicker plain">Directory accuracy</span><h1>Request a listing correction</h1><p>Help us review inaccurate, incomplete, or outdated directory information. We verify material changes before publishing them.</p></div></section>
    <section className="form-section"><div className="content-shell"><div className="notice"><strong>For urgent safety concerns:</strong> contact the organization or appropriate state authority directly. This form does not reach a treatment provider.</div><div className="spacer-24" /><CorrectionForm providerSlug={provider} /></div></section>
  </>;
}
