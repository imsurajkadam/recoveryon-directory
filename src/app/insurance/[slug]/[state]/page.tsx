import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { careSearchFilter, cityCareTypes, cityPath, stateByCode, stateBySlug } from "@/lib/city-pages";
import { buildFaqPageJsonLd, type FaqEntry } from "@/lib/faq-schema";
import { insurers } from "@/lib/insurance-data";
import { medicaidState, medicaidStates } from "@/lib/medicaid-states";
import { fitSeoDescription, fitSeoTitle } from "@/lib/provider-seo";
import { getFilteredCityCounts, providerPath, searchProviders } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/** Insurer × state pages. Only Medicaid is published, for the 20 states in medicaidStates. */
function resolve(slug: string, stateSlug: string) {
  const insurer = insurers.find((item) => item.slug === slug);
  const state = stateBySlug(stateSlug);
  if (!insurer || !state || insurer.slug !== "medicaid") return null;
  const program = medicaidState(state.code);
  if (!program) return null;
  return { insurer, state, program: program.program };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; state: string }> }): Promise<Metadata> {
  const { slug, state: stateSlug } = await params;
  const resolved = resolve(slug, stateSlug);
  if (!resolved) return {};
  const { state, program } = resolved;
  const { total } = await searchProviders({ state: state.code, insurance: "Medicaid", pageSize: 1 });
  const programLabel = program.toLowerCase().includes("medicaid") ? "" : ` (${program})`;
  return {
    title: { absolute: fitSeoTitle(`${total.toLocaleString("en-US")} Rehabs That Accept Medicaid in ${state.name}${programLabel}`) },
    description: fitSeoDescription(`Compare ${total.toLocaleString("en-US")} addiction treatment and mental health listings in ${state.name} that report accepting Medicaid${programLabel}. See cities, care types, and how to confirm coverage.`),
    alternates: { canonical: `/insurance/medicaid/${state.slug}` },
    robots: { index: total >= 10, follow: true },
  };
}

