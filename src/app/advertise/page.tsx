import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, BadgeCheck, BarChart3, Check, Mail, Star } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ContactForm } from "@/components/contact-form";
import { FeaturedBadge } from "@/components/featured-badge";
import { brandImageUrl, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Advertise on TreatmentLane",
  description: "Join TreatmentLane as a founding featured partner with transparent flat-fee monthly pricing and listing performance reporting.",
  alternates: { canonical: "/advertise" },
};

const included = [
  "Featured placement above non-sponsored results",
  "A clearly labeled Featured badge",
  "A longer profile with your organization description",
  "Profile photos using your featured listing image",
  "Monthly impression and profile click reporting",
];

export default function AdvertisePage() {
  return <>
    <section className="advertise-hero">
      <div className="shell advertise-hero-grid">
        <div>
          <span className="kicker">Founding partner offer</span>
          <h1>Help more families understand what your organization offers</h1>
          <p>Featured listings give treatment and recovery organizations stronger visibility while keeping sponsorship separate from TreatmentLane verification.</p>
          <div className="inline-actions">
            <a className="button" href="#inquiry"><Mail size={17} /> Become a founding partner</a>
            <a className="button button-secondary" href="#pricing">View pricing</a>
          </div>
        </div>
        <div className="featured-listing-preview" aria-label="Example featured listing card">
          <FeaturedBadge />
          <div className="featured-listing-preview-image">
            <Image src={brandImageUrl("treatmentlane-featured-listing.webp")} alt="Illustration of a welcoming treatment facility entrance" fill sizes="(max-width: 980px) 100vw, 45vw" priority />
            <span className="visual-brand-chip"><BrandMark /></span>
            <span className="illustration-label">Illustrative example</span>
          </div>
          <div>
            <span className="eyebrow">City, State</span>
            <h2>Your organization</h2>
            <p>Share a clear, useful description of your services, approach, and the people you support.</p>
            <div className="featured-listing-preview-meta"><BadgeCheck size={16} /> Verification stays independent</div>
            <span className="provider-card-cta">View profile <ArrowRight size={15} /></span>
          </div>
        </div>
      </div>
    </section>

    <section className="section" id="pricing"><div className="shell">
      <div className="section-heading"><div><span className="kicker plain">Simple pricing</span><h2>Flat monthly fees, with no referral pricing</h2><p>Choose a predictable listing plan. TreatmentLane does not charge based on calls, leads, or admissions.</p></div></div>
      <div className="advertise-pricing-grid">
        <article className="pricing-card pricing-card-featured">
          <div><span className="pricing-label">First 20 partners</span><h3>Founding partner</h3><p className="pricing-lead"><strong>3 months free</strong>, then $99 per month for the following 12 months.</p></div>
          <ul>{included.map((item) => <li key={item}><Check size={18} /> {item}</li>)}</ul>
          <a className="button" href={`mailto:${CONTACT_EMAIL}`}>Email {CONTACT_EMAIL}</a>
        </article>
        <article className="pricing-card">
          <div><span className="pricing-label">After the founding 20</span><h3>Standard featured listing</h3><p className="pricing-lead"><strong>$199 per month</strong> on standard monthly pricing.</p></div>
          <ul>{included.map((item) => <li key={item}><Check size={18} /> {item}</li>)}</ul>
          <a className="button button-secondary" href={`mailto:${CONTACT_EMAIL}`}>Ask about availability</a>
        </article>
      </div>
    </div></section>

    <section className="section section-tint"><div className="shell advertise-benefits-grid">
      <div><BarChart3 /><h2>See what your listing delivers</h2><p>Partner reporting shows listing card impressions and profile clicks over time. These are visibility metrics, not guaranteed patient inquiries or admissions.</p></div>
      <div><Star /><h2>Keep trust clear</h2><p>Featured listings are labeled. Payment can improve placement and profile presentation, but it cannot buy a verification status or remove legitimate corrections.</p></div>
    </div></section>

    <section className="section"><div className="content-shell advertise-terms">
      <span className="kicker plain">Offer terms</span><h2>Transparent flat-fee placement</h2>
      <p>The founding offer is available to the first 20 accepted partners. It includes three free months, followed by 12 months at $99 per month. After the founding group is filled, standard featured listing pricing is $199 per month.</p>
      <p><strong>All pricing is a flat monthly fee.</strong> There are no per-call, per-lead, or per-admission fees. Payment is for advertising placement and enhanced profile presentation only. It does not guarantee calls, leads, admissions, clinical suitability, or a particular result.</p>
      <p>Organizations remain responsible for the accuracy of information they provide and for compliance with applicable laws, regulations, and professional obligations. TreatmentLane may decline or remove a featured listing that does not meet its publishing standards.</p>
      <a className="button" href="#inquiry"><Mail size={17} /> Send an inquiry</a>
    </div></section>
    <section className="form-section" id="inquiry"><div className="content-shell">
      <span className="kicker plain">Partner inquiry</span><h2>Tell us about your organization</h2><p>Send a short note about the organization and the locations you want to feature. Do not include patient information.</p>
      <ContactForm topic="partnership" topicLocked />
      <p className="form-disclaimer">Prefer email? Contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </div></section>
  </>;
}
