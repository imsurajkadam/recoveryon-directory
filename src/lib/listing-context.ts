import "server-only";

import { getDatabase } from "@/lib/db";

// Live counts of published TreatmentLane listings, used to give articles data competitors can't copy.
// Filters match the exact labels stored on listings (insurance, categories, levels_of_care) and a
// two-letter state code.
export type ListingContextFilters = { insurance?: string; category?: string; level?: string; state?: string };

export async function getListingContext(filters: ListingContextFilters) {
  const sql = getDatabase();
  if (!sql) return null;
  const clean = (value: string | undefined, max = 80) => (value || "").trim().slice(0, max);
  const insurance = clean(filters.insurance);
  const category = clean(filters.category);
  const level = clean(filters.level);
  const stateParam = clean(filters.state, 2).toUpperCase();
  const state = /^[A-Z]{2}$/.test(stateParam) ? stateParam : "";

  const where = sql`publication_status = 'published'
    ${insurance ? sql`and ${insurance} = any(insurance)` : sql``}
    ${category ? sql`and ${category} = any(categories)` : sql``}
    ${level ? sql`and ${level} = any(levels_of_care)` : sql``}
    ${state ? sql`and state = ${state}` : sql``}`;

  const [totals] = await sql`select
      (select count(*)::int from providers where publication_status = 'published') as all_listings,
      count(*)::int as matching_listings,
      count(*) filter (where verification_status = 'provider-confirmed')::int as verified_listings,
      count(distinct state)::int as states,
      count(distinct (state, city))::int as cities
    from providers where ${where}`;
  const topStates = await sql`select state, count(*)::int as listings from providers where ${where}
    group by state order by listings desc limit 10`;
  const topCities = await sql`select city, state, count(*)::int as listings from providers where ${where}
    group by city, state order by listings desc limit 10`;
  const paymentOptions = await sql`select i as insurance, count(*)::int as listings
    from providers, unnest(insurance) i where ${where} group by i order by listings desc limit 8`;
  const levels = await sql`select l as level, count(*)::int as listings
    from providers, unnest(levels_of_care) l where ${where} group by l order by listings desc limit 8`;

  return {
    as_of: new Date().toISOString().slice(0, 10),
    filters: { insurance: insurance || null, category: category || null, level: level || null, state: state || null },
    totals,
    top_states: topStates,
    top_cities: topCities,
    payment_options: paymentOptions,
    levels_of_care: levels,
    note: "Counts of published TreatmentLane listings. Listings are self-reported or taken from public sources; describe them as TreatmentLane listings, not as all providers in the area.",
  };
}
