import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { BUSINESS_CONTACT, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact TreatmentLane",
  description: "Contact TreatmentLane about the directory, provider listings, partnerships, or privacy.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <>
    <section className="page-hero"><div className="shell"><span className="kicker plain">Contact</span><h1>How can we help?</h1><p>For directory questions, provider listings, partnerships, media, or privacy requests, send us a message below.</p></div></section>
    <section className="form-section"><div className="content-shell"><div className="notice"><strong>This is not a crisis or admissions line.</strong> If someone may be in immediate danger, call 911. For crisis support, call or text 988. See our <Link href="/emergency-help">emergency help page</Link>.</div><div className="contact-email">Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>{(BUSINESS_CONTACT.phone || BUSINESS_CONTACT.streetAddress) && <dl className="contact-email"><div>{BUSINESS_CONTACT.phone && <><dt>Phone</dt><dd><a href={`tel:${BUSINESS_CONTACT.phone}`}>{BUSINESS_CONTACT.phone}</a></dd></>}</div><div>{BUSINESS_CONTACT.streetAddress && <><dt>Address</dt><dd>{BUSINESS_CONTACT.streetAddress}{BUSINESS_CONTACT.addressLocality ? <><br />{BUSINESS_CONTACT.addressLocality}{BUSINESS_CONTACT.addressRegion ? `, ${BUSINESS_CONTACT.addressRegion}` : ""} {BUSINESS_CONTACT.postalCode}</> : null}</dd></>}</div></dl>}<ContactForm /></div></section>
  </>;
}
