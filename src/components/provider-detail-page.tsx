import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock3, DollarSign, ExternalLink, Images, Layers3, MapPin, MapPinned, Phone, Star } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { ProviderReviews } from "@/components/provider-reviews";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { cityHubPath, inferredCity } from "@/lib/places";
import { providerDisplayName, providerLocationLabel, providerOverviewCopy } from "@/lib/provider-display";
import { providerPath, providerReferenceHref } from "@/lib/provider-path";
import { absoluteUrl, sourceDisplayName } from "@/lib/site";
import type { Provider } from "@/lib/types";
import { stateByCode } from "@/lib/us-states";

export const verificationLabels = {
  listed: "Directory listing",
  "data-verified": "TreatmentLane data verified",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

function unique(values: string[]) { return values.filter((item, index) => values.indexOf(item) === index); }

function InformationTags({ items }: { items: string[] }) {
  return <div className="information-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

export function ProviderDetailPage({ provider, organizationProviders = [provider], nearbyProviders = [] }: {
  provider: Provider;
  organizationProviders?: Provider[];
  nearbyProviders?: Provider[];
}) {
  const gallery = unique(provider.isSponsored && provider.featuredImageUrl
    ? [provider.featuredImageUrl, ...provider.imageUrls]
    : provider.imageUrls).slice(0, 5);
  const careTypes = unique([...provider.treatmentTypes, ...provider.levelsOfCare, ...provider.categories]);
  const path = providerPath(provider);
  const displayName = providerDisplayName(provider.name);
  const cityName = inferredCity(provider.address, provider.city);
  const placeLabel = providerLocationLabel(provider);
  const stateInfo = stateByCode(provider.state);
  const cityHref = stateInfo ? cityHubPath(stateInfo.slug, cityName) : null;
  const stateHref = stateInfo ? `/locations/${stateInfo.slug}` : null;
  const hasMultipleLocations = organizationProviders.length > 1;
  const sourceName = sourceDisplayName(provider.sourceUrl);
  const ratingValue = provider.sourceRatingValue;
  const ratingCount = provider.sourceRatingCount;
  const mapQuery = [provider.address, cityName, provider.state, provider.postalCode].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const overview = providerOverviewCopy(provider);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    ...(stateInfo && stateHref ? [{ name: stateInfo.name, path: stateHref }] : []),
    ...(cityHref ? [{ name: cityName, path: cityHref }] : []),
    ...(hasMultipleLocations ? [{ name: `${displayName} locations`, path: `/providers/${provider.organizationSlug}` }] : []),
    { name: displayName, path },
  ];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "MedicalBusiness", name: displayName,
    url: absoluteUrl(path), telephone: provider.phone || undefined,
    image: provider.featuredImageUrl || undefined,
    address: {
      "@type": "PostalAddress", streetAddress: provider.address || undefined, addressLocality: cityName,
      addressRegion: provider.state, postalCode: provider.postalCode || undefined, addressCountry: "US",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };

  return <>
    <JsonLd data={jsonLd} />
    <JsonLd data={breadcrumbJsonLd} />
    <section className="provider-hero"><div className="shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">{crumbs.map((crumb, index) => {
        const last = index === crumbs.length - 1;
        return last
          ? <span key={`${crumb.path}-${index}`}>{crumb.name}</span>
          : <span key={`${crumb.path}-${index}`}><Link href={crumb.path} prefetch={false}>{crumb.name}</Link><span aria-hidden="true">/</span></span>;
      })}</nav>
      <div className="provider-hero-copy">
        <div>{provider.isSponsored && <span className="kicker plain">Featured listing</span>}<h1>{displayName}</h1><p><MapPin size={18} /> {placeLabel}</p></div>
        <details className="provider-hero-status verification-badge">
          <summary><BadgeCheck size={18} /> {verificationLabels[provider.verificationStatus]}</summary>
          <div className="verification-details">
            <p><strong>What this means:</strong> {provider.verificationStatus === "independently-reviewed" ? "Our team independently verified this listing's details against primary sources." : provider.verificationStatus === "provider-confirmed" ? "The provider confirmed these details directly with TreatmentLane." : provider.verificationStatus === "data-verified" ? "We verified this data against public records and source documents." : "This listing is compiled from public source data and has not yet been independently verified."}</p>
            <p><Link href="/how-we-verify" prefetch={false}>Read our verification standards</Link></p>
          </div>
        </details>
      </div>
    </div></section>

    {gallery.length > 0 && <section className="shell provider-gallery-wrap">
      <div className={`provider-gallery gallery-count-${Math.min(gallery.length, 5)}`}>
        {gallery.map((image, index) => <div className="provider-gallery-image" key={image}>
          <Image src={image} alt={`${displayName} facility${index ? ` photo ${index + 1}` : ""}`} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 65vw" : "(max-width: 760px) 50vw, 25vw"} priority={index === 0} />
        </div>)}
      </div>
      <p className="image-attribution"><Images size={14} /> Photos are hosted by TreatmentLane and may have been supplied by the organization. Confirm that photos are current before making a decision.</p>
    </section>}

    <div className="shell provider-detail-grid">
      <main className="provider-content">
        <div className="notice"><strong>{verificationLabels[provider.verificationStatus]}.</strong> Confirm licensing, services, availability, insurance, and cost directly. <Link href="/how-we-verify" prefetch={false}>How we verify listings</Link>.</div>

        {provider.isSponsored && <div className="featured-profile-notice"><strong>Featured profile.</strong> This organization pays a flat monthly fee for enhanced placement, a longer profile, and photos. Payment does not affect its verification status.</div>}

        {(cityHref || stateHref) && <p className="hub-links">
          {cityHref && <Link href={cityHref} prefetch={false}>More providers in {cityName}</Link>}
          {cityHref && stateHref && <span aria-hidden="true"> · </span>}
          {stateHref && stateInfo && <Link href={stateHref} prefetch={false}>All listings in {stateInfo.name}</Link>}
        </p>}

        {hasMultipleLocations && <section className="listing-section provider-location-section">
          <span className="section-label">Other locations of this provider</span>
          <h2>{displayName} has {organizationProviders.length.toLocaleString()} published locations</h2>
          <p>You are viewing the {placeLabel} location.</p>
          <div className="provider-location-grid">
            {organizationProviders.map((location) => {
              const isCurrent = location.id === provider.id;
              const label = providerLocationLabel(location);
              return isCurrent
                ? <div className="provider-location-link is-current" key={location.id}><MapPin size={18} /><span><strong>{label}</strong><small>Current location</small></span></div>
                : <Link className="provider-location-link" href={providerPath(location)} key={location.id} prefetch={false}><MapPin size={18} /><span><strong>{label}</strong><small>View location details</small></span></Link>;
            })}
          </div>
          <Link className="text-link provider-all-locations-link" href={`/providers/${provider.organizationSlug}`} prefetch={false}>View all {displayName} locations</Link>
        </section>}

        <section className="listing-section">
          <span className="section-label">Overview</span><h2>About {displayName}</h2>
          <p className="listing-lead">{overview}</p>
          <div className="quick-facts">
            {careTypes.length > 0 && <div><Layers3 /><span>Primary type</span><strong>{careTypes[0]}</strong></div>}
            {provider.treatmentDuration && <div><Clock3 /><span>Typical duration</span><strong>{provider.treatmentDuration}</strong></div>}
            {provider.priceRange && <div><DollarSign /><span>Source price information</span><strong>{provider.priceRange}</strong></div>}
            {ratingValue !== null && ratingCount !== null && <div><Star /><span>{sourceName ? `${sourceName} source rating` : "Source rating"}</span><strong>{ratingValue.toFixed(1)} from {ratingCount.toLocaleString()} ratings</strong></div>}
            {provider.phone && <div><Phone /><span>Phone</span><strong>{provider.phone}</strong></div>}
          </div>
        </section>

        {careTypes.length > 0 && <section className="listing-section">
          <span className="section-label">Care options</span><h2>Treatment types and levels of care</h2>
          <InformationTags items={careTypes} />
        </section>}

        {provider.therapies.length > 0 && <section className="listing-section">
          <span className="section-label">Clinical approaches</span><h2>Therapies and services</h2>
          <InformationTags items={provider.therapies} />
        </section>}

        {(provider.insurance.length > 0 || provider.insuranceDetails || provider.priceRange) && <section className="listing-section">
          <span className="section-label">Payment</span><h2>Accepted insurance and payment options</h2>
          {provider.insurance.length > 0 && <InformationTags items={provider.insurance} />}
          {provider.insuranceDetails && <p className="source-detail">Source information: {provider.insuranceDetails}</p>}
          {provider.priceRange && <p className="price-estimate"><DollarSign size={16} /> <strong>Estimated cost:</strong> {provider.priceRange} <span className="estimate-note">(estimate, verify directly)</span></p>}
          <p className="section-caution">Insurance participation changes. Verify network status, authorization requirements, and expected out-of-pocket cost with both the provider and insurer.</p>
        </section>}

        {provider.amenities.length > 0 && <section className="listing-section">
          <span className="section-label">Environment</span><h2>Amenities and facility features</h2>
          <InformationTags items={provider.amenities} />
        </section>}

        {provider.specialties.length > 0 && <section className="listing-section">
          <span className="section-label">Program focus</span><h2>Specialties and populations served</h2><InformationTags items={provider.specialties} />
        </section>}

        {(provider.licenseSummary || provider.accreditation.length > 0) && <section className="listing-section">
          <span className="section-label">Safety checks</span><h2>Licensing and accreditation</h2>
          {provider.licenseSummary && <p>{provider.licenseSummary}</p>}
          {provider.accreditation.length > 0 && <InformationTags items={provider.accreditation} />}
        </section>}

        <ProviderReviews providerId={provider.id} providerName={displayName} />

        {nearbyProviders.length > 0 && <section className="listing-section">
          <span className="section-label">Nearby providers</span>
          <h2>Other providers in {cityName}</h2>
          <div className="provider-location-grid">
            {nearbyProviders.map((nearby) => <Link className="provider-location-link" href={providerPath(nearby)} key={nearby.id} prefetch={false}>
              <MapPin size={18} />
              <span><strong>{providerDisplayName(nearby.name)}</strong><small>{providerLocationLabel(nearby)}</small></span>
            </Link>)}
          </div>
          {cityHref && <Link className="text-link provider-all-locations-link" href={cityHref} prefetch={false}>Browse all {cityName} listings</Link>}
        </section>}

        <section className="listing-section">
          <span className="section-label">Accuracy</span><h2>Sources and corrections</h2>
          <p>Represent this organization? <Link href={providerReferenceHref("/providers/apply", path)} prefetch={false}>Claim this listing</Link>. See inaccurate information? <Link href={providerReferenceHref("/corrections", path)} prefetch={false}>Request a correction</Link>. TreatmentLane keeps source-derived information separate from provider-confirmed facts.</p>
        </section>
      </main>

      <aside className="detail-sidebar provider-contact-card">
        <h2>Contact information</h2><dl>
          <dt>Location</dt><dd>{provider.address && <>{provider.address}<br /></>}{placeLabel} {provider.postalCode}</dd>
          <dt>Map</dt><dd><TrackedContactLink href={mapUrl} rel="noopener noreferrer nofollow" target="_blank"><MapPinned size={15} /> View map and directions</TrackedContactLink></dd>
          {provider.phone && <><dt>Phone</dt><dd><TrackedContactLink href={`tel:${provider.phone}`}><Phone size={15} /> {provider.phone}</TrackedContactLink></dd></>}
          {provider.website && <><dt>Official website</dt><dd><TrackedContactLink href={provider.website} rel="noopener noreferrer nofollow" target="_blank">Visit website <ExternalLink size={14} /></TrackedContactLink></dd></>}
          {provider.sourceUrl && <><dt>Public source</dt><dd><a href={provider.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">View source record <ExternalLink size={14} /></a></dd></>}
          <dt>Listing status</dt><dd><BadgeCheck size={15} /> {verificationLabels[provider.verificationStatus]}</dd>
          <dt>Last reviewed</dt><dd>{provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Not independently reviewed"}</dd>
        </dl>
        {provider.phone && <TrackedContactLink className="button provider-call-button" href={`tel:${provider.phone}`}><Phone size={17} /> Call organization</TrackedContactLink>}
        <Link className="button button-secondary provider-claim-button" href={providerReferenceHref("/providers/apply", path)} prefetch={false}><BadgeCheck size={17} /> Claim this listing</Link>
        {cityHref && <Link className="text-link" href={cityHref} prefetch={false}>Providers in {cityName}, {provider.state}</Link>}
        <p className="form-disclaimer">TreatmentLane does not recommend or guarantee any provider. In an emergency, call 911 or 988.</p>
      </aside>
    </div>
  </>;
}
