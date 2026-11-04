import type { Metadata } from "next";
import { CorrectionForm } from "@/components/correction-form";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const hasQuery = Object.values(params).some((value) => Array.isArray(value) ? value.some(Boolean) : Boolean(value));
  return {
    title: "Request a listing correction",
    description: "Tell TreatmentLane about inaccurate or outdated information in a directory listing.",
    alternates: { canonical: "/corrections" },
    robots: hasQuery ? { index: false, follow: true } : undefined,
  };
}

export default async function CorrectionsPage({ searchParams }: { searchParams: Promise<{ provider?: string }> }) {
  const { provider = "" } = await searchParams;
  return <>
    <section className="page-hero"><div className="shell"><span className="kicker plain">Directory accuracy</span><h1>Request a listing correction</h1><p>Help us review inaccurate, incomplete, or outdated directory information. We verify material changes before publishing them.</p></div></section>
    <section className="form-section"><div className="content-shell"><div className="notice"><strong>For urgent safety concerns:</strong> contact the organization or appropriate state authority directly. This form does not reach a treatment provider.</div><div className="spacer-24" /><CorrectionForm providerSlug={provider} /></div></section>
  </>;
}
