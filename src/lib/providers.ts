import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getDatabase } from "@/lib/db";
import { assessProviderIndexing, isProviderIndexable, type IndexingSignals } from "@/lib/indexing-policy";
import { inferredCity } from "@/lib/places";
import { fixIndefiniteArticles } from "@/lib/provider-display";
import { addressSearchToken, chooseCanonicalProvider, clusterDuplicates, type DuplicateCandidate } from "@/lib/provider-duplicates";
import { providerPath } from "@/lib/provider-path";
import { chunkByLimits, sitemapEntryBytes, sitemapSegmentId } from "@/lib/sitemap-split";
import { absoluteUrl, brandImageUrl } from "@/lib/site";
import type { Provider } from "@/lib/types";

export { providerPath };

type ProviderRow = {
  id: string; name: string; slug: string; organization_slug: string; location_slug: string;
  description: string | null; address: string | null;
  city: string; state: string; postal_code: string | null; phone: string | null; website: string | null;
  categories: string[] | null; levels_of_care: string[] | null; insurance: string[] | null;
  insurance_details: string | null; treatment_types: string[] | null; therapies: string[] | null;
  amenities: string[] | null; specialties: string[] | null; featured_image_url: string | null; image_urls: string[] | null;
  price_range: string | null; treatment_duration: string | null; source_rating_value: number | string | null; source_rating_count: number | null;
  license_summary: string | null; accreditation: string[] | null; last_verified_at: string | null;
  source_url: string | null; updated_at: string; evidence_score: number;
  verification_status: Provider["verificationStatus"]; is_sponsored: boolean;
  organization_location_count: number | string;
};

const providerColumns = `id, name, slug, organization_slug, location_slug, description, address, city, state, postal_code, phone, website,
  categories, levels_of_care, insurance, license_summary, accreditation, last_verified_at,
  verification_status, is_sponsored, source_url, updated_at, featured_image_url, image_urls, treatment_types,
  therapies, amenities, specialties, insurance_details, price_range, treatment_duration, source_rating_value, source_rating_count,
  evidence_score,
  (select count(*) from providers organization_locations
    where organization_locations.organization_slug = providers.organization_slug
      and organization_locations.publication_status = 'published')::int as organization_location_count`;

const listingPlaceholderPath = "/images/treatmentlane-listing-placeholder.webp";
const listingPlaceholderUrl = brandImageUrl("treatmentlane-listing-placeholder.webp");

function normalizeProviderImageUrl(value: string | null) {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if ((url.hostname === "treatmentlane.com" || url.hostname === "www.treatmentlane.com") && url.pathname === listingPlaceholderPath) {
      return listingPlaceholderUrl;
    }
    if (url.hostname === "images.treatmentlane.com") return url.toString();
  } catch {
    return null;
  }
  return null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeStreetAddress(address: string | null, city: string, state: string, postalCode: string | null) {
  if (!address) return null;
  let value = address.trim().replace(/,?\s*(?:United States|USA)\s*$/i, "").trim();
  const locationParts = [city, state, postalCode].filter(Boolean).map((part) => escapeRegExp(String(part)));
  if (locationParts.length >= 2) {
    const suffix = new RegExp(`,?\\s*${locationParts.join("(?:,|\\s)+")}\\s*$`, "i");
    value = value.replace(suffix, "").replace(/,\s*$/, "").trim();
  }
  return value || null;
}

