import type { Provider } from "@/lib/types";

type SummaryInput = Pick<Provider,
  "id" | "name" | "city" | "state" | "description" | "categories" | "levelsOfCare" | "treatmentTypes" |
  "therapies" | "insurance" | "amenities" | "specialties" | "accreditation" | "sourceRatingValue" |
  "sourceRatingCount" | "organizationLocationCount" | "verificationStatus" | "treatmentDuration"
>;

const TEMPLATE_MARKER = /\bis listed in\b/i;

/** Imported listings share one generated sentence pattern ("X is listed in City, ST as a ... resource"). */
export function hasTemplateDescription(provider: Pick<Provider, "description">) {
  return !provider.description || TEMPLATE_MARKER.test(provider.description);
}

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(options: T[], seed: number, salt: number) {
  return options[(seed + salt * 7919) % options.length];
}

function tidy(label: string) {
  const trimmed = label.trim().replace(/\s+/g, " ");
  // Keep acronyms (IOP, PHP, MAT, CBT, DBT, EMDR) and proper nouns; lowercase plain words.
  return trimmed.split(" ").map((word) => (/^[A-Z0-9()&/-]{2,}$/.test(word) || /^\(?[A-Z]{2,}\)?$/.test(word) ? word : word.toLowerCase())).join(" ");
}

function unique(values: string[], lowercase = true) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const label = lowercase ? tidy(value) : value.trim().replace(/\s+/g, " ");
    const key = label.toLowerCase().replace(/\s*\([^)]*\)/g, "").replace(/\b(treatment|program|services?)\b/g, "").replace(/\s+/g, " ").trim();
    if (!label || seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

function list(values: string[]) {
  if (values.length <= 1) return values.join("");
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

/**
 * Builds a listing summary from the structured fields on the record, so pages that
 * only carry the imported template sentence still read as distinct, factual copy.
 * Wording varies deterministically per listing id; every clause comes from data.
 */
export function buildProviderSummary(provider: SummaryInput): string[] {
  const seed = hash(provider.id || provider.name);
  const place = `${provider.city}, ${provider.state}`;
  const care = unique([...provider.levelsOfCare, ...provider.treatmentTypes, ...provider.categories]).slice(0, 4);
  const therapies = unique(provider.therapies).slice(0, 4);
  const specialties = unique(provider.specialties).slice(0, 3);
  const insurance = unique(provider.insurance, false).slice(0, 4);
  const amenities = unique(provider.amenities).slice(0, 3);
  const paragraphs: string[] = [];

  const opener = care.length
    ? pick([
      `${provider.name} is a ${place} treatment provider whose published services include ${list(care)}.`,
      `Based in ${place}, ${provider.name} offers ${list(care)}, according to the source records behind this listing.`,
      `${provider.name} serves people in and around ${place}. Its listed care options are ${list(care)}.`,
      `For people comparing care in ${place}, ${provider.name} lists ${list(care)}.`,
    ], seed, 1)
    : `${provider.name} is a behavioral health and addiction treatment resource in ${place}.`;

  const details: string[] = [opener];
  if (therapies.length) {
    details.push(pick([
      `Clinical approaches mentioned for this location include ${list(therapies)}.`,
      `Therapies named in its records include ${list(therapies)}.`,
      `The program's listed methods include ${list(therapies)}.`,
    ], seed, 2));
  }
  if (specialties.length) {
    details.push(pick([
      `It also notes a focus on ${list(specialties)}.`,
      `Listed specialties include ${list(specialties)}.`,
    ], seed, 3));
  }
  paragraphs.push(details.join(" "));

  const practical: string[] = [];
  if (insurance.length) {
    const more = provider.insurance.length > insurance.length ? `, among ${provider.insurance.length} payment options on file` : "";
    practical.push(pick([
      `Payment options on record include ${list(insurance)}${more}.`,
      `Insurance and payment information lists ${list(insurance)}${more}.`,
      `Its records list ${list(insurance)} as accepted payment${more}.`,
    ], seed, 4));
  }
  if (provider.treatmentDuration) practical.push(`Typical program length is listed as ${tidy(provider.treatmentDuration)}.`);
  if (amenities.length) practical.push(`Amenities mentioned include ${list(amenities)}.`);
  if (provider.accreditation.length) practical.push(`Accreditation on file: ${unique(provider.accreditation, false).slice(0, 3).join(", ")}.`);
  if (provider.sourceRatingValue && provider.sourceRatingCount && provider.sourceRatingCount >= 3) {
    practical.push(`It holds a ${provider.sourceRatingValue.toFixed(1)}-star average across ${provider.sourceRatingCount.toLocaleString("en-US")} public reviews.`);
  }
  if (provider.organizationLocationCount > 1) {
    practical.push(`This is one of ${provider.organizationLocationCount} locations TreatmentLane lists for this organization.`);
  }
  if (practical.length) paragraphs.push(practical.join(" "));

  const closing = provider.verificationStatus === "provider-confirmed"
    ? "The provider has confirmed this listing with TreatmentLane. Call ahead to check current availability and admissions."
    : pick([
      "Details come from public and source records. Call the program to confirm current services, eligibility, cost, and licensing before you go.",
      "Services and coverage can change, so confirm availability, eligibility, cost, and licensing directly with the program.",
      `Before choosing a program, contact ${provider.name} to confirm current services, insurance acceptance, and admission requirements.`,
    ], seed, 5);
  paragraphs.push(closing);
  return paragraphs;
}

/** One-sentence blurb for listing cards. */
export function buildProviderBlurb(provider: SummaryInput) {
  const care = unique([...provider.levelsOfCare, ...provider.treatmentTypes, ...provider.categories]).slice(0, 3);
  const insurance = unique(provider.insurance, false).slice(0, 2);
  const careCopy = care.length ? `Offers ${list(care)}` : "Treatment resource";
  const insuranceCopy = insurance.length ? `; accepts ${list(insurance)}` : "";
  return `${careCopy} in ${provider.city}, ${provider.state}${insuranceCopy}.`;
}
