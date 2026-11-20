import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { BarList, IllustratedHero, StateTileMap } from "@/components/illustrations";
import { states } from "@/lib/content";
import { getDirectoryOverview } from "@/lib/providers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Recovery resources by state",
  description: "Browse addiction treatment, recovery, and mental health resources by U.S. state.",
  alternates: { canonical: "/locations" },
};

// Published provider counts by city and state from the production database, November 2026.
const topCities = [
  { name: "Los Angeles", state: "CA", count: 563 },
  { name: "New York City", state: "NY", count: 352 },
  { name: "Chicago", state: "IL", count: 313 },
  { name: "Baltimore", state: "MD", count: 230 },
  { name: "Minneapolis", state: "MN", count: 203 },
  { name: "Phoenix", state: "AZ", count: 202 },
  { name: "Philadelphia", state: "PA", count: 196 },
  { name: "Houston", state: "TX", count: 187 },
  { name: "San Diego", state: "CA", count: 186 },
  { name: "Denver", state: "CO", count: 164 },
];

export default async function LocationsPage() {
  const overview = await getDirectoryOverview();
  const stateCounts = states.map((state) => ({ ...state, count: overview.byState[state.code] || 0 }));
  const topStates = [...stateCounts].sort((a, b) => b.count - a.count).slice(0, 8);
  return <>
    <IllustratedHero kind="locations" kicker="Locations" title="Browse recovery resources by state">
      <p>Choose a state to see published treatment and recovery listings, then narrow by city, level of care, or insurance.</p>
      {overview.total > 0 && <ul className="stat-chips"><li><strong>{overview.total.toLocaleString("en-US")}</strong> listings</li><li><strong>{stateCounts.filter((state) => state.count > 0).length}</strong> states and territories</li><li><strong>{overview.cities.toLocaleString("en-US")}</strong> cities</li></ul>}
    </IllustratedHero>

    <section className="section section-snug"><div className="shell">
      <div className="section-heading"><div><h2>Listings by state</h2><p>Darker tiles have more published listings. Select a state to open its page.</p></div></div>
      <StateTileMap states={stateCounts} />
    </div></section>

    {overview.total > 0 && <section className="section section-snug section-tint"><div className="shell">
      <div className="section-heading"><div><h2>States with the most listings</h2><p>A larger count usually means more choice in levels of care and insurance accepted.</p></div></div>
      <BarList items={topStates.map((state) => ({ label: state.name, count: state.count, href: `/locations/${state.slug}` }))} />
    </div></section>}

    <section className="section section-snug"><div className="shell">
      <div className="section-heading"><div><h2>Cities with the most listings</h2><p>Providers cluster in cities. A nearby program with the right level of care often beats a distant one with a longer list.</p></div></div>
      <BarList items={topCities.map((city) => ({ label: `${city.name}, ${city.state}`, count: city.count, href: `/directory?location=${encodeURIComponent(city.name)}&state=${city.state}` }))} />
    </div></section>

    <section className="section section-snug section-tint"><div className="shell">
      <div className="section-heading"><div><h2>All states</h2></div></div>
      <div className="all-states">{stateCounts.map((state) => <Link key={state.code} href={`/locations/${state.slug}`} prefetch={false}><MapPin size={14} aria-hidden="true" /> {state.name}{state.count ? <small> {state.count.toLocaleString("en-US")}</small> : null}</Link>)}</div>
    </div></section>

    <article className="content-shell prose">
    <h2>Finding treatment by state</h2>
    <p>Addiction treatment looks different in every state. Licensing rules, the mix of residential and outpatient programs, and which insurance plans providers accept all vary by location, so starting with your state narrows a national directory down to options that are realistic to reach. Each state page on TreatmentLane lists providers in that state, so you can compare programs near home or near family support. If you are open to traveling for care, browsing a neighboring state can widen the choice, but most people start where they live.</p>
    <p>Treatment is not one kind of program. The directory covers medical detox, residential and inpatient treatment, outpatient programs, intensive outpatient programs, partial hospitalization, sober living, telehealth, and counseling, and state pages show how many providers in that state offer each level of care. Detox manages withdrawal under clinical supervision. Residential programs provide structured, live-in support. Outpatient and intensive outpatient programs let a person continue living at home while attending treatment on a schedule. Sober living offers a structured residence between formal treatment and independent living. Knowing which level fits is a clinical question, and the care guides on this site explain each option before you compare providers.</p>
    <p>Some states have far more listed providers than others. California lists 3,825 providers, the most of any state, followed by New York with 1,790, Florida with 1,510, Pennsylvania with 1,457, and Ohio with 1,405. A larger count usually means more choice in levels of care and in insurance accepted, including Medicaid and Medicare, but it does not mean every program is a good fit. Smaller states can still have strong options, especially for a specific kind of care, so use the state page to judge what is available rather than the total count alone.</p>
    <p>Within states, providers cluster in cities. Los Angeles has the most listings of any city in the directory, with 563, followed by New York City with 352, Chicago with 313, Baltimore with 230, and Minneapolis with 203. Phoenix, Philadelphia, Houston, San Diego, and Denver each have more than 160. A city with many providers can make it easier to compare programs side by side and to find one that accepts your insurance, but a nearby program with the right level of care is often a better choice than a distant one with a longer list.</p>
    <p>Use each listing to check the basics before you call: the level of care, the services offered, the address, and whether the provider reports accepting Medicaid or Medicare. Then confirm licensing, availability, cost, and insurance directly with the provider, because directory information can change. TreatmentLane is a free directory, not a treatment provider, and it does not make referrals or admissions decisions. If someone is in immediate danger, call 911. For crisis support, call or text 988, or see our <Link href="/emergency-help" prefetch={false}>emergency help page</Link>.</p>
    </article>
  </>;
}
