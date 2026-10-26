import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", description: "How TreatmentLane handles information submitted through the directory.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Last updated October 26, 2026</span><h1>Privacy policy</h1><p>This page explains what information TreatmentLane collects, why we use it, and the choices available to you.</p></div></section><article className="content-shell prose">
    <h2>Information you provide</h2><p>We collect information you choose to submit through provider applications, correction requests, and contact forms. This may include your name, work email, phone number, organization details, and the contents of your message.</p>
    <h2>Information collected automatically</h2><p>Our hosting and security providers may process basic technical information such as IP address, browser type, requested pages, timestamps, and security events. We use Google Analytics (GA4) to understand broad site usage. Before sending page views, TreatmentLane removes search terms, ZIP codes, exact provider paths, care category paths, article paths, and state paths. Form and contact events use generic event names and do not send names, email addresses, phone numbers, provider identifiers, form contents, or search values to Google Analytics. Google signals and advertising personalization are disabled in our site configuration. You can also use the Google Analytics opt-out browser add-on.</p>
    <h2>How we use information</h2><ul><li>Review and verify provider listings and corrections</li><li>Respond to questions and protect the directory from misuse</li><li>Operate, troubleshoot, and improve the website</li><li>Comply with legal obligations and enforce our terms</li></ul>
    <h2>Health information</h2><p>TreatmentLane is not a treatment provider and this website is not designed to receive medical records or confidential treatment information. Please do not submit diagnoses, insurance identifiers, treatment records, or other sensitive health information through our forms.</p>
    <h2>Service providers</h2><p>We may use vendors for website hosting, database storage, security, email, and related operations. They process information on our behalf under their own contractual and legal obligations. We do not sell personal information.</p>
    <h2>Retention and security</h2><p>We retain submissions as reasonably necessary for review, recordkeeping, safety, and legal purposes. We use reasonable safeguards, but no internet service can guarantee absolute security.</p>
    <h2>Your choices</h2><p>You may ask about, correct, or request deletion of personal information you submitted, subject to legal and operational exceptions. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the <Link href="/contact">contact form</Link>.</p>
    <h2>Children</h2><p>The site is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
    <h2>Changes</h2><p>We may update this policy as the service changes. The date at the top shows the latest revision.</p>
  </article></>;
}
