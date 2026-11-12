import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact TreatmentLane",
  description: "Contact TreatmentLane about the directory, provider listings, partnerships, or privacy.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <>
    <section className="page-hero"><div className="shell"><span className="kicker plain">Contact</span><h1>How can we help?</h1><p>For directory questions, provider listings, partnerships, media, or privacy requests, send us a message below.</p></div></section>
    <article className="content-shell prose">
      <h2>What this page is for</h2>
      <p>This page is how to reach the TreatmentLane team about the directory itself. Use it for questions about how the directory works, for feedback on a provider listing, for partnership or media inquiries, or for privacy requests about information on the site. If you spotted an error in a specific listing, the <Link href="/corrections" prefetch={false}>corrections page</Link> is the faster route, because it asks for the listing and the source that verifies the change.</p>
      <h2>How the form works</h2>
      <p>The form asks for your name and email, a topic, and your message. The topic choices are a general question, a provider listing, partnership or media, a privacy request, or other. Choose the topic that fits best so the message reaches the right review. Write enough detail for the team to act on: for a listing question, include the provider name or listing URL; for a partnership or media inquiry, describe what you are proposing; for a privacy request, describe the information involved and what you are asking for.</p>
      <p>After you send the form, the team reviews your message and responds when a reply is needed. If you prefer email, you can write to the address shown below the crisis notice instead of using the form. Do not use this form for emergencies or confidential medical information. TreatmentLane is a directory, not a treatment provider, so it cannot arrange admission, give medical advice, or pass a message to a facility on your behalf. If you need a provider, use the directory to find one and contact the provider directly.</p>
    </article>
    <section className="form-section"><div className="content-shell"><div className="notice"><strong>This is not a crisis or admissions line.</strong> If someone may be in immediate danger, call 911. For crisis support, call or text 988. See our <Link href="/emergency-help">emergency help page</Link>.</div><div className="contact-email">Prefer email? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div><ContactForm /></div></section>
  </>;
}
