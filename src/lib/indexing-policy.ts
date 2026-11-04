import { isPriorityProviderPath } from "@/lib/provider-search-priority";
import { providerPath } from "@/lib/provider-path";
import type { Provider } from "@/lib/types";

/**
 * Default is index. A published, non-duplicate listing is indexable when it
 * has a real name, a city and state, and at least one useful contact or detail.
 * Demand and verified signals raise sitemap priority. They do not gate indexing.
 *
 * Noindex reasons: unpublished, closed/inactive, test, duplicate, missing
 * identity (no real name or city/state), or name-only (no contact and no care).
 */
export const INDEXING_POLICY = {
  requireRealName: true,
  requireCityAndState: true,
  usefulDetail: {
    phone: true,
    website: true,
    streetAddress: true,
    serviceOrLevelOrInsurance: true,
  },
  priority: {
    default: 0.6,
    verified: 0.8,
    demand: 0.9,
  },
  boosts: {
    demand: { enabled: true },
    verified: { enabled: true, requireSourceUrl: true },
  },
} as const;

export type IndexingBoost = "demand" | "verified";

export type NoindexReason =
  | "unpublished"
  | "closed"
  | "test"
  | "duplicate"
  | "missing-identity"
  | "name-only";

export type IndexingSignals = {
  name: string;
  city: string;
  state: string;
  organizationSlug: string;
  locationSlug: string;
  organizationLocationCount: number;
  address: string | null;
  phone: string | null;
  website: string | null;
  categories: string[];
  levelsOfCare: string[];
  treatmentTypes: string[];
  therapies: string[];
  insurance: string[];
  sourceUrl: string | null;
  licenseSummary: string | null;
  accreditation: string[];
  verificationStatus: Provider["verificationStatus"];
  publicationStatus?: "draft" | "review" | "published" | "archived" | string | null;
  /** Set when a source marks the location closed or inactive. Name checks are separate. */
  operationalStatus?: string | null;
};

export type IndexingDecision = {
  indexable: boolean;
  reason: NoindexReason | null;
  boosts: IndexingBoost[];
  /** Sitemap <priority>. Only meaningful when indexable. */
  priority: number;
};

const TEST_NAME = /^(test|testing|sample|demo|placeholder)\b|\b(test listing|do not (?:publish|index))\b/i;
const CLOSED_NAME = /\b(closed|inactive|permanently closed)\b/i;

function filled(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

function hasItems(items: string[] | null | undefined) {
  return Boolean(items?.some((item) => item.trim()));
}

export function hasUsefulProviderDetail(provider: Pick<IndexingSignals, "phone" | "website" | "address" | "categories" | "levelsOfCare" | "treatmentTypes" | "therapies" | "insurance">) {
  const policy = INDEXING_POLICY.usefulDetail;
  const care = policy.serviceOrLevelOrInsurance && (
    hasItems(provider.categories)
    || hasItems(provider.levelsOfCare)
    || hasItems(provider.treatmentTypes)
    || hasItems(provider.therapies)
    || hasItems(provider.insurance)
  );
  return (policy.phone && filled(provider.phone))
    || (policy.website && filled(provider.website))
    || (policy.streetAddress && filled(provider.address))
    || care;
}

export function indexingBoosts(provider: IndexingSignals, alternatePaths: string[] = []): IndexingBoost[] {
  const boosts: IndexingBoost[] = [];
  const paths = new Set([providerPath(provider), ...alternatePaths]);
  if (INDEXING_POLICY.boosts.demand.enabled && [...paths].some((path) => isPriorityProviderPath(path))) boosts.push("demand");

  const verifiedEvidence = provider.verificationStatus !== "listed"
    || filled(provider.licenseSummary)
    || hasItems(provider.accreditation);
  const verified = verifiedEvidence && (!INDEXING_POLICY.boosts.verified.requireSourceUrl || filled(provider.sourceUrl));
  if (INDEXING_POLICY.boosts.verified.enabled && verified) boosts.push("verified");
  return boosts;
}

function sitemapPriority(boosts: IndexingBoost[]) {
  if (boosts.includes("demand")) return INDEXING_POLICY.priority.demand;
  if (boosts.includes("verified")) return INDEXING_POLICY.priority.verified;
  return INDEXING_POLICY.priority.default;
}

function closedReason(provider: IndexingSignals): boolean {
  const operational = (provider.operationalStatus || "").trim().toLowerCase();
  if (operational === "closed" || operational === "inactive") return true;
  if (provider.publicationStatus === "archived") return true;
  return CLOSED_NAME.test(provider.name || "");
}

/**
 * Single decision used by provider pages and the provider sitemap.
 * `isDuplicate` marks a listing that 301s to another canonical URL.
 */
export function assessProviderIndexing(provider: IndexingSignals, options?: { isDuplicate?: boolean; alternatePaths?: string[] }): IndexingDecision {
  const alternatePaths = options?.alternatePaths || [];
  const boosts = indexingBoosts(provider, alternatePaths);
  const blocked = (reason: NoindexReason): IndexingDecision => ({ indexable: false, reason, boosts, priority: INDEXING_POLICY.priority.default });

  const publication = provider.publicationStatus || "published";
  if (publication === "draft" || publication === "review") return blocked("unpublished");
  if (closedReason(provider)) return blocked("closed");
  if (TEST_NAME.test(provider.name || "")) return blocked("test");
  if (options?.isDuplicate) return blocked("duplicate");

  const name = provider.name?.trim() || "";
  const city = provider.city?.trim() || "";
  const state = provider.state?.trim() || "";
  const realName = !INDEXING_POLICY.requireRealName || (name.length >= 2 && !/^(unknown|n\/a|none|null)$/i.test(name));
  const realPlace = !INDEXING_POLICY.requireCityAndState || (city.length >= 2 && /^[A-Za-z]{2}$/.test(state));
  if (!realName || !realPlace) return blocked("missing-identity");
  if (!hasUsefulProviderDetail(provider)) return blocked("name-only");

  return { indexable: true, reason: null, boosts, priority: sitemapPriority(boosts) };
}

export function isProviderIndexable(provider: IndexingSignals, alternatePaths: string[] = []) {
  return assessProviderIndexing(provider, { alternatePaths }).indexable;
}
