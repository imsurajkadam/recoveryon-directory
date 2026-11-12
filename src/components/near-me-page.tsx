import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { NearMeLocal } from "@/components/near-me-local";
import { ProviderCard } from "@/components/provider-card";
import { CITY_CARE_MIN_LISTINGS, careSearchFilter, careTypeBySlug, cityCarePath, cityCareTypes, stateByCode } from "@/lib/city-pages";
import { buildFaqPageJsonLd, type FaqEntry } from "@/lib/faq-schema";
import { nearMePages } from "@/lib/near-me";
import { fitSeoDescription, fitSeoTitle } from "@/lib/provider-seo";
import { getFilteredCityCounts, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

function config(careSlug: string) {
  const page = nearMePages.find((item) => item.careSlug === careSlug);
  const type = careTypeBySlug(careSlug);
  if (!page || !type) throw new Error(`Unknown near-me care type: ${careSlug}`);
  return { page, type };
}

export async function nearMeMetadata(careSlug: string): Promise<Metadata> {
  const { page, type } = config(careSlug);
  const { total } = await searchProviders({ ...careSearchFilter(type), pageSize: 1 });
  return {
    title: { absolute: fitSeoTitle(`${page.title}: Compare ${total.toLocaleString("en-US")} Listings`) },
    description: fitSeoDescription(`Find ${type.short} near you. Compare ${total.toLocaleString("en-US")} ${type.label.toLowerCase()} across the US by city, insurance, and services, with TreatmentLane Verified listings first.`),
    alternates: { canonical: page.path },
  };
}

export async function NearMePage({ careSlug }: { careSlug: string }) {
  const { page, type } = config(careSlug);
  const filter = careSearchFilter(type);
  const [national, verified, medicaid, cities] = await Promise.all([
    searchProviders({ ...filter, pageSize: 1 }),
    searchProviders({ ...filter, verified: true, pageSize: 6 }),
    searchProviders({ ...filter, insurance: "Medicaid", pageSize: 1 }),
    getFilteredCityCounts(filter, 30),
  ]);
  const cityLinks = cities.flatMap((item) => {
    const state = stateByCode(item.state);
    return state && item.count >= CITY_CARE_MIN_LISTINGS ? [{ ...item, state, url: cityCarePath(state, item.city, type.slug) }] : [];
  });
  const otherPages = nearMePages.filter((item) => item.careSlug !== careSlug);
  const faqs: FaqEntry[] = [
    { question: `How do I find ${type.short} near me?`, answer: `This page uses your approximate location to show nearby ${type.short} listings. You can also pick a city below or search the TreatmentLane directory by city or ZIP code. TreatmentLane lists ${national.total.toLocaleString("en-US")} ${type.label.toLowerCase()} across the US${medicaid.total ? `, ${medicaid.total.toLocaleString("en-US")} of which report accepting Medicaid` : ""}.` },
    ...type.questions,
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: page.title, item: absoluteUrl(page.path) },
    ],
  };

  return <>
    <JsonLd data={breadcrumbJsonLd} />
    <JsonLd data={buildFaqPageJsonLd(faqs)} />
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/" prefetch={false}>Home</Link><span>/</span><span>{page.title}</span></div>
      <h1>{page.title}</h1>
      <p>{type.intro} TreatmentLane lists {national.total.toLocaleString("en-US")} {type.label.toLowerCase()} across the US. We show the ones closest to you first; confirm services, cost, and availability directly with each provider.</p>
    </div></section>

    <section className="section"><div className="shell">
      <NearMeLocal care={type.slug} label={type.label} />
    </div></section>

    {cityLinks.length ? <section className="section section-tint"><div className="shell">
      <div className="results-heading"><div><h2>{type.label} by city</h2><p>Cities with the most {type.short} listings on TreatmentLane.</p></div></div>
      <div className="provider-location-grid">{cityLinks.map((item) => <Link className="provider-location-link" href={item.url} key={`${item.state.code}-${item.city}`} prefetch={false}><MapPin size={18} /><span><strong>{item.city}, {item.state.code}</strong><small>{item.count.toLocaleString("en-US")} listings</small></span></Link>)}</div>
    </div></section> : null}

    {verified.providers.length ? <section className="section"><div className="shell">
      <div className="results-heading"><div><h2>TreatmentLane Verified {type.short} listings</h2><p>These providers claimed their listing and confirmed their details with TreatmentLane.</p></div></div>
      <div className="provider-list">{verified.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
    </div></section> : null}

    <section className="section section-tint"><div className="shell">
      <div className="section-heading"><div><span className="kicker plain">Other care near you</span><h2>Looking for something else?</h2></div><Link className="text-link" href="/care" prefetch={false}>All types of care <ArrowRight size={17} /></Link></div>
      <div className="provider-location-grid">{otherPages.map((item) => <Link className="provider-location-link" href={item.path} key={item.path} prefetch={false}><ArrowRight size={18} /><span><strong>{item.title}</strong><small>{cityCareTypes.find((t) => t.slug === item.careSlug)?.short} listings near you</small></span></Link>)}</div>
    </div></section>

    <FaqSection faqs={faqs} />
  </>;
}
