import { inferredCity } from "@/lib/places";

/** Exact legal/brand spellings. Keys are compared case-insensitively. */
const BRAND_DISPLAY_NAMES = ["LifeStance Health"];

export function providerDisplayName(name: string) {
  const trimmed = name.trim().replace(/\s+/g, " ");
  return BRAND_DISPLAY_NAMES.find((brand) => brand.toLowerCase() === trimmed.toLowerCase()) || trimmed;
}

/** "as a outpatient" -> "as an outpatient". Leaves "as a residential" unchanged. */
export function fixIndefiniteArticles(value: string) {
  return value.replace(/\b([Aa]s) a (?=[aeiouAEIOU])/g, "$1 an ");
}

export function isTemplateDescription(description: string | null | undefined) {
  if (!description) return true;
  return / is listed in [\s\S]+ as an? [\s\S]+ resource\./.test(description)
    && description.includes("Contact the organization directly to confirm current services");
}

export function clampMetaDescription(value: string, maxLength = 160) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const sentences = text.split(/(?<=[.!?])\s+/);
  let built = "";
  for (const sentence of sentences) {
    const next = built ? `${built} ${sentence}` : sentence;
    if (next.length > maxLength) break;
    built = next;
  }
  if (built.length >= 80) return built;
  const slice = text.slice(0, maxLength + 1);
  const boundary = slice.lastIndexOf(" ");
  return (boundary > maxLength * 0.6 ? slice.slice(0, boundary) : text.slice(0, maxLength))
    .trim()
    .replace(/[,:;]+$/g, "");
}

type TitleProvider = {
  name: string;
  city: string;
  state: string;
  address: string | null;
};

export function providerLocationLabel(provider: Pick<TitleProvider, "city" | "state" | "address">) {
  return `${inferredCity(provider.address, provider.city)}, ${provider.state}`;
}

/** Layout title template appends " | TreatmentLane". No street address and no manual ellipsis. */
export function getProviderSeoTitle(provider: TitleProvider) {
  const name = providerDisplayName(provider.name);
  return `${name} ${providerLocationLabel(provider)}: Insurance, Services & Phone`;
}

export function getOrganizationSeoTitle(name: string) {
  return `${providerDisplayName(name)}: Locations, Insurance & Services`;
}

type DescriptionProvider = TitleProvider & {
  phone: string | null;
  levelsOfCare: string[];
  treatmentTypes: string[];
  insurance: string[];
};

function unique(values: string[]) {
  return values.filter((item, index) => item && values.indexOf(item) === index);
}

export function getProviderSeoDescription(provider: DescriptionProvider) {
  const name = providerDisplayName(provider.name);
  const place = providerLocationLabel(provider);
  const care = unique([...provider.levelsOfCare, ...provider.treatmentTypes]).slice(0, 2);
  const insurers = unique(provider.insurance).slice(0, 3);
  const parts = [`${name} in ${place}.`];
  if (care.length) parts.push(`Care: ${care.join(", ")}.`);
  if (insurers.length) parts.push(`Insurance: ${insurers.join(", ")}.`);
  if (provider.phone) parts.push(`Phone ${provider.phone}.`);
  parts.push("Confirm services and cost directly.");
  return clampMetaDescription(parts.join(" "));
}

export function getOrganizationSeoDescription(name: string, locationCount: number) {
  const label = providerDisplayName(name);
  return clampMetaDescription(
    `Compare ${locationCount.toLocaleString("en-US")} ${label} locations, including services, insurance, phone numbers, and addresses on TreatmentLane.`,
  );
}

type OverviewProvider = DescriptionProvider & {
  description: string | null;
  categories: string[];
  therapies: string[];
  specialties: string[];
  amenities: string[];
  licenseSummary: string | null;
  accreditation: string[];
  priceRange: string | null;
  treatmentDuration: string | null;
  website: string | null;
};

