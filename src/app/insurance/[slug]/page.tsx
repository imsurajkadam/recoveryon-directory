import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { insurers } from "@/lib/insurance-data";
import { medicaidStates } from "@/lib/medicaid-states";
import { stateByCode } from "@/lib/city-pages";
import { searchProviders } from "@/lib/providers";
import { ProviderCard } from "@/components/provider-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insurer = insurers.find((i) => i.slug === slug);
  if (!insurer) return {};
  return {
    title: `Rehab centers that accept ${insurer.name}`,
    description: `Find addiction treatment centers that accept ${insurer.name} insurance. Compare verified listings, check coverage details, and verify your benefits.`,
    alternates: { canonical: `/insurance/${slug}` },
  };
}

export default async function InsurancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insurer = insurers.find((i) => i.slug === slug);
  if (!insurer) notFound();

  // Use the shared provider data layer. Its insurance filter matches the
  // insurer labels stored on each provider (for example "Aetna"), which is
  // the same matching the directory search uses.
  const { providers, total } = await searchProviders({ insurance: insurer.name, state: insurer.state, sort: "most-reviewed", pageSize: 24 });
  const otherInsurers = insurers.filter((i) => i.slug !== insurer.slug);

  return <>
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/insurance">Insurance</Link><span>/</span><span>{insurer.name}</span></div>
      <h1>Rehab centers that accept {insurer.name}</h1>
      <p>{insurer.description}</p>
      <div className="notice">Insurance participation changes frequently. Always verify in-network status, authorization requirements, and your expected out-of-pocket cost with both the provider and {insurer.name} before committing.</div>
    </div></section>
    <section className="section"><div className="shell">
      {providers.length ? <>
        <h2>{total.toLocaleString("en-US")} listings accepting {insurer.name}</h2>
        <div className="provider-list">{providers.map((p) => <ProviderCard key={p.id} provider={p} />)}</div>
        {total > providers.length && <p style={{ marginTop: 24 }}><Link className="text-link" href={`/directory?insurance=${encodeURIComponent(insurer.name)}${insurer.state ? `&state=${insurer.state}` : ""}`}>View all {total.toLocaleString("en-US")} listings in the directory <ArrowRight size={17} /></Link></p>}
      </> : <div className="empty-state"><h2>No listings found</h2><p>We have not yet tagged providers accepting {insurer.name}. <Link href="/directory">Browse all listings</Link> or <Link href="/insurance">compare other insurance options</Link>.</p></div>}
    </div></section>
    {insurer.slug === "medicaid" ? <section className="section"><div className="shell">
      <div className="section-heading"><div><span className="kicker plain">By state</span><h2>Rehabs that accept Medicaid, by state</h2><p>Each state runs its own Medicaid program, so covered services and how to start treatment differ.</p></div></div>
      <div className="state-grid">{medicaidStates.map((item) => { const state = stateByCode(item.code); return state ? <Link key={item.code} href={`/insurance/medicaid/${state.slug}`} prefetch={false}><ShieldCheck size={18} /><span>{state.name}</span><ArrowRight size={16} /></Link> : null; })}</div>
    </div></section> : null}
    <section className="section section-tint"><div className="shell">
      <div className="section-heading"><div><span className="kicker plain">Insurance</span><h2>Other insurance options</h2></div><Link className="text-link" href="/insurance" prefetch={false}>All insurance options <ArrowRight size={17} /></Link></div>
      <div className="state-grid">{otherInsurers.map((other) => <Link key={other.slug} href={`/insurance/${other.slug}`} prefetch={false}><ShieldCheck size={18} /><span>{other.name}</span><ArrowRight size={16} /></Link>)}</div>
    </div></section>
  </>;
}
