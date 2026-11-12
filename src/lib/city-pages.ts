import { states, type State } from "@/lib/content";

// Care types that get their own city landing page. Each maps to the search
// filter that selects matching listings.
export type CityCareType = {
  slug: string;
  label: string;          // "Sober Living Homes"
  short: string;          // "sober living"
  singular: string;       // "sober living home"
  category?: string;      // providers.categories value
  levels?: string[];      // providers.levels_of_care / treatment_types values
  intro: string;
  questions: { question: string; answer: string }[];
};

export const cityCareTypes: CityCareType[] = [
  {
    slug: "sober-living",
    label: "Sober Living Homes",
    short: "sober living",
    singular: "sober living home",
    category: "Sober Living",
    intro: "Sober living homes are structured, substance-free residences for people moving from treatment back to independent life. Residents usually pay rent, follow house rules such as curfews and drug testing, and attend outside treatment or recovery meetings.",
    questions: [
      { question: "What is a sober living home?", answer: "A sober living home is a shared residence where everyone agrees to stay alcohol- and drug-free. Homes set rules such as curfews, chores, drug testing, and meeting attendance, and most expect residents to work, study, or attend outpatient treatment." },
      { question: "How much does sober living cost?", answer: "Most sober living homes charge weekly or monthly rent that covers a shared room and utilities. Costs vary widely by city, room type, and staffing. Insurance usually does not cover rent at a sober living home, but it may cover outpatient treatment attended while living there." },
      { question: "How do I choose a sober living home?", answer: "Ask about house rules, staffing, drug-testing policy, resident rights, fees and refunds, and whether the home is certified by a state recovery-residence program or a group such as NARR. Visit if you can, and confirm how the home handles relapse." },
    ],
  },
  {
    slug: "iop",
    label: "Intensive Outpatient Programs (IOP)",
    short: "IOP",
    singular: "intensive outpatient program",
    levels: ["Intensive outpatient program (IOP)", "Intensive Outpatient Program"],
    intro: "Intensive outpatient programs (IOPs) provide several hours of structured treatment a few days each week while you keep living at home. They suit people who need more support than weekly therapy but do not need 24-hour care.",
    questions: [
      { question: "What is an intensive outpatient program?", answer: "An IOP is a structured addiction or mental health program that typically meets about 9 to 20 hours a week, often in three-hour sessions several days a week. It combines group therapy, individual counseling, education, and relapse-prevention planning." },
      { question: "Is IOP covered by insurance?", answer: "Many private plans, Medicaid, and Medicare cover intensive outpatient treatment when it is medically necessary. Coverage, prior authorization, and out-of-pocket costs vary by plan, so confirm benefits with your insurer and the program before starting." },
      { question: "How is IOP different from PHP?", answer: "A partial hospitalization program (PHP) usually runs most of the day, five or more days a week. An IOP takes fewer hours, so it is easier to combine with work, school, or family responsibilities. Many people step down from PHP to IOP." },
    ],
  },
  {
    slug: "detox",
    label: "Detox Centers",
    short: "detox",
    singular: "detox center",
    category: "Medical Detox",
    intro: "Detox centers provide clinically supervised withdrawal management. Withdrawal from alcohol, benzodiazepines, and opioids can be medically serious, so detox focuses on safety, symptom relief, and a plan for ongoing treatment afterward.",
    questions: [
      { question: "What happens in medical detox?", answer: "Medical detox includes an assessment, monitoring of vital signs and withdrawal symptoms, and medications when appropriate to keep withdrawal safe and more comfortable. Good programs also plan the next level of care before discharge." },
      { question: "How long does detox take?", answer: "Detox commonly lasts several days to about a week, depending on the substance, how long and how much it was used, and a person's health. Some withdrawal symptoms can continue longer, which is why follow-up treatment matters." },
      { question: "Does insurance cover detox?", answer: "Medical detox is generally covered by private insurance, Medicaid, and Medicare when it is medically necessary. Ask the center whether it is in network with your plan and what your share of the cost will be." },
    ],
  },
];

