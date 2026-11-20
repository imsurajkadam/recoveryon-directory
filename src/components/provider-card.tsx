import Image from "next/image";
import { isSourceImage, sizedImageUrl } from "@/lib/images";
import { buildProviderBlurb, hasTemplateDescription } from "@/lib/provider-summary";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, Building2, CalendarCheck, MapPin, MapPinned, Phone, ShieldCheck, Star } from "lucide-react";
import { FeaturedBadge } from "@/components/featured-badge";
import { VerifiedTick } from "@/components/verified-tick";
import { ListingCta, ListingImpression } from "@/components/listing-event-tracking";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { providerPath } from "@/lib/providers";
import { sourceDisplayName } from "@/lib/site";
import { listingAccreditation } from "@/lib/credentials";
import { formatPhone } from "@/lib/phone";
import type { Provider } from "@/lib/types";

const labels = {
  listed: "Directory listing",
  "data-verified": "TreatmentLane data verified",
  "provider-confirmed": "TreatmentLane Verified",
  "independently-reviewed": "Independently reviewed",
};

function summarize(items: string[], limit: number) {
  const unique = items.filter((item, index) => item && items.indexOf(item) === index);
  const shown = unique.slice(0, limit).join(", ");
  return unique.length > limit ? `${shown} +${unique.length - limit} more` : shown;
}

export function ProviderCard({ provider, layout = "row" }: { provider: Provider; layout?: "row" | "tile" }) {
  const tags = [...provider.treatmentTypes, ...provider.categories].filter((item, index, items) => items.indexOf(item) === index).slice(0, 3);
  const insuranceSummary = summarize(provider.insurance, 3);
  const accreditation = listingAccreditation(provider);
  const accreditationSummary = summarize(accreditation.all, 2);
  const checkedOn = provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : null;
  const href = providerPath(provider);
  const isVerified = provider.verificationStatus === "provider-confirmed";
  const locationCountLabel = `${provider.organizationLocationCount.toLocaleString()} ${provider.organizationLocationCount === 1 ? "location" : "locations"}`;
  const sourceName = sourceDisplayName(provider.sourceUrl);
  const mapQuery = [provider.address, provider.city, provider.state, provider.postalCode].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  return (
    <article className={`provider-card${layout === "tile" ? " provider-card-tile" : ""}${provider.isSponsored ? " provider-card-featured" : ""}${isVerified ? " provider-card-verified" : ""}`}>
      <ListingImpression providerId={provider.id} />
      {provider.isSponsored && <FeaturedBadge />}
      <Link className="provider-card-media" href={href} aria-label={`View ${provider.name}`} prefetch={false}>
        {provider.featuredImageUrl
          ? <Image src={sizedImageUrl(provider.featuredImageUrl, 480, 360)} alt={`${provider.name} facility`} fill sizes="(max-width: 760px) 100vw, 190px" unoptimized={isSourceImage(provider.featuredImageUrl)} />
          : <span className="provider-card-placeholder" aria-hidden="true"><Building2 /></span>}
      </Link>
      <div className="provider-card-body">
        <div className="provider-card-heading">
          <div className="eyebrow"><MapPin size={15} /> {provider.city}, {provider.state}</div>
          {provider.organizationLocationCount > 1
            ? <Link className="location-count-badge" href={`/providers/${provider.organizationSlug}`} aria-label={`View all ${locationCountLabel} for ${provider.name}`} prefetch={false}><MapPinned size={14} /> {locationCountLabel}</Link>
            : <span className="location-count-badge"><MapPinned size={14} /> {locationCountLabel}</span>}
        </div>
        <h2><Link href={href} prefetch={false}>{provider.name}</Link>{isVerified && <VerifiedTick size={20} className="verified-tick-inline" />}</h2>
        <p>{hasTemplateDescription(provider) ? buildProviderBlurb(provider) : provider.description}</p>
        {(insuranceSummary || accreditationSummary) && <ul className="provider-card-facts">
          {accreditationSummary && <li><Award size={15} aria-hidden="true" /><span><strong>{accreditation.confirmed ? "Accreditation:" : "Reports accreditation:"}</strong> {accreditationSummary}</span></li>}
          {insuranceSummary && <li><ShieldCheck size={15} aria-hidden="true" /><span><strong>Reports accepting:</strong> {insuranceSummary}</span></li>}
        </ul>}
        {tags.length > 0 && <div className="tag-row">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>}
        <div className="provider-card-meta">
          <span className="verification-line">{isVerified ? <VerifiedTick size={16} /> : <BadgeCheck size={16} />} {labels[provider.verificationStatus]}</span>
          {provider.sourceRatingValue !== null && provider.sourceRatingCount !== null && <span className="source-rating"><Star size={15} /> {sourceName ? `${sourceName} source rating: ${provider.sourceRatingValue.toFixed(1)} from ${provider.sourceRatingCount.toLocaleString()} ratings` : `${provider.sourceRatingValue.toFixed(1)} source rating`}</span>}
          {checkedOn && <span className="checked-line"><CalendarCheck size={15} /> Details checked {checkedOn}</span>}
        </div>
        <div className="provider-card-actions"><ListingCta providerId={provider.id} href={href}>View profile <ArrowRight size={15} /></ListingCta>{provider.phone && <TrackedContactLink className="provider-card-call-link" href={`tel:${provider.phone}`} aria-label={`Call ${provider.name}`}><Phone size={15} /> {formatPhone(provider.phone)}</TrackedContactLink>}<TrackedContactLink className="provider-card-map-link" href={mapUrl} target="_blank" rel="noopener noreferrer nofollow"><MapPinned size={15} /> Map</TrackedContactLink></div>
      </div>
    </article>
  );
}
