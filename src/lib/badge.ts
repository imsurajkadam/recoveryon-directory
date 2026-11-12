import { getProviderByCanonicalPath, getProviderByLegacySlug, getProvidersByOrganizationSlug } from "@/lib/providers";

/** Resolves a /providers/... path (single-location org, legacy slug, or org/location) to a published listing. */
export async function providerFromListingPath(listing: string) {
  const match = listing.match(/^\/providers\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?\/?$/);
  if (!match) return null;
  const [, first, second] = match;
  if (second) return getProviderByCanonicalPath(first, second);
  const byOrganization = await getProvidersByOrganizationSlug(first);
  if (byOrganization.length === 1) return byOrganization[0];
  return getProviderByLegacySlug(first);
}