export default async function StateMedicaidPage({ params, searchParams }: { params: Promise<{ slug: string; state: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug, state: stateSlug } = await params;
  const resolved = resolve(slug, stateSlug);
  if (!resolved) notFound();
  const { state, program } = resolved;
  const query = await searchParams;
  const page = Math.max(Number.parseInt(query.page || "1", 10) || 1, 1);
  const [result, stateTotal, cities, ...careTotals] = await Promise.all([
    searchProviders({ state: state.code, insurance: "Medicaid", page }),
    searchProviders({ state: state.code, pageSize: 1 }),
    getFilteredCityCounts({ state: state.code, insurance: "Medicaid" }, 12),
    ...cityCareTypes.map((type) => searchProviders({ state: state.code, insurance: "Medicaid", ...careSearchFilter(type), pageSize: 1 })),
  ]);
  if (!result.total) notFound();
  const total = result.total;
  const path = `/insurance/medicaid/${state.slug}`;
  const share = stateTotal.total ? Math.round((total / stateTotal.total) * 100) : 0;
  const careCounts = cityCareTypes.map((type, index) => ({ type, count: careTotals[index].total })).filter((entry) => entry.count > 0);
  const isCalifornia = state.code === "CA";

  const faqs: FaqEntry[] = [
    { question: `How many rehabs in ${state.name} accept Medicaid?`, answer: `TreatmentLane lists ${total.toLocaleString("en-US")} treatment and recovery listings in ${state.name} that report accepting Medicaid, about ${share}% of the ${stateTotal.total.toLocaleString("en-US")} listings in the state. Insurance participation changes, so confirm with the provider before you start.` },
    { question: `Does ${program} cover addiction treatment?`, answer: `Every state Medicaid program covers some substance use disorder treatment, but each state decides which levels of care are covered, which providers are in network, and when prior authorization is needed. Call the provider and your ${program} plan or managed care organization to confirm coverage for the specific program.` },
    { question: "Does Medicaid pay for sober living?", answer: "Usually not. Sober living homes are recovery housing rather than clinical treatment, so rent is normally paid by the resident. Some states and counties fund recovery housing through separate grants, so ask the house and your local behavioral health agency." },
    { question: "What should I ask a provider about Medicaid?", answer: `Ask whether they are in network with your specific ${program} plan, which services are covered, whether prior authorization is required, whether there is a waitlist, and what you would pay for anything Medicaid does not cover.` },
    ...(isCalifornia ? [{ question: "Is Medi-Cal the same as Medicaid?", answer: "Yes. Medi-Cal is California's Medicaid program. Some listings say Medi-Cal and others say Medicaid; both are shown on TreatmentLane's California pages." }] : []),
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Insurance", item: absoluteUrl("/insurance") },
      { "@type": "ListItem", position: 2, name: "Medicaid", item: absoluteUrl("/insurance/medicaid") },
      { "@type": "ListItem", position: 3, name: state.name, item: absoluteUrl(path) },
    ],
  };
  const itemListJsonLd = result.providers.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Rehabs that accept Medicaid in ${state.name}`,
    itemListElement: result.providers.map((provider, index) => ({ "@type": "ListItem", position: index + 1, name: provider.name, url: absoluteUrl(providerPath(provider)) })),
  } : null;

  return <>
    <JsonLd data={breadcrumbJsonLd} />
    {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
    <JsonLd data={buildFaqPageJsonLd(faqs)} />
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/insurance" prefetch={false}>Insurance</Link><span>/</span><Link href="/insurance/medicaid" prefetch={false}>Medicaid</Link><span>/</span><span>{state.name}</span></div>
      <h1>{total.toLocaleString("en-US")} Rehabs That Accept Medicaid in {state.name}</h1>
      <p>{total.toLocaleString("en-US")} of the {stateTotal.total.toLocaleString("en-US")} treatment and recovery listings in {state.name} report accepting Medicaid{program.toLowerCase().includes("medicaid") ? "" : `, known in ${state.name} as ${program}`}. Compare them by city and type of care, then confirm network status with the provider and your plan.</p>
      <div className="inline-actions"><a className="button" href="#listings">View {total.toLocaleString("en-US")} listings</a><Link className="button button-secondary" href={`/locations/${state.slug}`} prefetch={false}>All treatment in {state.name}</Link>{isCalifornia ? <Link className="button button-secondary" href="/insurance/medi-cal" prefetch={false}>Listings that say Medi-Cal</Link> : null}</div>
    </div></section>

    {careCounts.length ? <section className="section"><div className="shell">
      <div className="results-heading"><div><h2>Medicaid listings by type of care</h2><p>Counts of {state.name} listings that report accepting Medicaid.</p></div></div>
      <div className="provider-location-grid">{careCounts.map(({ type, count }) => <div className="provider-location-link" key={type.slug}><ArrowRight size={18} /><span><strong>{type.label}</strong><small>{count.toLocaleString("en-US")} accept Medicaid</small></span></div>)}</div>
    </div></section> : null}

    {cities.length ? <section className="section section-tint"><div className="shell">
      <div className="results-heading"><div><h2>Cities with the most Medicaid listings</h2></div></div>
      <div className="provider-location-grid">{cities.map((item) => <Link className="provider-location-link" href={cityPath(state, item.city)} key={item.city} prefetch={false}><MapPin size={18} /><span><strong>{item.city}</strong><small>{item.count.toLocaleString("en-US")} accept Medicaid</small></span></Link>)}</div>
    </div></section> : null}

    <section className="section" id="listings"><div className="shell">
      <div className="results-heading"><div><h2>Listings that accept Medicaid in {state.name}</h2><p>Insurance details come from source records and provider updates. Confirm before starting treatment.</p></div></div>
      <div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
      <Pagination pathname={path} page={result.page} totalPages={result.totalPages} />
    </div></section>

    <section className="section section-tint"><div className="shell">
      <div className="section-heading"><div><span className="kicker plain">Other states</span><h2>Medicaid rehab in other states</h2></div><Link className="text-link" href="/insurance/medicaid" prefetch={false}>All Medicaid listings <ArrowRight size={17} /></Link></div>
      <div className="state-grid">{medicaidStates.filter((item) => item.code !== state.code).map((item) => { const other = stateByCode(item.code); return other ? <Link key={item.code} href={`/insurance/medicaid/${other.slug}`} prefetch={false}><MapPin size={18} /><span>{other.name}</span><ArrowRight size={16} /></Link> : null; })}</div>
    </div></section>

    <FaqSection faqs={faqs} />
  </>;
}