// Wave 1: city x care pages that are indexed and listed in the sitemap.
// Chosen from Semrush keyword difficulty <= 40 and 10+ published listings
// (TreatmentLane SEO Master Plan, Nov 2026). Other combinations still render
// for visitors but stay out of the index until they join a wave.
export const indexedCityCarePages: { state: string; city: string; care: string }[] = [
  ["CA", "Los Angeles", "sober-living"], ["AZ", "Phoenix", "sober-living"], ["TX", "Austin", "sober-living"],
  ["CA", "San Diego", "sober-living"], ["TX", "Dallas", "sober-living"], ["TX", "Houston", "sober-living"],
  ["CA", "Los Angeles", "iop"], ["TN", "Nashville", "sober-living"], ["NY", "New York City", "sober-living"],
  ["UT", "Salt Lake City", "sober-living"], ["AZ", "Phoenix", "detox"], ["CO", "Denver", "detox"],
  ["IL", "Chicago", "sober-living"], ["TX", "Houston", "iop"], ["CA", "San Diego", "iop"],
  ["GA", "Atlanta", "iop"], ["TX", "Dallas", "iop"], ["TX", "Houston", "detox"],
  ["TX", "Austin", "detox"], ["PA", "Philadelphia", "sober-living"], ["TX", "Austin", "iop"],
  ["IL", "Chicago", "iop"], ["MD", "Baltimore", "sober-living"], ["MN", "Minneapolis", "sober-living"],
  ["CO", "Denver", "iop"], ["TN", "Nashville", "iop"], ["MN", "Minneapolis", "detox"],
  ["UT", "Salt Lake City", "detox"], ["MA", "Boston", "iop"], ["PA", "Philadelphia", "iop"],
  ["FL", "Miami", "detox"], ["PA", "Philadelphia", "detox"], ["WA", "Seattle", "detox"],
  ["IL", "Chicago", "detox"], ["IN", "Indianapolis", "iop"], ["WA", "Seattle", "iop"],
].map(([state, city, care]) => ({ state, city, care }));

// City pages are indexed when the city has at least this many listings.
export const CITY_INDEX_MIN_LISTINGS = 25;
// City x care pages need at least this many listings to render as a page at all.
export const CITY_CARE_MIN_LISTINGS = 3;

export function citySlug(city: string) {
  return city.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Old city slugs that were merged into one spelling in the database on 2026-11-12
 * ("St. Louis" / "St Louis" -> "Saint Louis", "New York" -> "New York City",
 * "Washington DC" -> "Washington"). Returns the slug to redirect to, or null.
 */
export function cityAliasSlug(stateCode: string, slug: string): string | null {
  if (stateCode === "NY" && slug === "new-york") return "new-york-city";
  if (stateCode === "DC" && slug === "washington-dc") return "washington";
  if (slug.startsWith("st-")) return `saint-${slug.slice(3)}`;
  return null;
}

export function stateBySlug(slug: string): State | undefined {
  return states.find((state) => state.slug === slug);
}

export function stateByCode(code: string): State | undefined {
  return states.find((state) => state.code === code);
}

export function careTypeBySlug(slug: string) {
  return cityCareTypes.find((type) => type.slug === slug);
}

export function cityPath(state: State, city: string) {
  return `/locations/${state.slug}/${citySlug(city)}`;
}

export function cityCarePath(state: State, city: string, careSlug: string) {
  return `${cityPath(state, city)}/${careSlug}`;
}

export function isIndexedCityCarePage(stateCode: string, city: string, careSlug: string) {
  return indexedCityCarePages.some((page) => page.state === stateCode && page.city === city && page.care === careSlug);
}

export function careSearchFilter(type: CityCareType) {
  return type.category ? { category: type.category } : { levels: type.levels };
}
