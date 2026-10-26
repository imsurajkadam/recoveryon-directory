import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getDatabase } from "@/lib/db";
import { priorityProviderOrganizationSlugs } from "@/lib/provider-search-priority";
import { isProviderIndexable, type ProviderSeoSignals } from "@/lib/provider-seo";
import { brandImageUrl } from "@/lib/site";
import type { Provider } from "@/lib/types";

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
    description: row.description, address: normalizeStreetAddress(row.address, row.city, row.state, row.postal_code),
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
  keyword?: string; location?: string; category?: string; state?: string; insurance?: string; level?: string; specialty?: string;
  sort?: ProviderSort; page?: number; pageSize?: number;
};
export type ProviderSearchResult = { providers: Provider[]; total: number; page: number; totalPages: number };

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

export function providerPath(provider: Pick<Provider, "organizationSlug" | "locationSlug" | "organizationLocationCount">) {
  return provider.organizationLocationCount > 1
    ? `/providers/${provider.organizationSlug}/${provider.locationSlug}`
    : `/providers/${provider.organizationSlug}`;
}

export async function searchProviders(input: ProviderSearch = {}): Promise<ProviderSearchResult> {
  const sql = getDatabase();
  const pageSize = Math.min(Math.max(input.pageSize || 24, 1), 100);
  const requestedPage = Math.max(input.page || 1, 1);
  const sort = input.sort && input.sort in orderBy ? input.sort : "recommended";
  if (!sql) return { providers: [], total: 0, page: 1, totalPages: 0 };
  const clauses = ["publication_status = 'published'"];
  const params: (string | number)[] = [];
  const add = (value: string | number) => { params.push(value); return `$${params.length}`; };
  if (input.keyword?.trim()) {
    const term = add(`%${input.keyword.trim()}%`);
    clauses.push(`(name ilike ${term} or description ilike ${term} or array_to_string(categories, ' ') ilike ${term} or array_to_string(levels_of_care, ' ') ilike ${term} or array_to_string(treatment_types, ' ') ilike ${term} or array_to_string(therapies, ' ') ilike ${term} or array_to_string(specialties, ' ') ilike ${term})`);
  }
  if (input.location?.trim()) {
    const term = add(`%${input.location.trim()}%`);
    clauses.push(`concat_ws(' ', address, city, state, postal_code) ilike ${term}`);
  }
  if (input.category?.trim()) clauses.push(`${add(input.category.trim())} = any(categories)`);
  if (input.state?.trim()) clauses.push(`state = ${add(input.state.trim().toUpperCase())}`);
  if (input.insurance?.trim()) clauses.push(`${add(input.insurance.trim())} = any(insurance)`);
  if (input.level?.trim()) {
    const level = add(input.level.trim());
    clauses.push(`(${level} = any(levels_of_care) or ${level} = any(treatment_types))`);
  }
  if (input.specialty?.trim()) clauses.push(`${add(input.specialty.trim())} = any(specialties)`);
  const where = clauses.join(" and ");
  try {
    const countRows = await sql.unsafe(`select count(*)::int as count from providers where ${where}`, params);
    const total = Number(countRows[0]?.count || 0);
    const totalPages = total ? Math.ceil(total / pageSize) : 0;
    const page = totalPages ? Math.min(requestedPage, totalPages) : 1;
    const rows = await sql.unsafe(
      `select ${providerColumns} from providers where ${where}
       order by ${orderBy[sort]} limit $${params.length + 1} offset $${params.length + 2}`,
      [...params, pageSize, (page - 1) * pageSize],
    );
    return { providers: (rows as unknown as ProviderRow[]).map(toProvider), total, page, totalPages };
  } catch (error) {
    console.error("Provider search failed", error);
    throw error;
  }
}

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

export async function getSitemapProviders() {
  const sql = getDatabase();
  type SitemapProvider = ProviderSeoSignals & Pick<Provider, "updatedAt">;
  if (!sql) return [] as SitemapProvider[];
  try {
    const rows = await sql`select p.name, p.organization_slug, p.location_slug,
        p.description, p.address, p.city, p.state, p.phone, p.website,
        p.categories, p.levels_of_care, p.insurance, p.treatment_types, p.therapies,
        p.last_verified_at, p.source_url, p.updated_at, p.evidence_score, p.verification_status,
        coalesce(org_counts.cnt, 1)::int as organization_location_count
      from providers p
      left join (
        select organization_slug, count(*)::int as cnt
        from providers
        where publication_status = 'published' and organization_slug is not null
        group by organization_slug
      ) org_counts on org_counts.organization_slug = p.organization_slug
      where p.publication_status = 'published'
        and p.organization_slug is not null and p.location_slug is not null
        and (
          p.organization_slug in ${sql(priorityProviderOrganizationSlugs)}
          or (
            p.verification_status <> 'listed'
            and p.source_url is not null
            and p.last_verified_at is not null
            and num_nonnulls(p.address, p.phone, p.website) >= 2
          )
          or (
            p.verification_status = 'listed'
            and p.evidence_score >= 70
            and length(trim(coalesce(p.description, ''))) >= 160
            and p.source_url is not null
            and p.last_verified_at is not null
            and num_nonnulls(p.address, p.phone, p.website) >= 2
            and (
              (case when cardinality(coalesce(p.categories, '{}')) > 0 then 1 else 0 end)
              + (case when cardinality(coalesce(p.levels_of_care, '{}')) > 0 then 1 else 0 end)
              + (case when cardinality(coalesce(p.treatment_types, '{}')) > 0 then 1 else 0 end)
              + (case when cardinality(coalesce(p.therapies, '{}')) > 0 then 1 else 0 end)
              + (case when cardinality(coalesce(p.insurance, '{}')) > 0 then 1 else 0 end)
            ) >= 2
          )
        )
      order by p.organization_slug, p.location_slug`;
    const providers = rows.map((row) => ({
      name: String(row.name),
      organizationSlug: String(row.organization_slug),
      locationSlug: String(row.location_slug),
      organizationLocationCount: Number(row.organization_location_count || 1),
      city: String(row.city),
      state: String(row.state),
      description: row.description ? String(row.description) : null,
      address: row.address ? String(row.address) : null,
      phone: row.phone ? String(row.phone) : null,
      website: row.website ? String(row.website) : null,
      categories: Array.isArray(row.categories) ? row.categories.map(String) : [],
      levelsOfCare: Array.isArray(row.levels_of_care) ? row.levels_of_care.map(String) : [],
      insurance: Array.isArray(row.insurance) ? row.insurance.map(String) : [],
      treatmentTypes: Array.isArray(row.treatment_types) ? row.treatment_types.map(String) : [],
      therapies: Array.isArray(row.therapies) ? row.therapies.map(String) : [],
      sourceUrl: row.source_url ? String(row.source_url) : null,
      lastVerifiedAt: row.last_verified_at ? String(row.last_verified_at) : null,
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : new Date(String(row.updated_at)).toISOString(),
      evidenceScore: Number(row.evidence_score || 0),
      verificationStatus: String(row.verification_status) as Provider["verificationStatus"],
    } satisfies SitemapProvider));
    return providers.filter(isProviderIndexable);
  } catch (error) { console.error("Sitemap provider lookup failed", error); throw error; }
}
