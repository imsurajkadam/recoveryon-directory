export const SITE_NAME = "TreatmentLane";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://treatmentlane.com";
export const IMAGE_CDN_URL = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || "https://images.treatmentlane.com";
export const SITE_DESCRIPTION =
  "A transparent directory for finding and comparing addiction treatment, recovery, and mental health resources across the United States.";
export const CONTACT_EMAIL = "suraj@treatmentlane.com";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function brandImageUrl(filename: string) {
  return new URL(`/brand/${filename.replace(/^\/+/, "")}`, IMAGE_CDN_URL).toString();
}

export function sourceDisplayName(url: string | null | undefined) {
  if (!url) return null;

  try {
    const source = new URL(url);
    const hostname = source.hostname.toLowerCase().replace(/^www\./, "");
    const pathname = source.pathname.toLowerCase();

    if (hostname === "recovery.com" || hostname.endsWith(".recovery.com")) return "Recovery.com";
    if (hostname === "maps.app.goo.gl" || hostname === "maps.google.com" || (hostname === "google.com" && pathname.startsWith("/maps"))) return "Google Maps";
    if (hostname === "psychologytoday.com" || hostname.endsWith(".psychologytoday.com")) return "Psychology Today";
    if (hostname === "yelp.com" || hostname.endsWith(".yelp.com")) return "Yelp";
    if (hostname === "findtreatment.gov" || hostname.endsWith(".findtreatment.gov")) return "FindTreatment.gov";
    if (hostname === "samhsa.gov" || hostname.endsWith(".samhsa.gov")) return "SAMHSA";

    return hostname || null;
  } catch {
    return null;
  }
}
