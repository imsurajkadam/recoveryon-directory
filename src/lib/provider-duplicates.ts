import { inferredCity } from "@/lib/places";
import { providerPath } from "@/lib/provider-path";

export type DuplicateCandidate = {
  id: string;
  organizationSlug: string;
  locationSlug: string;
  organizationLocationCount: number;
  address: string | null;
  city: string;
  state: string;
  phone: string | null;
  evidenceScore: number;
};

export function normalizeMatchPhone(phone: string | null | undefined) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

export function normalizeMatchAddress(address: string | null | undefined) {
  if (!address) return "";
  return address
    .toLowerCase()
    .replace(/\b(united states|usa)\b/g, " ")
    .replace(/\b(apartment|apt|suite|ste|unit|bldg|building|floor|fl)\s*[a-z0-9-]+\b/g, " ")
    .replace(/#\s*[a-z0-9-]+\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function addressSearchToken(address: string | null | undefined) {
  const normalized = normalizeMatchAddress(address);
  return normalized.match(/\d+\s+[a-z0-9]+/)?.[0] || null;
}

export function addressesMatch(left: string | null | undefined, right: string | null | undefined) {
  const a = normalizeMatchAddress(left);
  const b = normalizeMatchAddress(right);
  if (a.length < 8 || b.length < 8) return false;
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  return longer === shorter || longer.startsWith(`${shorter} `);
}

function streetBucket(provider: Pick<DuplicateCandidate, "state" | "address">) {
  const tokens = normalizeMatchAddress(provider.address).split(" ").filter(Boolean);
  if (tokens.length < 2 || !/^\d+$/.test(tokens[0])) return null;
  return `${provider.state}|${tokens[0]}|${tokens[1]}`;
}

function sameAddressGroups<T extends DuplicateCandidate>(bucket: T[]) {
  const groups: T[][] = [];
  for (const provider of bucket) {
    const group = groups.find((existing) => existing.some((item) => addressesMatch(item.address, provider.address)));
    if (group) group.push(provider);
    else groups.push([provider]);
  }
  return groups;
}

/** Same street address and state. Different phone numbers stay separate. A blank phone joins the only phone group. */
export function clusterDuplicates<T extends DuplicateCandidate>(providers: T[]) {
  const buckets = new Map<string, T[]>();
  const ungrouped: T[][] = [];
  for (const provider of providers) {
    const key = streetBucket(provider);
    if (!key) {
      ungrouped.push([provider]);
      continue;
    }
    const bucket = buckets.get(key) || [];
    bucket.push(provider);
    buckets.set(key, bucket);
  }

  const clusters: T[][] = [...ungrouped];
  for (const bucket of buckets.values()) {
    for (const addressGroup of sameAddressGroups(bucket)) {
      const phones = new Set(addressGroup.map((provider) => normalizeMatchPhone(provider.phone)).filter(Boolean));
      if (phones.size <= 1) {
        clusters.push(addressGroup);
        continue;
      }
      const byPhone = new Map<string, T[]>();
      for (const provider of addressGroup) {
        const phone = normalizeMatchPhone(provider.phone) || "__none__";
        const group = byPhone.get(phone) || [];
        group.push(provider);
        byPhone.set(phone, group);
      }
      for (const group of byPhone.values()) clusters.push(group);
    }
  }
  return clusters;
}

export function chooseCanonicalProvider<T extends DuplicateCandidate>(providers: T[]) {
  return [...providers].sort((a, b) => {
    const aSubpage = a.organizationLocationCount > 1 ? 1 : 0;
    const bSubpage = b.organizationLocationCount > 1 ? 1 : 0;
    if (aSubpage !== bSubpage) return bSubpage - aSubpage;
    const aCity = a.city.toLowerCase() === inferredCity(a.address, a.city).toLowerCase() ? 1 : 0;
    const bCity = b.city.toLowerCase() === inferredCity(b.address, b.city).toLowerCase() ? 1 : 0;
    if (aCity !== bCity) return bCity - aCity;
    if (a.evidenceScore !== b.evidenceScore) return b.evidenceScore - a.evidenceScore;
    return providerPath(a).localeCompare(providerPath(b)) || a.id.localeCompare(b.id);
  })[0];
}

export function canonicalProviders<T extends DuplicateCandidate>(providers: T[]) {
  return clusterDuplicates(providers).map((cluster) => chooseCanonicalProvider(cluster));
}

export function canonicalPathForProvider<T extends DuplicateCandidate>(provider: T, candidates: T[]) {
  const cluster = clusterDuplicates(candidates).find((group) => group.some((item) => item.id === provider.id));
  if (!cluster || cluster.length < 2) return null;
  const canonical = chooseCanonicalProvider(cluster);
  const canonicalPath = providerPath(canonical);
  return canonicalPath === providerPath(provider) ? null : canonicalPath;
}