export function providerOverviewCopy(provider: OverviewProvider) {
  if (provider.description && !isTemplateDescription(provider.description)) {
    return fixIndefiniteArticles(provider.description.trim());
  }
  const name = providerDisplayName(provider.name);
  const place = providerLocationLabel(provider);
  const care = unique([...provider.levelsOfCare, ...provider.treatmentTypes, ...provider.categories]).slice(0, 4);
  const parts = [`${name} is listed in ${place}.`];
  if (care.length) parts.push(`Listed services include ${care.join(", ")}.`);
  if (provider.therapies.length) parts.push(`Mentioned approaches include ${provider.therapies.slice(0, 3).join(", ")}.`);
  if (provider.specialties.length) parts.push(`Populations or specialties include ${provider.specialties.slice(0, 3).join(", ")}.`);
  if (provider.insurance.length) parts.push(`Source data names ${provider.insurance.slice(0, 4).join(", ")} for insurance or payment.`);
  if (provider.amenities.length) parts.push(`Listed facility features include ${provider.amenities.slice(0, 3).join(", ")}.`);
  if (provider.treatmentDuration) parts.push(`Typical duration in the source data: ${provider.treatmentDuration}.`);
  if (provider.priceRange) parts.push(`Source price information: ${provider.priceRange}.`);
  if (provider.licenseSummary) parts.push(provider.licenseSummary);
  else if (provider.accreditation.length) parts.push(`Accreditation listed: ${provider.accreditation.join(", ")}.`);
  if (provider.phone) parts.push(`Listed phone: ${provider.phone}.`);
  parts.push("Confirm current services, eligibility, insurance, cost, and licensing with the organization.");
  return parts.join(" ");
}

export function providerCardSummary(provider: Pick<OverviewProvider, "levelsOfCare" | "treatmentTypes" | "categories" | "insurance" | "phone" | "description">) {
  if (provider.description && !isTemplateDescription(provider.description)) {
    const custom = fixIndefiniteArticles(provider.description.trim());
    return custom.length > 180 ? `${custom.slice(0, 177).replace(/\s+\S*$/, "")}` : custom;
  }
  const care = unique([...provider.levelsOfCare, ...provider.treatmentTypes, ...provider.categories]).slice(0, 2);
  const bits: string[] = [];
  if (care.length) bits.push(care.join(" and "));
  if (provider.insurance.length) bits.push(`Insurance: ${provider.insurance.slice(0, 2).join(", ")}`);
  if (provider.phone) bits.push(provider.phone);
  return bits.join(" · ") || "View services, contact details, and source information.";
}

export type ProviderFaqItem = { question: string; answer: string };

/** Questions answered only with fields already stored on the listing or counted on the page. */
export function providerFaq(provider: OverviewProvider, context: { cityName: string; stateName: string | null; nearbyCount: number }): ProviderFaqItem[] {
  const name = providerDisplayName(provider.name);
  const place = providerLocationLabel(provider);
  const care = unique([...provider.levelsOfCare, ...provider.treatmentTypes, ...provider.categories]).slice(0, 6);
  const items: ProviderFaqItem[] = [{
    question: `Where is ${name} listed?`,
    answer: provider.address ? `${name} is listed at ${provider.address}, ${place}.` : `${name} is listed in ${place}.`,
  }];
  if (care.length) items.push({ question: `What care is listed for ${name}?`, answer: `Published source data lists ${care.join(", ")}.` });
  if (provider.insurance.length) items.push({ question: `Which insurance or payment options are listed for ${name}?`, answer: `Source data names ${provider.insurance.slice(0, 8).join(", ")}.` });
  if (provider.phone) items.push({ question: `What phone number is listed for ${name}?`, answer: `The published phone number is ${provider.phone}.` });
  if (context.nearbyCount > 0) {
    const where = context.stateName ? `${context.cityName}, ${context.stateName}` : context.cityName;
    items.push({
      question: `Are other providers listed in ${context.cityName}?`,
      answer: `This page links to ${context.nearbyCount} other published ${context.nearbyCount === 1 ? "provider" : "providers"} in ${where}.`,
    });
  }
  return items;
}
