import type { Metadata } from "next";
import Image from "next/image";
import { ProviderApplicationForm } from "@/components/provider-application-form";
import { brandImageUrl } from "@/lib/site";

export const metadata: Metadata = { title: "List or claim your organization", description: "Submit a treatment, recovery, or behavioral health organization for TreatmentLane review.", alternates: { canonical: "/providers/apply" } };

export default function ApplyPage() {
  return <><section className="page-hero visual-page-hero"><div className="shell visual-page-hero-grid"><div><span className="kicker plain">Provider applications</span><h1>List or claim your organization</h1><p>Submit accurate information for editorial review. Payment does not determine verification status or whether a listing is published.</p></div><div className="visual-page-hero-image"><Image src={brandImageUrl("treatmentlane-provider-profile.webp")} alt="Illustration of a complete provider profile with photos, contact details, and reporting" width={1200} height={800} priority /></div></div></section><section className="form-section"><div className="content-shell"><div className="notice"><strong>Before you start:</strong> You must be authorized to represent the organization. We may verify the request using official contact information or public records.</div><div style={{height: 24}} /><ProviderApplicationForm /></div></section></>;
}
