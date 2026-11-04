export function providerPath(provider: {
  organizationSlug: string;
  locationSlug: string;
  organizationLocationCount: number;
}) {
  return provider.organizationLocationCount > 1
    ? `/providers/${provider.organizationSlug}/${provider.locationSlug}`
    : `/providers/${provider.organizationSlug}`;
}

/** Fragment, not a query string, so claim and correction links are not crawlable URLs. */
export function providerReferenceHref(basePath: "/corrections" | "/providers/apply", providerPathname: string) {
  return `${basePath}#provider=${encodeURIComponent(providerPathname)}`;
}
