import { isPriorityProviderPath } from "@/lib/provider-search-priority";
import type { Provider } from "@/lib/types";

export type ProviderSeoSignals = Pick<Provider,
  "name" | "organizationSlug" | "locationSlug" | "organizationLocationCount" |
  "city" | "state" | "description" | "address" | "phone" | "website" |
  "categories" | "levelsOfCare" | "treatmentTypes" | "therapies" | "insurance" |
  "sourceUrl" | "lastVerifiedAt" | "evidenceScore" | "verificationStatus"
>;

export function providerSeoPath(provider: Pick<ProviderSeoSignals, "organizationSlug" | "locationSlug" | "organizationLocationCount">) {
  return provider.organizationLocationCount > 1
    ? `/providers/${provider.organizationSlug}/${provider.locationSlug}`
    : `/providers/${provider.organizationSlug}`;
}

export function isDemandPriorityProvider(provider: Pick<ProviderSeoSignals, "organizationSlug" | "locationSlug" | "organizationLocationCount">) {
  return isPriorityProviderPath(providerSeoPath(provider));
}

export function isProviderIndexable(provider: ProviderSeoSignals) {
  // Every published provider page is indexable. A quality gate added
  // 2026-10-24 restricted indexing to a small verified subset, which
  // collapsed the sitemap from ~36k URLs to 461 and left most provider
  // pages noindexed. Removed 2026-11-09 at the site owner's request:
  // all published providers are indexable again.
  void provider;
  return true;
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const contentLength = Math.max(1, maxLength - 3);
  const slice = value.slice(0, contentLength + 1);
  const boundary = slice.lastIndexOf(" ");
  return `${slice.slice(0, boundary > contentLength * 0.65 ? boundary : contentLength).trim()}...`;
}

export function getProviderSeoTitle(provider: Pick<ProviderSeoSignals, "name" | "city" | "state" | "address" | "organizationLocationCount">) {
  const location = provider.organizationLocationCount > 1 && provider.address
    ? `${provider.address.split(",")[0]}, ${provider.city}, ${provider.state}`
    : `${provider.city}, ${provider.state}`;
  return fitSeoTitle(`${provider.name}: Services in ${location}`);
}

export function getOrganizationSeoTitle(name: string) {
  const suffix = " locations";
  return `${truncateAtWord(name.trim(), 60 - suffix.length)}${suffix}`;
}

export function fitSeoTitle(title: string) {
  return truncateAtWord(title.trim(), 60);
}

export function fitSeoDescription(description: string) {
  return truncateAtWord(description.trim(), 155);
}

export function getProviderSeoDescription(provider: ProviderSeoSignals) {
  const careType = provider.treatmentTypes[0] || provider.levelsOfCare[0] || provider.categories[0];
  const insurance = provider.insurance.slice(0, 2).join(" and ");
  const careCopy = careType ? ` lists ${careType}` : " has a published TreatmentLane profile";
  const insuranceCopy = insurance ? ` and insurance information including ${insurance}` : "";
  return fitSeoDescription(`${provider.name} in ${provider.city}, ${provider.state}${careCopy}${insuranceCopy}. Compare services, source evidence, and contact details.`);
}
