// Provider photos come from two places:
//  - images.treatmentlane.com: TreatmentLane's R2 bucket (owned, or supplied by the provider with rights confirmed)
//  - res.cloudinary.com/rehabpath: photos from the public source listing, shown until the provider
//    supplies their own (decision 12 Nov 2026). Owned photos always take priority.

const SOURCE_IMAGE_PREFIX = "/rehabpath/image/upload/";

export function isSourceImage(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "res.cloudinary.com" && parsed.pathname.startsWith(SOURCE_IMAGE_PREFIX);
  } catch {
    return false;
  }
}

export function isPlaceholderImage(url: string) {
  return url.includes("/brand/treatmentlane-listing-placeholder");
}

/**
 * Returns a resized Cloudinary URL for source photos (served directly by Cloudinary, so they
 * skip Next.js image optimization). Other URLs are returned unchanged.
 */
export function sizedImageUrl(url: string, width: number, height?: number) {
  if (!isSourceImage(url)) return url;
  const parsed = new URL(url);
  const rest = parsed.pathname.slice(SOURCE_IMAGE_PREFIX.length).split("/");
  // Drop an existing transformation segment (e.g. "c_lfill,q_90,f_auto,w_500") but keep the version and file.
  if (rest.length > 1 && !/^v\d+$/.test(rest[0]) && rest[0].includes("_")) rest.shift();
  const transform = ["c_fill", "g_auto", `w_${width}`, height ? `h_${height}` : null, "q_auto", "f_auto"].filter(Boolean).join(",");
  parsed.pathname = `${SOURCE_IMAGE_PREFIX}${transform}/${rest.join("/")}`;
  return parsed.toString();
}

/** Owned photos first, then source photos, then the generic placeholder. */
export function rankImages(urls: string[]) {
  const score = (url: string) => (isPlaceholderImage(url) ? 2 : isSourceImage(url) ? 1 : 0);
  return [...urls].sort((a, b) => score(a) - score(b));
}
