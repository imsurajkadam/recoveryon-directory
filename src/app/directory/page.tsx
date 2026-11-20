import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { ListingTrustNote } from "@/components/listing-trust-note";
import { Pagination } from "@/components/pagination";
import { ProviderCard } from "@/components/provider-card";
import { DirectoryFilterSubmit } from "@/components/directory-filter-submit";
import { VerifiedTick } from "@/components/verified-tick";
import { careCategories, states } from "@/lib/content";
import { getDirectoryFacets, searchProviders, type ProviderSort } from "@/lib/providers";

function single(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] || "" : value || ""; }

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const filtered = ["keyword", "location", "category", "state", "insurance", "level", "specialty", "verified", "sort", "page"].some((key) => Boolean(single(params[key])));
  return {
    title: "Recovery resource directory",
    description: "Search treatment, recovery, and mental health resource listings by service and location.",
    robots: { index: !filtered, follow: true },
    alternates: { canonical: "/directory" },
  };
}

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const keyword = single(params.keyword).trim();
  const location = single(params.location).trim();
  const category = single(params.category).trim();
  const state = single(params.state).trim().toUpperCase();
  const insurance = single(params.insurance).trim();
  const level = single(params.level).trim();
  const specialty = single(params.specialty).trim();
  const verified = single(params.verified) === "1";
  const requestedSort = single(params.sort);
  const sort: ProviderSort = ["recently-verified", "most-reviewed", "highest-rated", "alphabetical"].includes(requestedSort)
    ? requestedSort as ProviderSort : "recommended";
  const requestedPage = Math.max(Number.parseInt(single(params.page), 10) || 1, 1);
  const [result, facets] = await Promise.all([
    searchProviders({ keyword, location, category, state, insurance, level, specialty, verified, sort, page: requestedPage }),
    getDirectoryFacets(),
  ]);
  const filterValues = { keyword, location, category, state, insurance, level, specialty, verified: verified ? "1" : "", sort: sort === "recommended" ? "" : sort };
  const paginationParams = Object.fromEntries(Object.entries(filterValues).filter(([, value]) => value));
  const hrefWithout = (...keys: string[]) => {
    const search = new URLSearchParams(Object.entries(paginationParams).filter(([key]) => !keys.includes(key)));
    const query = search.toString();
    return query ? `/directory?${query}` : "/directory";
  };
  const stateName = states.find((item) => item.code === state)?.name || state;
  const sortLabels: Record<ProviderSort, string> = { recommended: "Recommended", "recently-verified": "Recently verified", "most-reviewed": "Most reviewed", "highest-rated": "Highest source rating", alphabetical: "Alphabetical" };
  const activeFilters = [
    keyword && { key: "keyword", label: `"${keyword}"` },
    location && { key: "location", label: `Near ${location}` },
    category && { key: "category", label: category },
    state && { key: "state", label: stateName },
    insurance && { key: "insurance", label: `Accepts ${insurance}` },
    level && { key: "level", label: level },
    specialty && { key: "specialty", label: specialty },
    verified && { key: "verified", label: "Verified only" },
  ].filter((item): item is { key: string; label: string } => Boolean(item));
  const moreCount = [insurance, level, specialty, sort !== "recommended" ? sort : ""].filter(Boolean).length;
  const verifiedToggleHref = verified ? hrefWithout("verified") : `/directory?${new URLSearchParams({ ...paginationParams, verified: "1" }).toString()}`;

  return (
    <>
      <section className="page-hero page-hero-compact"><div className="shell">
        <h1>Find treatment and recovery resources</h1>
        <p>Search {result.total ? `${result.total.toLocaleString("en-US")} ` : ""}listings by service, location, and insurance. Confirm licensing, availability, and cost directly with each provider.</p>
        <form className="filter-bar" method="get" action="/directory">
          {verified && <input type="hidden" name="verified" value="1" />}
          <div className="filter-bar-main">
            <label>Service or provider<input name="keyword" defaultValue={keyword} placeholder="Detox, IOP, provider name" /></label>
            <label>City or ZIP<input name="location" defaultValue={location} placeholder="City or ZIP" /></label>
            <label>Type of care<select name="category" defaultValue={category}><option value="">All care types</option>{careCategories.map((item) => <option key={item.slug} value={item.name}>{item.name}</option>)}</select></label>
            <label>State<select name="state" defaultValue={state}><option value="">All states</option>{states.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
            <DirectoryFilterSubmit label="Search" />
          </div>
          <details className="filter-more" open={moreCount > 0}>
            <summary><SlidersHorizontal size={16} aria-hidden="true" /> More filters: insurance, level of care, specialty, sort{moreCount > 0 ? <span className="filter-count">{moreCount}</span> : null}</summary>
            <div className="filter-more-grid">
              <label>Insurance or payment<select name="insurance" defaultValue={insurance}><option value="">All payment options</option>{facets.insurance.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label>Level of care<select name="level" defaultValue={level}><option value="">All levels</option>{facets.levels.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label>Specialty<select name="specialty" defaultValue={specialty}><option value="">All specialties</option>{facets.specialties.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label>Sort by<select name="sort" defaultValue={sort}>{(Object.keys(sortLabels) as ProviderSort[]).map((key) => <option key={key} value={key}>{sortLabels[key]}</option>)}</select></label>
              <DirectoryFilterSubmit />
            </div>
          </details>
        </form>
      </div></section>
      <section className="section section-listings" id="listings"><div className="shell">
        <div className="results-bar">
          <h2>{verified && <VerifiedTick size={22} className="verified-tick-inline" />}{result.total ? `${result.total.toLocaleString("en-US")} ${verified ? "TreatmentLane Verified " : ""}${result.total === 1 ? "listing" : "listings"}` : "No matching listings"}{sort !== "recommended" ? <small> sorted by {sortLabels[sort].toLowerCase()}</small> : null}</h2>
          <Link className={`verified-toggle${verified ? " is-on" : ""}`} href={verifiedToggleHref} prefetch={false} rel="nofollow" aria-current={verified ? "true" : undefined}><VerifiedTick size={16} /> Verified only</Link>
        </div>
        {activeFilters.length > 0 && <div className="active-filters" aria-label="Active filters">
          {activeFilters.map((item) => <Link key={item.key} href={hrefWithout(item.key)} prefetch={false} rel="nofollow" aria-label={`Remove filter: ${item.label}`}>{item.label} <X size={13} aria-hidden="true" /></Link>)}
          <Link className="clear-filters" href="/directory" prefetch={false}>Clear all</Link>
        </div>}
        <ListingTrustNote />
        {result.providers.length ? <><div className="provider-list">{result.providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div><Pagination pathname="/directory" params={paginationParams} page={result.page} totalPages={result.totalPages} /></> : <div className="empty-state"><SearchX size={36} /><h2>No matching listings</h2><p>Try removing a filter, or suggest an organization for review.</p><Link className="button" href="/providers/apply" prefetch={false}>Suggest an organization</Link></div>}
      </div></section>
    </>
  );
}
