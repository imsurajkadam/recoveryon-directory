import type { Metadata } from "next";
import Link from "next/link";
import { IllustratedHero, StatRow, StepsDiagram, VerificationLadder } from "@/components/illustrations";
import { listingSteps } from "@/lib/care-facts";
import { getDirectoryOverview } from "@/lib/providers";

export const revalidate = 3600;

export const metadata: Metadata = { title: "About TreatmentLane", description: "Learn why TreatmentLane exists and how the directory approaches transparency, verification, and treatment information.", alternates: { canonical: "/about" } };

export default async function AboutPage() {
  const overview = await getDirectoryOverview();
  return <><IllustratedHero kind="about" kicker="About" title="A clearer lane through treatment information"><p>TreatmentLane helps people find, compare, and verify recovery resources without pretending that a directory can make the decision for them.</p></IllustratedHero>
    {overview.total > 0 && <section className="section section-snug"><div className="shell"><StatRow stats={[
      { label: "Published listings", value: overview.total.toLocaleString("en-US") },
      { label: "Cities covered", value: overview.cities.toLocaleString("en-US") },
      { label: "States and territories", value: String(Object.keys(overview.byState).length) },
      { label: "Provider-verified listings", value: overview.verified.toLocaleString("en-US") },
    ]} /></div></section>}
    <section className="section section-snug section-tint"><div className="shell">
      <div className="section-heading"><div><h2>How people use TreatmentLane</h2><p>The directory supports research. The decision stays with you and the professionals you trust.</p></div></div>
      <StepsDiagram steps={listingSteps} />
    </div></section>
    <section className="section section-snug"><div className="shell">
      <div className="section-heading"><div><h2>How we label listings</h2><p>We publish clear labels instead of one vague badge.</p></div><Link className="text-link" href="/how-we-verify" prefetch={false}>Read the full method</Link></div>
      <VerificationLadder />
    </div></section>
    <article className="content-shell prose"><h2>Why we built TreatmentLane</h2><p>People looking for addiction treatment often face incomplete information, confusing terminology, urgent timelines, and financial uncertainty. Providers also struggle to keep public information accurate across many websites.</p><p>TreatmentLane is being built as a transparent directory: useful enough to support research, careful enough to show its limits, and structured so providers and readers can request corrections.</p><h2>What we do</h2><ul><li>Organize treatment and recovery resources by service and location.</li><li>Publish clear verification labels instead of a single vague “verified” badge.</li><li>Show when important details were last reviewed.</li><li>Provide practical questions and links to authoritative resources.</li><li>Separate sponsorship from editorial verification.</li></ul><h2>What we do not do</h2><p>TreatmentLane is not a treatment provider, referral service, emergency service, insurer, clinical assessor, or guarantee of quality. A listing does not mean an organization is appropriate for a particular person.</p><p>Read <Link href="/how-we-verify">how we verify listings</Link> or <Link href="/contact">contact us</Link>.</p></article></>;
}
