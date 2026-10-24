import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, Building2, Check, ClipboardCheck, HeartHandshake, MapPinned, PhoneCall, SearchCheck, ShieldCheck } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { careCategories, featuredStateCodes, guides, states } from "@/lib/content";

const categoryIcons = [Building2, ShieldCheck, HeartHandshake, BookOpenCheck, MapPinned, SearchCheck, ClipboardCheck, BadgeCheck];

export default function Home() {
  const featuredStates = states.filter((state) => featuredStateCodes.includes(state.code));
  return (
    <>
      <section className="hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="shell hero-inner">
          <span className="kicker"><ShieldCheck size={16} /> Clear information. Better questions. Safer decisions.</span>
          <h1>Find recovery support with more confidence.</h1>
          <p className="hero-copy">Search treatment, detox, therapy, sober living, and recovery resources. See how each listing was reviewed.</p>
          <SearchForm />
          <div className="popular-links"><span>Explore:</span>{careCategories.slice(0, 5).map((category) => <Link key={category.slug} href={`/care/${category.slug}`} prefetch={false}>{category.shortName}</Link>)}</div>
        </div>
      </section>

      <section className="trust-strip" aria-label="TreatmentLane principles">
        <div className="shell trust-grid">
          <div><BadgeCheck /><span><strong>Transparent labels</strong><small>See how a listing was reviewed</small></span></div>
          <div><ClipboardCheck /><span><strong>Practical details</strong><small>Compare services and contact information</small></span></div>
          <div><ShieldCheck /><span><strong>No guarantees</strong><small>Confirm clinical and financial details directly</small></span></div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading"><div><span className="kicker plain">Types of support</span><h2>Start with the care you are looking for</h2><p>Understand the main options, then compare organizations that fit your location and needs.</p></div><Link className="text-link" href="/care" prefetch={false}>View all care types <ArrowRight size={17} /></Link></div>
          <div className="category-grid">
            {careCategories.map((category, index) => {
              const Icon = categoryIcons[index];
              return <Link className="category-card" key={category.slug} href={`/care/${category.slug}`} prefetch={false}><span className="category-icon"><Icon /></span><h3>{category.name}</h3><p>{category.description}</p><span className="card-link">Explore <ArrowRight size={16} /></span></Link>;
            })}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell split-layout">
          <div>
            <span className="kicker plain">A clearer process</span>
            <h2>Know what to check before you call</h2>
            <p className="lead">Treatment decisions can feel urgent. TreatmentLane is designed to slow down the confusion, not the help.</p>
            <ul className="check-list">
              <li><Check /> Understand the level of care and who provides it</li>
              <li><Check /> Confirm licensing, accreditation, and credentials</li>
              <li><Check /> Ask for written insurance and cost information</li>
              <li><Check /> See when important listing details were last reviewed</li>
            </ul>
            <Link className="button button-secondary" href="/how-we-verify" prefetch={false}>How our verification works</Link>
          </div>
          <div className="steps-card">
            <div><span>1</span><h3>Search</h3><p>Choose a service and location.</p></div>
            <div><span>2</span><h3>Review</h3><p>Compare details, sources, and verification labels.</p></div>
            <div><span>3</span><h3>Confirm</h3><p>Contact providers and insurers directly before deciding.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading"><div><span className="kicker plain">Browse by location</span><h2>Explore recovery resources by state</h2><p>We only index location pages when they contain useful, reviewed listings.</p></div><Link className="text-link" href="/locations" prefetch={false}>All locations <ArrowRight size={17} /></Link></div>
          <div className="state-grid">{featuredStates.map((state) => <Link key={state.code} href={`/locations/${state.slug}`} prefetch={false}><MapPinned size={18} /><span>{state.name}</span><ArrowRight size={16} /></Link>)}</div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell crisis-grid">
          <div><span className="kicker kicker-light">Need help now?</span><h2>For an immediate crisis, use a crisis service, not a directory.</h2><p>Call or text 988 in the United States for the Suicide & Crisis Lifeline. If there is immediate danger, call 911.</p></div>
          <div className="crisis-actions"><a className="button button-light" href="tel:988"><PhoneCall size={18} /> Call 988</a><Link className="button button-outline-light" href="/emergency-help" prefetch={false}>More help options</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading"><div><span className="kicker plain">Decision guides</span><h2>Useful questions before choosing care</h2><p>Plain-language guidance with links to authoritative resources.</p></div><Link className="text-link" href="/guides" prefetch={false}>View all guides <ArrowRight size={17} /></Link></div>
          <div className="guide-grid">{guides.map((guide) => <article className="guide-card" key={guide.slug}><span>Reviewed guidance</span><h3><Link href={`/guides/${guide.slug}`} prefetch={false}>{guide.title}</Link></h3><p>{guide.description}</p><Link className="card-link" href={`/guides/${guide.slug}`} prefetch={false}>Read guide <ArrowRight size={16} /></Link></article>)}</div>
        </div>
      </section>

      <section className="section provider-cta">
        <div className="shell provider-cta-inner"><div><span className="kicker plain">For providers</span><h2>Represent a treatment or recovery organization?</h2><p>Submit a new listing, claim an existing one, or send a correction. Publication is reviewed and never automatic.</p></div><Link className="button" href="/providers/apply" prefetch={false}>Submit your organization <ArrowRight size={17} /></Link></div>
      </section>
    </>
  );
}