function cleanSourceDetail(value: string | null) {
  if (!value) return null;
  const copiedCallToAction = /\b(fill out|submit (?:the|our)|contact us|call us|reach out|our admissions|our secure form|we will|we'll|your information is private)\b/i;
  return copiedCallToAction.test(value) ? null : value;
}

function toProvider(row: ProviderRow): Provider {
  return {
    id: row.id, name: row.name, slug: row.slug, organizationSlug: row.organization_slug, locationSlug: row.location_slug,
    organizationLocationCount: Number(row.organization_location_count || 1),
    description: row.description ? fixIndefiniteArticles(row.description) : null, address: normalizeStreetAddress(row.address, row.city, row.state, row.postal_code),
    city: row.city, state: row.state, postalCode: row.postal_code, phone: row.phone, website: row.website,
    categories: row.categories || [], levelsOfCare: row.levels_of_care || [], insurance: row.insurance || [],
    insuranceDetails: cleanSourceDetail(row.insurance_details), treatmentTypes: row.treatment_types || [], therapies: row.therapies || [],
    amenities: row.amenities || [], specialties: row.specialties || [], featuredImageUrl: normalizeProviderImageUrl(row.featured_image_url),
    imageUrls: (row.image_urls || []).map((image) => normalizeProviderImageUrl(image)).filter((image): image is string => Boolean(image)), priceRange: row.price_range, treatmentDuration: row.treatment_duration,
    sourceRatingValue: row.source_rating_value === null ? null : Number(row.source_rating_value), sourceRatingCount: row.source_rating_count,
    licenseSummary: row.license_summary, accreditation: row.accreditation || [], sourceUrl: row.source_url, lastVerifiedAt: row.last_verified_at,
    updatedAt: row.updated_at, evidenceScore: row.evidence_score, verificationStatus: row.verification_status,
    isSponsored: row.is_sponsored,
  };
}

export type ProviderSort = "recommended" | "recently-verified" | "most-reviewed" | "highest-rated" | "alphabetical";

export type ProviderSearch = {
  keyword?: string; location?: string; category?: string; state?: string; cities?: string[]; insurance?: string; level?: string; specialty?: string;
  sort?: ProviderSort; page?: number; pageSize?: number;
};
export type ProviderSearchResult = { providers: Provider[]; total: number; page: number; totalPages: number; outOfRange: boolean };

const orderBy: Record<ProviderSort, string> = {
  recommended: `is_sponsored desc,
    (evidence_score + case verification_status
      when 'independently-reviewed' then 20
      when 'provider-confirmed' then 15
      when 'data-verified' then 10
      else 0 end) desc,
    case
      when source_rating_value between 0 and 5 and source_rating_count > 0 then
        (source_rating_count::numeric / (source_rating_count + 25)) * source_rating_value
        + (25::numeric / (source_rating_count + 25)) * 4.0
      else 0 end desc,
    source_rating_count desc nulls last, name, city, id`,
  "recently-verified": "is_sponsored desc, last_verified_at desc nulls last, evidence_score desc, name, city, id",
  "most-reviewed": "is_sponsored desc, source_rating_count desc nulls last, source_rating_value desc nulls last, evidence_score desc, name, city, id",
  "highest-rated": "is_sponsored desc, source_rating_value desc nulls last, source_rating_count desc nulls last, evidence_score desc, name, city, id",
  alphabetical: "is_sponsored desc, name, city, id",
};

function normalizeSearch(input: ProviderSearch): Required<Omit<ProviderSearch, "cities">> & { cities: string[] } {
  const sort = input.sort && input.sort in orderBy ? input.sort : "recommended";
  return {
    keyword: input.keyword?.trim() || "",
    location: input.location?.trim() || "",
    category: input.category?.trim() || "",
    state: input.state?.trim().toUpperCase() || "",
    cities: [...new Set((input.cities || []).map((city) => city.trim()).filter(Boolean))],
    insurance: input.insurance?.trim() || "",
    level: input.level?.trim() || "",
    specialty: input.specialty?.trim() || "",
    sort,
    page: Math.max(input.page || 1, 1),
    pageSize: Math.min(Math.max(input.pageSize || 24, 1), 100),
  };
}

async function searchProvidersUncached(input: ProviderSearch): Promise<ProviderSearchResult> {
  const sql = getDatabase();
  const normalized = normalizeSearch(input);
  const empty = { providers: [] as Provider[], total: 0, page: normalized.page, totalPages: 0, outOfRange: normalized.page > 1 };
  if (!sql) return empty;
  const clauses = ["publication_status = 'published'"];
  const params: (string | number | string[])[] = [];
  const add = (value: string | number | string[]) => { params.push(value); return `$${params.length}`; };
  if (normalized.keyword) {
    const term = add(`%${normalized.keyword}%`);
    clauses.push(`(name ilike ${term} or description ilike ${term} or array_to_string(categories, ' ') ilike ${term} or array_to_string(levels_of_care, ' ') ilike ${term} or array_to_string(treatment_types, ' ') ilike ${term} or array_to_string(therapies, ' ') ilike ${term} or array_to_string(specialties, ' ') ilike ${term})`);
  }
  if (normalized.location) {
    const term = add(`%${normalized.location}%`);
    clauses.push(`concat_ws(' ', address, city, state, postal_code) ilike ${term}`);
  }
  if (normalized.category) clauses.push(`${add(normalized.category)} = any(categories)`);
  if (normalized.state) clauses.push(`state = ${add(normalized.state)}`);
  if (normalized.cities.length) clauses.push(`city in (${normalized.cities.map((city) => add(city)).join(", ")})`);
  if (normalized.insurance) clauses.push(`${add(normalized.insurance)} = any(insurance)`);
  if (normalized.level) {
    const level = add(normalized.level);
    clauses.push(`(${level} = any(levels_of_care) or ${level} = any(treatment_types))`);
  }
  if (normalized.specialty) clauses.push(`${add(normalized.specialty)} = any(specialties)`);
  const where = clauses.join(" and ");
  try {
    const countRows = await sql.unsafe(`select count(*)::int as count from providers where ${where}`, params);
    const total = Number(countRows[0]?.count || 0);
    const totalPages = total ? Math.ceil(total / normalized.pageSize) : 0;
    const outOfRange = totalPages === 0 ? normalized.page > 1 : normalized.page > totalPages;
    if (outOfRange) return { providers: [], total, page: normalized.page, totalPages, outOfRange: true };
    const idRows = await sql.unsafe(
      `select id from providers where ${where} order by ${orderBy[normalized.sort]} limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, normalized.pageSize, (normalized.page - 1) * normalized.pageSize],
    );
    const ids = (idRows as unknown as Array<{ id: string }>).map((row) => row.id);
    if (!ids.length) return { providers: [], total, page: normalized.page, totalPages, outOfRange: false };
    const idPlaceholders = ids.map((_, index) => `$${index + 1}`).join(", ");
    const rows = await sql.unsafe(`select ${providerColumns} from providers where id in (${idPlaceholders})`, ids);
    const byId = new Map((rows as unknown as ProviderRow[]).map((row) => [row.id, row]));
    const providers = ids.map((id) => byId.get(id)).filter((row): row is ProviderRow => Boolean(row)).map(toProvider);
    return { providers, total, page: normalized.page, totalPages, outOfRange: false };
  } catch (error) {
    console.error("Provider search failed", error);
    throw error;
  }
}

const searchProvidersCached = unstable_cache(
  async (serialized: string) => searchProvidersUncached(JSON.parse(serialized) as ProviderSearch),
  ["provider-search-v2"],
  { revalidate: 3600, tags: ["providers"] },
);

export const searchProviders = cache(async (input: ProviderSearch = {}) => searchProvidersCached(JSON.stringify(normalizeSearch(input))));

const getProviderByLegacySlugCached = unstable_cache(async (slug: string): Promise<Provider | null> => {
  const sql = getDatabase();
  if (!sql) return null;
  try {
    const rows = await sql.unsafe(`select ${providerColumns} from providers where slug = $1 and publication_status = 'published' limit 1`, [slug]);
    return rows[0] ? toProvider(rows[0] as unknown as ProviderRow) : null;
  } catch (error) { console.error("Legacy provider lookup failed", error); throw error; }
}, ["provider-by-legacy-slug"], { revalidate: 3600, tags: ["providers"] });
export const getProviderByLegacySlug = cache(getProviderByLegacySlugCached);

const getProviderByCanonicalPathCached = unstable_cache(async (organizationSlug: string, locationSlug: string): Promise<Provider | null> => {
  const sql = getDatabase();
  if (!sql) return null;
  try {
    const rows = await sql.unsafe(
      `select ${providerColumns} from providers
       where organization_slug = $1 and location_slug = $2 and publication_status = 'published' limit 1`,
      [organizationSlug, locationSlug],
    );
    return rows[0] ? toProvider(rows[0] as unknown as ProviderRow) : null;
  } catch (error) { console.error("Provider lookup failed", error); throw error; }
}, ["provider-by-canonical-path"], { revalidate: 3600, tags: ["providers"] });
export const getProviderByCanonicalPath = cache(getProviderByCanonicalPathCached);

const getProvidersByOrganizationSlugCached = unstable_cache(async (organizationSlug: string): Promise<Provider[]> => {
  const sql = getDatabase();
  if (!sql) return [];
  try {
    const rows = await sql.unsafe(
      `select ${providerColumns} from providers
       where organization_slug = $1 and publication_status = 'published'
       order by ${orderBy.recommended}`,
      [organizationSlug],
    );
    return (rows as unknown as ProviderRow[]).map(toProvider);
  } catch (error) { console.error("Organization provider lookup failed", error); throw error; }
}, ["providers-by-organization-slug"], { revalidate: 3600, tags: ["providers"] });
export const getProvidersByOrganizationSlug = cache(getProvidersByOrganizationSlugCached);

export async function hasPublishedProviders(filter: { state?: string; category?: string }) {
  return (await searchProviders({ ...filter, pageSize: 1 })).total > 0;
}

const getDirectoryFacetsCached = unstable_cache(async () => {
  const sql = getDatabase();
  const empty = { states: [] as string[], categories: [] as string[], insurance: [] as string[], levels: [] as string[], specialties: [] as string[] };
  if (!sql) return empty;
  try {
    const [stateRows, categoryRows, insuranceRows, levelRows, specialtyRows] = await Promise.all([
      sql`select distinct state from providers where publication_status = 'published' order by state`,
      sql`select distinct unnest(categories) as category from providers where publication_status = 'published' order by category`,
      sql`select value from providers cross join lateral unnest(insurance) value where publication_status = 'published' group by value order by count(*) desc, value limit 40`,
      sql`select value from providers cross join lateral unnest(coalesce(levels_of_care, '{}') || coalesce(treatment_types, '{}')) value where publication_status = 'published' group by value order by count(*) desc, value limit 40`,
      sql`select value from providers cross join lateral unnest(specialties) value where publication_status = 'published' group by value order by count(*) desc, value limit 40`,
    ]);
    return {
      states: stateRows.map((row) => String(row.state)),
      categories: categoryRows.map((row) => String(row.category)),
      insurance: insuranceRows.map((row) => String(row.value)),
      levels: levelRows.map((row) => String(row.value)),
      specialties: specialtyRows.map((row) => String(row.value)),
    };
  } catch (error) { console.error("Directory facet lookup failed", error); throw error; }
}, ["directory-facets"], { revalidate: 3600, tags: ["providers"] });
export const getDirectoryFacets = cache(getDirectoryFacetsCached);

function textList(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

function toIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

export type PublishedCity = { state: string; city: string; count: number; updatedAt: string };

const getPublishedCitiesCached = unstable_cache(async (): Promise<PublishedCity[]> => {
  const sql = getDatabase();
  if (!sql) return [];
  const rows = await sql`select state, city, count(*)::int as count, max(updated_at) as updated_at
    from providers where publication_status = 'published'
    group by state, city order by state, city`;
  return rows.map((row) => ({
    state: String(row.state),
    city: String(row.city),
    count: Number(row.count || 0),
    updatedAt: toIso(row.updated_at),
  }));
}, ["published-cities"], { revalidate: 3600, tags: ["providers"] });

export const getPublishedCities = cache(async (stateCode?: string) => {
  const cities = await getPublishedCitiesCached();
  return stateCode ? cities.filter((city) => city.state === stateCode) : cities;
});

export async function getNearbyProviders(provider: Pick<Provider, "id" | "state" | "city" | "address">, limit = 6) {
  const sql = getDatabase();
  if (!sql) return [] as Provider[];
  const cities = [...new Set([provider.city, inferredCity(provider.address, provider.city)].filter(Boolean))];
  if (!cities.length) return [];
  const cityParams = cities.map((_, index) => `$${index + 1}`).join(", ");
  const idRows = await sql.unsafe(
    `select id from providers
     where publication_status = 'published' and state = $${cities.length + 1} and city in (${cityParams}) and id <> $${cities.length + 2}
     order by ${orderBy.recommended}
     limit $${cities.length + 3}`,
    [...cities, provider.state, provider.id, limit],
  );
  const ids = (idRows as unknown as Array<{ id: string }>).map((row) => row.id);
  if (!ids.length) return [];
  const idPlaceholders = ids.map((_, index) => `$${index + 1}`).join(", ");
  const rows = await sql.unsafe(`select ${providerColumns} from providers where id in (${idPlaceholders})`, ids);
  const byId = new Map((rows as unknown as ProviderRow[]).map((row) => [row.id, toProvider(row)]));
  return ids.map((id) => byId.get(id)).filter((item): item is Provider => Boolean(item));
}

export type ListingResolution = { redirectTo: string | null; indexable: boolean };

const resolveProviderListingCached = unstable_cache(async (serialized: string): Promise<ListingResolution> => {
  const current = JSON.parse(serialized) as DuplicateCandidate & IndexingSignals;
  const sql = getDatabase();
  const token = addressSearchToken(current.address);
  let candidates: DuplicateCandidate[] = [current];
  if (sql && token) {
    const rows = await sql.unsafe(
      `select id, organization_slug, location_slug, address, city, state, phone, evidence_score,
        (select count(*)::int from providers organization_locations
          where organization_locations.organization_slug = providers.organization_slug
            and organization_locations.publication_status = 'published') as organization_location_count
       from providers
       where publication_status = 'published' and state = $1 and address ilike $2
       limit 80`,
      [current.state, `%${token}%`],
    );
    candidates = (rows as unknown as Array<Record<string, unknown>>).map((row) => ({
      id: String(row.id),
      organizationSlug: String(row.organization_slug),
      locationSlug: String(row.location_slug),
      organizationLocationCount: Number(row.organization_location_count || 1),
      address: row.address ? String(row.address) : null,
      city: String(row.city),
      state: String(row.state),
      phone: row.phone ? String(row.phone) : null,
      evidenceScore: Number(row.evidence_score || 0),
    }));
    if (!candidates.some((candidate) => candidate.id === current.id)) candidates.push(current);
  }
  const cluster = clusterDuplicates(candidates).find((group) => group.some((item) => item.id === current.id)) || [current];
  const canonical = chooseCanonicalProvider(cluster);
  const canonicalPath = providerPath(canonical);
  const alternatePaths = cluster.map((item) => providerPath(item));
  return {
    redirectTo: canonicalPath === providerPath(current) ? null : canonicalPath,
    indexable: assessProviderIndexing(current, { alternatePaths }).indexable,
  };
}, ["provider-listing-resolution-v2"], { revalidate: 3600, tags: ["providers"] });

export async function resolveProviderListing(provider: DuplicateCandidate & IndexingSignals): Promise<ListingResolution> {
  if (!provider.address) return { redirectTo: null, indexable: isProviderIndexable(provider) };
  const key = JSON.stringify({
    id: provider.id,
    name: provider.name,
    organizationSlug: provider.organizationSlug,
    locationSlug: provider.locationSlug,
    organizationLocationCount: provider.organizationLocationCount,
    address: provider.address,
    city: provider.city,
    state: provider.state,
    phone: provider.phone,
    evidenceScore: provider.evidenceScore,
    website: provider.website,
    categories: provider.categories,
    levelsOfCare: provider.levelsOfCare,
    treatmentTypes: provider.treatmentTypes,
    therapies: provider.therapies,
    insurance: provider.insurance,
    sourceUrl: provider.sourceUrl,
    licenseSummary: provider.licenseSummary,
    accreditation: provider.accreditation,
    verificationStatus: provider.verificationStatus,
  });
  return resolveProviderListingCached(key);
}

type SitemapListing = IndexingSignals & DuplicateCandidate & { updatedAt: string };
type RankedListing = { listing: SitemapListing; priority: number };

function listingXmlBytes(listing: SitemapListing, priority: number) {
  return sitemapEntryBytes(absoluteUrl(providerPath(listing)), listing.updatedAt, priority);
}

const listingSelect = `p.id, p.name, p.organization_slug, p.location_slug, p.address, p.city, p.state, p.phone, p.website,
  p.categories, p.levels_of_care, p.treatment_types, p.therapies, p.insurance, p.license_summary, p.accreditation,
  p.source_url, p.verification_status, p.publication_status, p.evidence_score, p.updated_at,
  coalesce(org_counts.cnt, 1)::int as organization_location_count`;

const listingOrgJoin = `left join (
  select organization_slug, count(*)::int as cnt
  from providers
  where publication_status = 'published' and organization_slug is not null
  group by organization_slug
) org_counts on org_counts.organization_slug = p.organization_slug`;

function toSitemapListing(row: Record<string, unknown>): SitemapListing {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    organizationSlug: String(row.organization_slug),
    locationSlug: String(row.location_slug),
    organizationLocationCount: Number(row.organization_location_count || 1),
    address: row.address ? String(row.address) : null,
    city: String(row.city),
    state: String(row.state),
    phone: row.phone ? String(row.phone) : null,
    website: row.website ? String(row.website) : null,
    categories: textList(row.categories),
    levelsOfCare: textList(row.levels_of_care),
    treatmentTypes: textList(row.treatment_types),
    therapies: textList(row.therapies),
    insurance: textList(row.insurance),
    licenseSummary: row.license_summary ? String(row.license_summary) : null,
    accreditation: textList(row.accreditation),
    sourceUrl: row.source_url ? String(row.source_url) : null,
    verificationStatus: String(row.verification_status) as Provider["verificationStatus"],
    publicationStatus: row.publication_status ? String(row.publication_status) : "published",
    evidenceScore: Number(row.evidence_score || 0),
    updatedAt: toIso(row.updated_at),
  };
}

async function loadSitemapListings(state: string | null) {
  const sql = getDatabase();
  if (!sql) return [] as SitemapListing[];
  const rows = state
    ? await sql.unsafe(
      `select ${listingSelect} from providers p ${listingOrgJoin}
       where p.publication_status = 'published' and p.organization_slug is not null and p.location_slug is not null and p.state = $1`,
      [state],
    )
    : await sql.unsafe(
      `select ${listingSelect} from providers p ${listingOrgJoin}
       where p.publication_status = 'published' and p.organization_slug is not null and p.location_slug is not null`,
    );
  return (rows as unknown as Array<Record<string, unknown>>).map(toSitemapListing);
}

function indexableCanonicalListings(listings: SitemapListing[]): RankedListing[] {
  return clusterDuplicates(listings).flatMap((cluster) => {
    const canonical = chooseCanonicalProvider(cluster);
    const alternatePaths = cluster.map((item) => providerPath(item));
    const decision = assessProviderIndexing(canonical, { alternatePaths });
    return decision.indexable ? [{ listing: canonical, priority: decision.priority }] : [];
  }).sort((a, b) => providerPath(a.listing).localeCompare(providerPath(b.listing)));
}

export type ProviderSitemapSegment = {
  id: string;
  state: string | null;
  part: number;
  lastmod: string;
  kind: "state" | "organizations";
};

function latest(values: string[]) {
  return values.reduce((max, value) => value > max ? value : max, values[0] || new Date(0).toISOString());
}

const getProviderSitemapManifestCached = unstable_cache(async (): Promise<ProviderSitemapSegment[]> => {
  const indexable = indexableCanonicalListings(await loadSitemapListings(null));
  const byState = new Map<string, RankedListing[]>();
  for (const ranked of indexable) {
    const group = byState.get(ranked.listing.state) || [];
    group.push(ranked);
    byState.set(ranked.listing.state, group);
  }
  const segments: ProviderSitemapSegment[] = [];
  for (const [state, group] of byState) {
    const chunks = chunkByLimits(group, (ranked) => listingXmlBytes(ranked.listing, ranked.priority));
    const lastmod = latest(group.map((item) => item.listing.updatedAt));
    chunks.forEach((_, index) => segments.push({
      id: sitemapSegmentId(state.toLowerCase(), index, chunks.length),
      state,
      part: index,
      lastmod,
      kind: "state",
    }));
  }
  const organizations = new Map<string, { updatedAt: string; priority: number }>();
  for (const ranked of indexable) {
    if (ranked.listing.organizationLocationCount <= 1) continue;
    const existing = organizations.get(ranked.listing.organizationSlug);
    if (!existing || ranked.listing.updatedAt > existing.updatedAt) {
      organizations.set(ranked.listing.organizationSlug, { updatedAt: ranked.listing.updatedAt, priority: ranked.priority });
    } else if (ranked.priority > existing.priority) {
      existing.priority = ranked.priority;
    }
  }
  const organizationEntries = [...organizations.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const organizationChunks = chunkByLimits(organizationEntries, ([slug, value]) => sitemapEntryBytes(absoluteUrl(`/providers/${slug}`), value.updatedAt, value.priority));
  const organizationLastmod = latest(organizationEntries.map(([, value]) => value.updatedAt));
  organizationChunks.forEach((_, index) => segments.push({
    id: sitemapSegmentId("organizations", index, organizationChunks.length),
    state: null,
    part: index,
    lastmod: organizationLastmod,
    kind: "organizations",
  }));
  return segments.sort((a, b) => a.id.localeCompare(b.id));
}, ["provider-sitemap-manifest-v2"], { revalidate: 86400, tags: ["providers"] });

export async function getProviderSitemapManifest() {
  return getProviderSitemapManifestCached();
}

export async function getProviderSitemapEntries(segmentId: string) {
  const manifest = await getProviderSitemapManifest();
  const segment = manifest.find((item) => item.id === segmentId);
  if (!segment) return null;
  if (segment.kind === "organizations") {
    const indexable = indexableCanonicalListings(await loadSitemapListings(null));
    const organizations = new Map<string, { updatedAt: string; priority: number }>();
    for (const ranked of indexable) {
      if (ranked.listing.organizationLocationCount <= 1) continue;
      const existing = organizations.get(ranked.listing.organizationSlug);
      if (!existing || ranked.listing.updatedAt > existing.updatedAt) {
        organizations.set(ranked.listing.organizationSlug, { updatedAt: ranked.listing.updatedAt, priority: ranked.priority });
      } else if (ranked.priority > existing.priority) existing.priority = ranked.priority;
    }
    const entries = [...organizations.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const chunks = chunkByLimits(entries, ([slug, value]) => sitemapEntryBytes(absoluteUrl(`/providers/${slug}`), value.updatedAt, value.priority));
    return (chunks[segment.part] || []).map(([slug, value]) => ({
      path: `/providers/${slug}`,
      lastmod: value.updatedAt,
      priority: value.priority,
    }));
  }
  const listings = indexableCanonicalListings(await loadSitemapListings(segment.state));
  const chunks = chunkByLimits(listings, (ranked) => listingXmlBytes(ranked.listing, ranked.priority));
  return (chunks[segment.part] || []).map((ranked) => ({
    path: providerPath(ranked.listing),
    lastmod: ranked.listing.updatedAt,
    priority: ranked.priority,
  }));
}
