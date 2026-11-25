import { NextResponse } from "next/server";
import { isContentApiAuthorized } from "@/lib/articles";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";

// Gives the article pipeline real TreatmentLane numbers to quote, so each article carries data
// competitors can't copy. Filters are optional and match the exact labels stored on listings:
//   insurance = "Medicaid", "Medicare", "TRICARE", "Aetna", ...
//   category  = "Medical Detox", "Sober Living", "Outpatient Programs", ...
//   level     = "Intensive outpatient program (IOP)", "Residential treatment", ...
//   state     = two-letter code, e.g. "CA"
export async function GET(request: Request) {
  if (!isContentApiAuthorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const clean = (value: string | null, max = 80) => (value || "").trim().slice(0, max);
  const insurance = clean(url.searchParams.get("insurance"));
  const category = clean(url.searchParams.get("category"));
  const level = clean(url.searchParams.get("level"));
  const stateParam = clean(url.searchParams.get("state"), 2).toUpperCase();
  const state = /^[A-Z]{2}$/.test(stateParam) ? stateParam : "";

  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database unavailable" }, { status: 503 });

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
  const alsoAccepts = await sql`select i as insurance, count(*)::int as listings
    from providers, unnest(insurance) i where ${where} group by i order by listings desc limit 8`;
  const levels = await sql`select l as level, count(*)::int as listings
    from providers, unnest(levels_of_care) l where ${where} group by l order by listings desc limit 8`;

  return NextResponse.json({
    as_of: new Date().toISOString().slice(0, 10),
    filters: { insurance: insurance || null, category: category || null, level: level || null, state: state || null },
    totals,
    top_states: topStates,
    top_cities: topCities,
    payment_options: alsoAccepts,
    levels_of_care: levels,
    note: "Counts of published TreatmentLane listings. Listings are self-reported or taken from public sources; describe them as TreatmentLane listings, not as all providers in the area.",
  }, { headers: { "Cache-Control": "no-store" } });
}
