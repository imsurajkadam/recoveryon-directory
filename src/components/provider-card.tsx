import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, MapPin, MapPinned, Star } from "lucide-react";
import { FeaturedBadge } from "@/components/featured-badge";
import { ListingCta, ListingImpression } from "@/components/listing-event-tracking";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { providerPath } from "@/lib/providers";
import { sourceDisplayName } from "@/lib/site";
import type { Provider } from "@/lib/types";

const labels = {
  listed: "Directory listing",
  "data-verified": "TreatmentLane data verified",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

export function ProviderCard({ provider }: { provider: Provider }) {
  const tags = [...provider.treatmentTypes, ...provider.categories].filter((item, index, items) => items.indexOf(item) === index).slice(0, 4);
  const href = providerPath(provider);
  const locationCountLabel = `${provider.organizationLocationCount.toLocaleString()} ${provider.organizationLocationCount === 1 ? "location" : "locations"}`;
  const sourceName = sourceDisplayName(provider.sourceUrl);
  const mapQuery = [provider.address, provider.city, provider.state, provider.postalCode].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  return (
    <article className={`provider-card${provider.isSponsored ? " provider-card-featured" : ""}`}>
      <ListingImpression providerId={provider.id} />
      {provider.isSponsored && <FeaturedBadge />}
      <Link className="provider-card-media" href={href} aria-label={`View ${provider.name}`} prefetch={false}>
        {provider.featuredImageUrl
          ? <Image src={provider.featuredImageUrl} alt={`${provider.name} facility`} fill sizes="(max-width: 760px) 100vw, 190px" />
          : <span className="provider-card-placeholder" aria-hidden="true"><Building2 /></span>}
      </Link>
      <div className="provider-card-body">
        <div className="provider-card-heading">
          <div className="eyebrow"><MapPin size={15} /> {provider.city}, {provider.state}</div>
          {provider.organizationLocationCount > 1
            ? <Link className="location-count-badge" href={`/providers/${provider.organizationSlug}`} aria-label={`View all ${locationCountLabel} for ${provider.name}`} prefetch={false}><MapPinned size={14} /> {locationCountLabel}</Link>
            : <span className="location-count-badge"><MapPinned size={14} /> {locationCountLabel}</span>}
        </div>
        <h2><Link href={href} prefetch={false}>{provider.name}</Link></h2>
        <p>{provider.description || "View treatment types, services, contact information, and source details."}</p>
        <div className="tag-row">{tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="provider-card-meta">
          <span className="verification-line"><BadgeCheck size={16} /> {labels[provider.verificationStatus]}</span>
          {provider.sourceRatingValue !== null && provider.sourceRatingCount !== null && <span className="source-rating"><Star size={15} /> {sourceName ? `${sourceName} source rating: ${provider.sourceRatingValue.toFixed(1)} from ${provider.sourceRatingCount.toLocaleString()} ratings` : `${provider.sourceRatingValue.toFixed(1)} source rating`}</span>}
        </div>
        <div className="provider-card-actions"><ListingCta providerId={provider.id} href={href}>View profile <ArrowRight size={15} /></ListingCta><TrackedContactLink className="provider-card-map-link" href={mapUrl} target="_blank" rel="noopener noreferrer nofollow"><MapPinned size={15} /> Map</TrackedContactLink></div>
      </div>
    </article>
  );
}
