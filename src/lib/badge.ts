import { getProviderByCanonicalPath, getProviderByLegacySlug } from "@/lib/providers";

/** Resolves a /providers/... path (legacy or canonical) to a published listing. */
export async function providerFromListingPath(listing: string) {
  const match = listing.match(/^\/providers\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?\/?$/);
  if (!match) return null;
  const [, first, second] = match;
  return second ? getProviderByCanonicalPath(first, second) : getProviderByLegacySlug(first);
}
