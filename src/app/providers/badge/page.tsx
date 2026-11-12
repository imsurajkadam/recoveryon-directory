import type { Metadata } from "next";
import Link from "next/link";
import { BadgeEmbedCode } from "@/components/badge-embed-code";
import { providerFromListingPath } from "@/lib/badge";
import { providerPath } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Add the TreatmentLane badge to your website",
  description: "Embed code for providers listed on TreatmentLane. Verified providers get the TreatmentLane Verified badge.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/providers/badge" },
};

export default async function BadgePage({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing = "" } = await searchParams;
  const provider = listing ? await providerFromListingPath(listing.slice(0, 300)) : null;
  if (!provider) {
    return <section className="page-hero"><div className="shell">
      <span className="kicker plain">For providers</span>
      <h1>Add the TreatmentLane badge to your website</h1>
      <p>Open your listing on TreatmentLane and choose &ldquo;Add the badge to your website&rdquo; to get embed code for your organization. Not verified yet? <Link className="text-link" href="/providers/apply" prefetch={false}>Claim your listing</Link> and we will confirm your details.</p>
    </div></section>;
  }
  const path = providerPath(provider);
  const verified = provider.verificationStatus === "provider-confirmed";
  const listingUrl = absoluteUrl(path);
  const badgeUrl = absoluteUrl(`/api/badge?listing=${encodeURIComponent(path)}`);
  const label = verified ? "TreatmentLane Verified" : "Listed on TreatmentLane";
  const code = `<a href="${listingUrl}" title="${provider.name} on TreatmentLane"><img src="${badgeUrl}" alt="${label}: ${provider.name}" width="240" height="56" loading="lazy" /></a>`;

  return <>
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href={path} prefetch={false}>{provider.name}</Link><span>/</span><span>Website badge</span></div>
      <span className="kicker plain">For providers</span>
      <h1>{verified ? "Show you're TreatmentLane Verified" : "Add the TreatmentLane badge"}</h1>
      <p>{verified
        ? `${provider.name} has confirmed its listing with TreatmentLane. Add this badge to your website so visitors can see your verified details, insurance, and services in one place.`
        : `${provider.name} is listed on TreatmentLane. Claim and verify your listing to upgrade this badge to TreatmentLane Verified.`}</p>
      {!verified ? <div className="inline-actions"><Link className="button" href={`/providers/apply?provider=${encodeURIComponent(path)}`} prefetch={false}>Claim and verify this listing</Link></div> : null}
    </div></section>
    <section className="section"><div className="shell content-shell">
      <div className="badge-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeUrl} alt={label} width={240} height={56} />
        <p>The badge links to your listing at <Link className="text-link" href={path} prefetch={false}>{listingUrl.replace("https://", "")}</Link> and updates automatically if your verification status changes.</p>
      </div>
      <h2 className="spacer-top">Embed code</h2>
      <p>Paste this HTML where you want the badge to appear, such as your footer or an &ldquo;About us&rdquo; or insurance page.</p>
      <BadgeEmbedCode code={code} />
    </div></section>
  </>;
}
