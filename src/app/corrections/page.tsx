import type { Metadata } from "next";
import { CorrectionForm } from "@/components/correction-form";

export const metadata: Metadata = {
  title: "Request a listing correction",
  description: "Tell TreatmentLane about inaccurate or outdated information in a directory listing.",
  alternates: { canonical: "/corrections" },
};

export default async function CorrectionsPage({ searchParams }: { searchParams: Promise<{ provider?: string }> }) {
  const { provider = "" } = await searchParams;
  return <>
    <section className="page-hero"><div className="shell"><span className="kicker plain">Directory accuracy</span><h1>Request a listing correction</h1><p>Help us review inaccurate, incomplete, or outdated directory information. We verify material changes before publishing them.</p></div></section>
    <article className="content-shell prose">
      <h2>What this page is for</h2>
      <p>Directory listings change. A provider moves, changes its phone number, closes a location, adds or drops a service, or updates the insurance it accepts, and the directory does not always catch the change on its own. This page is how anyone can flag information in a listing that looks wrong, incomplete, or out of date, so the listing can be checked and fixed. Providers can use it to correct their own listing, and families, referrers, and readers can use it to report something they noticed while comparing programs.</p>
      <h2>How the form works</h2>
      <p>The form asks for your name and email, which are required so the editorial team can follow up if a correction needs checking. You can add the provider name or the TreatmentLane listing URL, which is optional but helps the team find the right listing quickly. The main field asks what should be corrected: describe the information as it currently appears, what it should say instead, and how the change can be verified. There is also an optional field for a supporting source URL, such as the provider website page or a public record that shows the correct information.</p>
      <p>After you submit, the request goes to the TreatmentLane editorial team for review. Requests are reviewed before publication, and material changes are verified against provider and public-source information before anything is changed on the site. The team may contact you or the organization to verify a change. A correction request is not a message to the treatment provider itself, and this form does not reach a provider, so do not use it to contact a facility about admission or care.</p>
    </article>
    <section className="form-section"><div className="content-shell"><div className="notice"><strong>For urgent safety concerns:</strong> contact the organization or appropriate state authority directly. This form does not reach a treatment provider.</div><div className="spacer-24" /><CorrectionForm providerSlug={provider} /></div></section>
  </>;
}
