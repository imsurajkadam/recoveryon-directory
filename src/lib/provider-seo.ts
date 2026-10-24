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
  if (isDemandPriorityProvider(provider)) return true;

  const contactSignals = [provider.address, provider.phone, provider.website].filter(Boolean).length;
  const careSignals = [
    provider.categories,
    provider.levelsOfCare,
    provider.treatmentTypes,
    provider.therapies,
    provider.insurance,
  ].filter((items) => items.length > 0).length;
  const hasSubstantiveDescription = (provider.description?.trim().length || 0) >= 160;
  const hasTraceableSource = Boolean(provider.sourceUrl);

  if (provider.verificationStatus !== "listed") {
    return hasTraceableSource && Boolean(provider.lastVerifiedAt) && contactSignals >= 2;
  }

  return provider.evidenceScore >= 70
    && hasSubstantiveDescription
    && hasTraceableSource
    && Boolean(provider.lastVerifiedAt)
    && contactSignals >= 2
    && careSignals >= 2;
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const contentLength = Math.max(1, maxLength - 3);
  const slice = value.slice(0, contentLength + 1);
  const boundary = slice.lastIndexOf(" ");
  return `${slice.slice(0, boundary > contentLength * 0.65 ? boundary : contentLength).trim()}...`;
}

export function getProviderSeoTitle(provider: Pick<ProviderSeoSignals, "name" | "city" | "state">) {
  const location = `${provider.city}, ${provider.state}`;
  const suffix = ` | ${location}`;
  const maxNameLength = Math.max(10, 60 - suffix.length);
  return `${truncateAtWord(provider.name.trim(), maxNameLength)}${suffix}`;
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
  const fallback = careType
    ? `${provider.name} in ${provider.city}, ${provider.state} lists ${careType}. Review services, source details, insurance information, and contact options.`
    : `Review services, source details, insurance information, and contact options for ${provider.name} in ${provider.city}, ${provider.state}.`;
  return fitSeoDescription(provider.description?.trim() || fallback);
}
