import { absoluteUrl } from "@/lib/site";

export const EDITORIAL_REVIEWED_ON = "2026-10-24";

export const editorialSources = [
  { label: "SAMHSA: Find Treatment", href: "https://www.samhsa.gov/substance-use/treatment/find-treatment" },
  { label: "SAMHSA: Finding Quality Treatment", href: "https://www.samhsa.gov/find-support/learn-about-treatment/finding-quality-treatment" },
  { label: "ASAM Criteria", href: "https://www.asam.org/asam-criteria/about-the-asam-criteria" },
  { label: "Medicaid and CHIP state contacts", href: "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip" },
] as const;

export const editorialAuthor = {
  name: "TreatmentLane Editorial Team",
  url: "/about/editorial-standards",
};

/**
 * Named guide credits. Leave name blank until a real person has written or
 * reviewed the page. Empty names stay an Organization byline, not a fictional person.
 */
export const GUIDE_AUTHOR = {
  name: "",
  url: "/about/editorial-standards",
};

export const GUIDE_REVIEWER = {
  name: "",
  credentials: "",
  url: "/about/editorial-standards",
};

export function guideAuthorEntity(name = GUIDE_AUTHOR.name) {
  const trimmed = name.trim();
  if (!trimmed || trimmed === editorialAuthor.name) {
    return { "@type": "Organization" as const, name: editorialAuthor.name, url: absoluteUrl(editorialAuthor.url) };
  }
  return { "@type": "Person" as const, name: trimmed, url: absoluteUrl(GUIDE_AUTHOR.url) };
}

export function guideReviewerEntity(name = GUIDE_REVIEWER.name, credentials = GUIDE_REVIEWER.credentials) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  return {
    "@type": "Person" as const,
    name: trimmed,
    url: absoluteUrl(GUIDE_REVIEWER.url || editorialAuthor.url),
    ...(credentials.trim() ? { honorificSuffix: credentials.trim() } : {}),
  };
}

export function guideByline(options?: { authorName?: string; reviewerName?: string; reviewerCredentials?: string }) {
  const authorName = (options?.authorName || GUIDE_AUTHOR.name).trim();
  const reviewerName = (options?.reviewerName || GUIDE_REVIEWER.name).trim();
  const credentials = (options?.reviewerCredentials || GUIDE_REVIEWER.credentials).trim();
  const authorLabel = !authorName || authorName === editorialAuthor.name ? editorialAuthor.name : authorName;
  const reviewerLabel = reviewerName ? `${reviewerName}${credentials ? `, ${credentials}` : ""}` : "";
  return reviewerLabel
    ? `Written by ${authorLabel}. Reviewed by ${reviewerLabel}.`
    : `Written and source-checked by ${authorLabel}. No individual clinical reviewer is named for this page.`;
}
