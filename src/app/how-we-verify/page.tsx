import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandImageUrl } from "@/lib/site";

export const metadata: Metadata = { title: "How TreatmentLane verifies listings", description: "Understand TreatmentLane's listing labels, review sources, correction process, and sponsorship policy.", alternates: { canonical: "/how-we-verify" } };

export default function VerificationPage() {
  return <><section className="page-hero visual-page-hero"><div className="shell visual-page-hero-grid"><div><span className="kicker plain">Verification methodology</span><h1>What our listing labels mean</h1><p>Verification is a documented process, not a promise that a provider is right for everyone.</p></div><div className="visual-page-hero-image"><Image src={brandImageUrl("treatmentlane-verification.webp")} alt="TreatmentLane verification process with source, license, and safety checks" width={1200} height={800} priority /></div></div></section><article className="content-shell prose">
    <h2>Directory listing</h2><p>Basic identity and contact information were collected from a provider, public record, or directory. This label does not mean every service or claim has been independently confirmed.</p>
    <h2>TreatmentLane data verified</h2><p>TreatmentLane matched the location across authoritative or independent sources, resolved material conflicts, and recorded dated evidence for required identity, contact, and licensing checks. This is a data-quality label, not a clinical endorsement.</p>
    <h2>Provider confirmed</h2><p>An authorized representative confirmed important listing details. TreatmentLane may compare the response with official websites or public records.</p>
    <h2>Independently reviewed</h2><p>TreatmentLane completed a broader manual review of selected identity, licensing, accreditation, or service information against named third-party sources and recorded the review date. Readers should still verify current status directly.</p>
    <h2>What we review</h2><ul><li>Organization name, location, and official contact channels</li><li>State licensing information when applicable and accessible</li><li>Accreditation claims when publicly verifiable</li><li>Published levels of care and major services</li><li>Website, phone, and provider-supplied corrections</li></ul>
    <h2>Recommended order</h2><p>Featured listings appear first and are clearly labeled. Within Featured and standard groups, recommended results use a composite quality score. Strong source evidence and profile completeness lead, while verification adds a measured bonus and review confidence helps separate otherwise similar listings. A large review count alone does not prove treatment quality.</p>
    <h2>Sponsorship</h2><p>Paid placement is labeled “Featured” and appears before non-sponsored results. Payment can support a longer profile and photos, but it cannot purchase a verification label, remove legitimate corrections, or change our explanation of the listing.</p>
    <h2>Corrections</h2><p>Information can change. Readers and authorized representatives can <Link href="/corrections">request a correction</Link>. Material changes are reviewed before publication.</p>
  </article></>;
}
