import { isPriorityProviderPath } from "@/lib/provider-search-priority";
import { providerPath } from "@/lib/provider-path";
import type { Provider } from "@/lib/types";

/**
 * Single indexability rule for provider pages and the provider sitemap.
 * A published listing is indexable when it matches at least one enabled tier.
 * Thin listings that match none stay noindex and out of the sitemap.
 *
 * Demand: path is on the search-demand allowlist in provider-search-priority.ts.
 * Verified: traceable source URL, plus a non-listed verification status, a license summary, or an accreditation.
 * Complete: phone, website, and street address, plus at least `minCareSignals` service or level-of-care values.
 */
export const INDEXING_POLICY = {
  tiers: {
    demand: { enabled: true },
    verifiedSourceOrLicence: { enabled: true, requireSourceUrl: true },
    completeProfile: { enabled: true, minCareSignals: 1 },
  },
} as const;

export type IndexingTier = "demand" | "verified" | "complete";

export type IndexingSignals = {
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
  sourceUrl: string | null;
  licenseSummary: string | null;
  accreditation: string[];
  verificationStatus: Provider["verificationStatus"];
};

function filled(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

function careSignalCount(provider: Pick<IndexingSignals, "categories" | "levelsOfCare" | "treatmentTypes" | "therapies">) {
  return [provider.categories, provider.levelsOfCare, provider.treatmentTypes, provider.therapies]
    .filter((items) => items.some((item) => item.trim())).length;
}

export function indexingTiers(provider: IndexingSignals, alternatePaths: string[] = []): IndexingTier[] {
  const tiers: IndexingTier[] = [];
  const policy = INDEXING_POLICY.tiers;
  const paths = new Set([providerPath(provider), ...alternatePaths]);
  if (policy.demand.enabled && [...paths].some((path) => isPriorityProviderPath(path))) tiers.push("demand");

  const verifiedEvidence = provider.verificationStatus !== "listed"
    || filled(provider.licenseSummary)
    || provider.accreditation.some((item) => item.trim());
  if (policy.verifiedSourceOrLicence.enabled && verifiedEvidence && (!policy.verifiedSourceOrLicence.requireSourceUrl || filled(provider.sourceUrl))) {
    tiers.push("verified");
  }

  const complete = filled(provider.phone)
    && filled(provider.website)
    && filled(provider.address)
    && careSignalCount(provider) >= policy.completeProfile.minCareSignals;
  if (policy.completeProfile.enabled && complete) tiers.push("complete");

  return tiers;
}

export function isProviderIndexable(provider: IndexingSignals, alternatePaths: string[] = []) {
  return indexingTiers(provider, alternatePaths).length > 0;
}
