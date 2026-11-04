const STREET_SUFFIX = /^(road|rd|street|st|avenue|ave|boulevard|blvd|drive|dr|lane|ln|way|court|ct|place|pl|terrace|ter|circle|cir|parkway|pkwy|highway|hwy|suite|ste|unit|floor|fl)$/i;

export function slugifyPlace(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleCasePlace(value: string) {
  if (value !== value.toLowerCase() && value !== value.toUpperCase()) return value;
  return value.replace(/\b([a-z])/g, (letter) => letter.toUpperCase());
}

/**
 * Use a city written at the end of the street address when it disagrees with the stored city.
 * Example: city "Detroit" with address "2628 South Milford Rd, Highland".
 */
export function inferredCity(address: string | null, city: string) {
  const stored = city.trim();
  if (!address) return stored;
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return stored;
  const candidate = parts[parts.length - 1]
    .replace(/\b\d{5}(?:-\d{4})?\b/g, "")
    .replace(/\b[A-Z]{2}\b/g, "")
    .trim();
  if (!candidate || candidate.length < 3 || candidate.length > 40) return stored;
  if (!/^[A-Za-z][A-Za-z .'-]+$/.test(candidate)) return stored;
  if (STREET_SUFFIX.test(candidate)) return stored;
  if (candidate.toLowerCase() === stored.toLowerCase()) return stored;
  return titleCasePlace(candidate);
}

export function cityHubPath(stateSlug: string, city: string) {
  return `/locations/${stateSlug}/${slugifyPlace(city)}`;
}
