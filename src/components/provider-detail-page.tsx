import Image from "next/image";
import { isPlaceholderImage, isSourceImage, sizedImageUrl } from "@/lib/images";
import { cityCarePath, cityCareTypes, cityPath, isIndexedCityCarePage, stateByCode } from "@/lib/city-pages";
import { buildProviderSummary, hasTemplateDescription } from "@/lib/provider-summary";
import { VerifiedTick } from "@/components/verified-tick";
import Link from "next/link";
import { BadgeCheck, Clock3, DollarSign, ExternalLink, Images, Layers3, MapPin, MapPinned, Phone, Star } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { buildFaqPageJsonLd, getProviderFaqs } from "@/lib/faq-schema";
import { ProviderReviews } from "@/components/provider-reviews";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { providerPath } from "@/lib/providers";
import { absoluteUrl, sourceDisplayName } from "@/lib/site";
import type { Provider } from "@/lib/types";

export const verificationLabels = {
  listed: "Directory listing",
  "data-verified": "TreatmentLane data verified",
  "provider-confirmed": "TreatmentLane Verified",
  "independently-reviewed": "Independently reviewed",
};

function unique(values: string[]) { return values.filter((item, index) => values.indexOf(item) === index); }

function InformationTags({ items }: { items: string[] }) {
  return <div className="information-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

export function ProviderDetailPage({ provider, organizationProviders = [provider], nearbyProviders = [] }: { provider: Provider; organizationProviders?: Provider[]; nearbyProviders?: Provider[] }) {
  const gallery = unique(provider.isSponsored && provider.featuredImageUrl
    ? [provider.featuredImageUrl, ...provider.imageUrls]
    : provider.imageUrls).filter((image) => !isPlaceholderImage(image)).slice(0, 5);
  const careTypes = unique([...provider.treatmentTypes, ...provider.levelsOfCare, ...provider.categories]);
  const path = providerPath(provider);
  const isVerified = provider.verificationStatus === "provider-confirmed";
  const hasMultipleLocations = organizationProviders.length > 1;
  const sourceName = sourceDisplayName(provider.sourceUrl);
  const ratingValue = provider.sourceRatingValue;
  const ratingCount = provider.sourceRatingCount;
  const mapQuery = [provider.address, provider.city, provider.state, provider.postalCode].filter(Boolean).join(", ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const faqs = getProviderFaqs(provider);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "MedicalBusiness", name: provider.name,
    url: absoluteUrl(path), telephone: provider.phone || undefined,
    image: provider.featuredImageUrl || undefined,
    address: {
      "@type": "PostalAddress", streetAddress: provider.address || undefined, addressLocality: provider.city,
      addressRegion: provider.state, postalCode: provider.postalCode || undefined, addressCountry: "US",
    },
  };

  return <>
    <JsonLd data={jsonLd} />
    {faqs.length ? <JsonLd data={buildFaqPageJsonLd(faqs)} /> : null}
    <section className={`provider-hero${isVerified ? " is-verified" : ""}`}><div className="shell">
      <div className="breadcrumb"><Link href="/directory" prefetch={false}>Directory</Link><span>/</span>{hasMultipleLocations ? <><Link href={`/providers/${provider.organizationSlug}`} prefetch={false}>{provider.name} locations</Link><span>/</span><span>{provider.city}</span></> : <span>{provider.name}</span>}</div>
      <div className="provider-hero-copy">
        <div>{provider.isSponsored && <span className="kicker plain">Featured listing</span>}{isVerified && <span className="kicker verified-kicker"><VerifiedTick size={16} /> TreatmentLane Verified provider</span>}<h1>{provider.name}{isVerified && <VerifiedTick size={40} className="verified-tick-title" />}</h1><p><MapPin size={18} /> {provider.city}, {provider.state}</p></div>
        <details className={`provider-hero-status verification-badge${provider.verificationStatus === "provider-confirmed" || provider.verificationStatus === "independently-reviewed" ? " is-confirmed" : ""}${provider.verificationStatus === "provider-confirmed" ? " is-claimed" : ""}`}>
          <summary>{isVerified ? <VerifiedTick size={20} /> : <BadgeCheck size={18} />} {verificationLabels[provider.verificationStatus]}</summary>
          <div className="verification-details">
            <p><strong>What this means:</strong> {provider.verificationStatus === "independently-reviewed" ? "Our team independently verified this listing's details against primary sources." : provider.verificationStatus === "provider-confirmed" ? "This provider claimed its listing and confirmed these details directly with TreatmentLane." : provider.verificationStatus === "data-verified" ? "We verified this data against public records and source documents." : "This listing is compiled from public source data and has not yet been independently verified."}</p>
            <p><Link href="/how-we-verify" prefetch={false}>Read our verification standards</Link></p>
          </div>
        </details>
      </div>
    </div></section>

    {provider.verificationStatus === "provider-confirmed" && <section className="shell"><div className="claimed-banner"><VerifiedTick size={30} /><p><strong>TreatmentLane Verified.</strong> This listing has been claimed by {provider.name}. The provider confirmed their details directly with TreatmentLane{provider.lastVerifiedAt ? ` on ${new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { dateStyle: "long" })}` : ""}, so the contact details on this page are the ones they asked us to show.</p></div></section>}

    {gallery.length > 0 && <section className="shell provider-gallery-wrap">
      <div className={`provider-gallery gallery-count-${Math.min(gallery.length, 5)}`}>
        {gallery.map((image, index) => <div className="provider-gallery-image" key={image}>
          <Image src={sizedImageUrl(image, index === 0 ? 1400 : 700, index === 0 ? 900 : 450)} alt={`${provider.name} facility${index ? ` photo ${index + 1}` : ""}`} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 65vw" : "(max-width: 760px) 50vw, 25vw"} priority={index === 0} unoptimized={isSourceImage(image)} />
        </div>)}
      </div>
      <p className="image-attribution"><Images size={14} /> {gallery.some(isSourceImage)
        ? <>Photos come from public listings for this organization and may not be current. {isVerified ? "" : <>Represent {provider.name}? <Link href={`/providers/apply?provider=${encodeURIComponent(path)}`} prefetch={false}>Claim the listing</Link> to add your own photos.</>}</>
        : <>Photos are hosted by TreatmentLane and may have been supplied by the organization. Confirm that photos are current before making a decision.</>}</p>
    </section>}

    <div className={`shell provider-detail-grid${isVerified ? " is-verified" : ""}`}>
      <main className="provider-content">
        <div className={`notice${provider.verificationStatus === "provider-confirmed" ? " is-claimed" : ""}`}>{provider.verificationStatus === "provider-confirmed" ? <><strong>TreatmentLane Verified.</strong> This provider has claimed this listing and confirmed the details below directly with TreatmentLane.</> : provider.verificationStatus === "independently-reviewed" ? <><strong>Independently reviewed.</strong> Our team verified this listing&apos;s details against primary sources.</> : <><strong>{verificationLabels[provider.verificationStatus]}.</strong> Information below comes from public source data and has not necessarily been confirmed by the provider.</>} <Link href="/how-we-verify" prefetch={false}>Read our verification standards</Link>.</div>

        {provider.isSponsored && <div className="featured-profile-notice"><strong>Featured profile.</strong> This organization pays a flat monthly fee for enhanced placement, a longer profile, and photos. Payment does not affect its verification status.</div>}

        {hasMultipleLocations && <section className="listing-section provider-location-section">
          <span className="section-label">Multiple locations</span>
          <h2>{provider.name} has {organizationProviders.length.toLocaleString()} published locations</h2>
          <p>You are viewing the {provider.city}, {provider.state} location. Choose another location to compare its address, services, contact details, and verification information.</p>
          <div className="provider-location-grid">
            {organizationProviders.map((location) => {
              const isCurrent = location.id === provider.id;
              const label = `${location.city}, ${location.state}`;
              return isCurrent
                ? <div className="provider-location-link is-current" key={location.id}><MapPin size={18} /><span><strong>{label}</strong><small>Current location</small></span></div>
                : <Link className="provider-location-link" href={providerPath(location)} key={location.id} prefetch={false}><MapPin size={18} /><span><strong>{label}</strong><small>View location details</small></span></Link>;
            })}
          </div>
          <Link className="text-link provider-all-locations-link" href={`/providers/${provider.organizationSlug}`} prefetch={false}>View all {provider.name} locations</Link>
        </section>}

        <section className="listing-section">
          <span className="section-label">Overview</span><h2>About {provider.name}</h2>
          {hasTemplateDescription(provider) ? buildProviderSummary(provider).map((paragraph, index) => <p className={index === 0 ? "listing-lead" : "listing-summary"} key={index}>{paragraph}</p>) : <p className="listing-lead">{provider.description}</p>}
          {(provider.priceRange || provider.treatmentDuration || provider.sourceRatingValue !== null || careTypes.length > 0) && <div className="quick-facts">
            {careTypes.length > 0 && <div><Layers3 /><span>Primary type</span><strong>{careTypes[0]}</strong></div>}
            {provider.treatmentDuration && <div><Clock3 /><span>Typical duration</span><strong>{provider.treatmentDuration}</strong></div>}
            {provider.priceRange && <div><DollarSign /><span>Source price information</span><strong>{provider.priceRange}</strong></div>}
            {ratingValue !== null && ratingCount !== null && <div><Star /><span>{sourceName ? `${sourceName} source rating` : "Source rating"}</span><strong>{ratingValue.toFixed(1)} from {ratingCount.toLocaleString()} ratings</strong></div>}
          </div>}
        </section>

        <section className="listing-section">
          <span className="section-label">Care options</span><h2>Treatment types and levels of care</h2>
          {careTypes.length ? <InformationTags items={careTypes} /> : <p>No treatment types are listed in the available source data. Ask the organization which levels of care it currently provides.</p>}
        </section>

        <section className="listing-section">
          <span className="section-label">Clinical approaches</span><h2>Therapies and services</h2>
          {provider.therapies.length ? <InformationTags items={provider.therapies} /> : <p>No specific therapies are listed. Confirm the clinical team, treatment methods, and program schedule directly.</p>}
        </section>

        <section className="listing-section">
          <span className="section-label">Payment</span><h2>Accepted insurance and payment options</h2>
          {provider.insurance.length ? <InformationTags items={provider.insurance} /> : <p>No accepted insurance partners are named in the available source data.</p>}
          {provider.insuranceDetails && <p className="source-detail">Source information: {provider.insuranceDetails}</p>}
          {provider.priceRange && <p className="price-estimate"><DollarSign size={16} /> <strong>Estimated cost:</strong> {provider.priceRange} <span className="estimate-note">(estimate, verify directly)</span></p>}
          <p className="section-caution">Insurance participation changes. Verify network status, authorization requirements, and expected out-of-pocket cost with both the provider and insurer.</p>
        </section>

        <section className="listing-section">
          <span className="section-label">Environment</span><h2>Amenities and facility features</h2>
          {provider.amenities.length ? <InformationTags items={provider.amenities} /> : <p>No specific amenities are mentioned in the available source data. Ask about rooms, meals, accessibility, recreation, technology policies, and transportation.</p>}
        </section>

        {provider.specialties.length > 0 && <section className="listing-section">
          <span className="section-label">Program focus</span><h2>Specialties and populations served</h2><InformationTags items={provider.specialties} />
        </section>}

        <section className="listing-section">
          <span className="section-label">Safety checks</span><h2>Licensing and accreditation</h2>
          <p>{provider.licenseSummary || "Licensing details have not yet been independently summarized by TreatmentLane. Ask which state agency licenses this location and verify the license directly."}</p>
          {provider.accreditation.length > 0 && <InformationTags items={provider.accreditation} />}
        </section>

        <ProviderReviews providerId={provider.id} providerName={provider.name} />

        {faqs.length > 0 && <section className="listing-section">
          <span className="section-label">Questions</span><h2>Frequently asked questions about {provider.name}</h2>
          {faqs.map((faq) => <section key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></section>)}
        </section>}

        {nearbyProviders.length > 0 && <section className="listing-section">
          <span className="section-label">Nearby options</span><h2>Other providers near {provider.city}, {provider.state}</h2>
          <p>Compare other published providers in the same area. Confirm services, licensing, insurance, and availability directly with each provider.</p>
          <div className="provider-location-grid">
            {nearbyProviders.map((nearby) => {
              const primaryType = unique([...nearby.treatmentTypes, ...nearby.levelsOfCare, ...nearby.categories])[0];
              return <Link className="provider-location-link" href={providerPath(nearby)} key={nearby.id} prefetch={false}><MapPin size={18} /><span><strong>{nearby.name}</strong><small>{nearby.city}, {nearby.state}{primaryType ? ` - ${primaryType}` : ""}</small></span></Link>;
            })}
          </div>
        </section>}

        {(() => {
          const state = stateByCode(provider.state);
          if (!state) return null;
          const careLinks = cityCareTypes.filter((type) => isIndexedCityCarePage(state.code, provider.city, type.slug));
          return <section className="listing-section">
            <span className="section-label">Explore the area</span><h2>More treatment options in {provider.city}</h2>
            <div className="provider-location-grid">
              <Link className="provider-location-link" href={cityPath(state, provider.city)} prefetch={false}><MapPin size={18} /><span><strong>All treatment in {provider.city}</strong><small>Compare every listing in {provider.city}, {state.code}</small></span></Link>
              {careLinks.map((type) => <Link className="provider-location-link" href={cityCarePath(state, provider.city, type.slug)} key={type.slug} prefetch={false}><MapPin size={18} /><span><strong>{type.label} in {provider.city}</strong><small>Compare {type.short} listings in {provider.city}</small></span></Link>)}
              <Link className="provider-location-link" href={`/locations/${state.slug}`} prefetch={false}><MapPin size={18} /><span><strong>Treatment in {state.name}</strong><small>Cities, care types, and insurance across the state</small></span></Link>
            </div>
          </section>;
        })()}

        <section className="listing-section">
          <span className="section-label">Accuracy</span><h2>Sources and corrections</h2>
          <p>{provider.verificationStatus === "provider-confirmed" ? <>This listing has been claimed and its contact details were confirmed by {provider.name}. Provider? <Link href={`/providers/badge?listing=${encodeURIComponent(path)}`} prefetch={false}>Add the TreatmentLane Verified badge to your website</Link>.</> : <>Represent this organization? <Link href={`/providers/apply?provider=${encodeURIComponent(path)}`} prefetch={false}>Claim this listing</Link>.</>} See inaccurate information? <Link href={`/corrections?provider=${encodeURIComponent(path)}`} prefetch={false}>Request a correction</Link>. TreatmentLane keeps source-derived information clearly separated from provider-confirmed facts.</p>
        </section>
      </main>

      <aside className={`detail-sidebar provider-contact-card${provider.verificationStatus === "provider-confirmed" ? " is-claimed" : ""}`}>
        <h2>Contact information</h2><dl>
          <dt>Location</dt><dd>{provider.address && <>{provider.address}<br /></>}{provider.city}, {provider.state} {provider.postalCode}</dd>
          <dt>Map</dt><dd><TrackedContactLink href={mapUrl} rel="noopener noreferrer nofollow" target="_blank"><MapPinned size={15} /> View map and directions</TrackedContactLink></dd>
          {provider.phone && <><dt>Phone</dt><dd><TrackedContactLink href={`tel:${provider.phone}`}><Phone size={15} /> {provider.phone}</TrackedContactLink></dd></>}
          {provider.website && <><dt>Official website</dt><dd><TrackedContactLink href={provider.website} rel="noopener noreferrer nofollow" target="_blank">Visit website <ExternalLink size={14} /></TrackedContactLink></dd></>}
          {provider.sourceUrl && <><dt>Public source</dt><dd><a href={provider.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">View source record <ExternalLink size={14} /></a></dd></>}
          <dt>Listing status</dt><dd className="listing-status">{isVerified ? <VerifiedTick size={16} /> : <BadgeCheck size={15} />} {verificationLabels[provider.verificationStatus]}</dd>
          <dt>Last reviewed</dt><dd>{provider.lastVerifiedAt ? new Date(provider.lastVerifiedAt).toLocaleDateString("en-US", { dateStyle: "medium" }) : "Not independently reviewed"}</dd>
        </dl>
        {provider.phone && <TrackedContactLink className="button provider-call-button" href={`tel:${provider.phone}`}><Phone size={17} /> Call organization</TrackedContactLink>}
        {provider.verificationStatus !== "provider-confirmed" && <Link className="button button-secondary provider-claim-button" href={`/providers/apply?provider=${encodeURIComponent(path)}`} prefetch={false}><BadgeCheck size={17} /> Claim this listing</Link>}
        <p className="form-disclaimer">TreatmentLane does not recommend or guarantee any provider. In an emergency, call 911 or 988.</p>
      </aside>
    </div>
  </>;
}
