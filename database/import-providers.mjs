import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";
import zipcodes from "zipcodes";

const args = new Set(process.argv.slice(2));
const commit = args.has("--commit");
const root = process.cwd();
const masterPath = resolve(root, process.env.MASTER_CSV || "work/data/atc-usa-master.csv");
const recoveryPath = resolve(root, process.env.RECOVERY_CSV || "work/data/recovery-centers-usa.csv");

const US_REGIONS = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
  "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY", "AS", "GU", "MP", "PR", "VI",
]);
const STATE_NAMES = new Map(Object.entries({
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT",
  Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA",
  Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA",
  Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY", "American Samoa": "AS", Guam: "GU",
  "Northern Mariana Islands": "MP", "Puerto Rico": "PR", "U.S. Virgin Islands": "VI",
}).map(([name, code]) => [name.toLowerCase(), code]));

const clean = (value) => String(value || "").replaceAll("\u2014", "-").trim();
const normalized = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const zip5 = (value) => clean(value).match(/\b\d{5}\b/)?.[0] || "";
const recoveryZip = (value) => {
  const digits = clean(value).replace(/\D/g, "");
  return digits.length === 4 ? `0${digits}` : digits.slice(0, 5);
};
const phoneDigits = (value) => clean(value).replace(/\D/g, "").slice(-10);
const hash = (value) => createHash("sha256").update(value).digest("hex");
const unique = (values) => [...new Set(values.filter(Boolean))];
const pgArray = (values) => `{${values.map((value) => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`).join(",")}}`;

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 92) || "provider";
}

function safeUrl(value) {
  try {
    const url = new URL(clean(value));
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

function recoveryLocation(row) {
  const address = clean(row.street_address);
  const fieldState = clean(row.state);
  let state = US_REGIONS.has(fieldState.toUpperCase()) ? fieldState.toUpperCase() : STATE_NAMES.get(fieldState.toLowerCase()) || "";
  const postalCode = recoveryZip(row.zip_code) || address.match(/\b\d{5}\b/)?.[0] || "";
  const zipMatch = postalCode ? zipcodes.lookup(postalCode) : null;
  if (!state && zipMatch && US_REGIONS.has(zipMatch.state)) state = zipMatch.state;
  if (!state) {
    const codeMatch = address.toUpperCase().match(/(?:,|\s)\s*(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|AS|GU|MP|PR|VI)(?:\s+\d{4,5})?\s*$/);
    state = codeMatch?.[1] || "";
  }
  if (!state) {
    for (const [name, code] of STATE_NAMES) if (address.toLowerCase().includes(name)) { state = code; break; }
  }
  const country = clean(row.country).toUpperCase();
  const isUS = country === "US" || Boolean(state) || /\bunited states\b/i.test(address) || Boolean(zipMatch?.country === "US");
  const city = clean(row.city) || clean(zipMatch?.city);
  return { isUS, state, city, postalCode, address };
}

function recoveryCategories(row) {
  const text = [row.name, row.treatment_type, row.levels_of_care, row.listing_url].join(" ").toLowerCase();
  const values = [];
  if (/residential|inpatient|treatment.center|rehab/.test(text)) values.push("Treatment Centers");
  if (/detox|withdrawal/.test(text)) values.push("Medical Detox");
  if (/outpatient|day.treatment|partial.hospital|virtual|telehealth/.test(text)) values.push("Outpatient Programs");
  if (/therap|counsel/.test(text)) values.push("Counseling & Therapy");
  if (/sober.living|recovery.home/.test(text)) values.push("Sober Living");
  if (/mental.health|psychiatr/.test(text)) values.push("Mental Health Services");
  return unique(values);
}

const TITLE_REPLACEMENTS = new Map([
  ["1 on 1 counseling", "Individual counseling"], ["mat", "Medication-assisted treatment (MAT)"],
  ["iop", "Intensive outpatient program (IOP)"], ["php", "Partial hospitalization program (PHP)"],
]);

function titleLabel(value) {
  const label = clean(value).replaceAll("_", " ").replaceAll("-", " ").replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
  return TITLE_REPLACEMENTS.get(label.toLowerCase()) || label;
}

function parseListSentence(value, prefixPattern) {
  let text = clean(value).replace(prefixPattern, "").replace(/[.]$/, "");
  text = text.replace(/\s+(?:and\s+)?more$/i, "");
  return unique(text.split(/\s*,\s*|\s+and\s+/i).map(titleLabel).filter((item) => item && item.toLowerCase() !== "more"));
}

function recoveryTypes(row) {
  const types = [];
  const direct = clean(row.treatment_type);
  if (direct) types.push(titleLabel(direct));
  types.push(...parseListSentence(row.levels_of_care, /^.*?\bprovides\s+/i));
  return unique(types);
}

function recoveryTherapies(row) {
  return parseListSentence(row.therapies, /^the following therapies are included:\s*/i);
}

const INSURANCE_PATTERNS = [
  ["Blue Cross Blue Shield", /blue cross|blue shield|\bbcbs\b/i], ["UnitedHealthcare", /united\s*health|unitedhealthcare|\buhc\b/i],
  ["Aetna", /\baetna\b/i], ["Anthem", /\banthem\b/i], ["Cigna", /\bcigna\b/i], ["Humana", /\bhumana\b/i],
  ["Kaiser Permanente", /\bkaiser\b/i], ["Molina Healthcare", /\bmolina\b/i], ["WellCare", /\bwellcare\b/i],
  ["CareSource", /\bcaresource\b/i], ["Amerigroup", /\bamerigroup\b/i], ["Optum", /\boptum\b/i],
  ["Magellan", /\bmagellan\b/i], ["Beacon Health Options", /\bbeacon\b/i], ["Health Net", /\bhealth\s*net\b/i],
  ["Highmark", /\bhighmark\b/i], ["Ambetter", /\bambetter\b/i], ["Oscar Health", /\boscar\b/i],
  ["Oxford Health", /\boxford\b/i], ["UMR", /\bumr\b/i], ["GEHA", /\bgeha\b/i], ["ComPsych", /\bcompsych\b/i],
  ["EmblemHealth", /\bemblem/i], ["Fidelis Care", /\bfidelis\b/i], ["Passport Health Plan", /\bpassport\b/i],
  ["Medicare", /\bmedicare\b/i], ["Medicaid", /\bmedicaid\b/i], ["Medi-Cal", /\bmedi[ -]?cal\b/i],
  ["TRICARE", /\btricare\b/i], ["VA Community Care", /\bva\s+(?:ccn|community care)\b/i],
  ["Private insurance", /private|commercial insurance|major insurance/i], ["Cash or self-pay", /cash|self[- ]pay/i],
];

function recoveryInsurance(row) {
  const text = clean(row.insurance);
  return unique(INSURANCE_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label));
}

function usefulInsuranceDetails(row) {
  const text = clean(row.insurance);
  if (!text || /admissions team will work with you to explore|please (?:call|contact).*insurance|we accept insurance\.?$/i.test(text)) return null;
  return recoveryInsurance(row).length ? text : null;
}

const AMENITY_PATTERNS = [
  ["Private rooms", /private (?:room|suite|accommodation)/i], ["Semi-private rooms", /semi[- ]private/i],
  ["Luxury accommodations", /luxury|hotel[- ](?:style|like)|upscale/i], ["Swimming pool", /\bpool\b|swimming/i],
  ["Fitness center", /fitness (?:center|facility)|\bgym\b/i], ["Spa", /\bspa\b/i], ["Sauna", /\bsauna\b/i],
  ["Chef-prepared meals", /chef[- ]prepared|private chef|gourmet meal/i],
  ["Outdoor spaces", /outdoor (?:space|area)|gardens?|walking trails?|nature setting/i],
  ["Beach or waterfront access", /beach|oceanfront|waterfront/i], ["Pet friendly", /pet[- ]friendly|pets allowed/i],
  ["Transportation assistance", /transportation (?:assistance|services?)|airport (?:pickup|transfer)/i],
];

function recoveryAmenities(row) {
  const text = clean(row.description);
  return AMENITY_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

const RECOVERY_BRANDED_IMAGE = "og-image-recovery-com.jpg";
const TREATMENTLANE_BRANDED_IMAGE = "https://images.treatmentlane.com/brand/treatmentlane-listing-placeholder.webp";

function cleanImages(row) {
  const candidates = [row.featured_image, ...clean(row.all_images).split(/\s*\|\s*/)].map((value) => clean(value).replace(/\\$/, ""));
  const used = new Set();
  const images = [];
  for (const candidate of candidates) {
    if (!candidate.startsWith("https://res.cloudinary.com/rehabpath/image/upload/")) continue;
    if (/\.svg(?:\?|$)|h_48,w_48|e_trim:10/i.test(candidate)) continue;
    const assetKey = candidate.split("?")[0].split("/").at(-1)?.replace(/\.[^.]+$/, "");
    if (!assetKey || used.has(assetKey)) continue;
    used.add(assetKey);
    images.push(candidate.split("?")[0].split("/").at(-1) === RECOVERY_BRANDED_IMAGE ? TREATMENTLANE_BRANDED_IMAGE : candidate);
    if (images.length === 8) break;
  }
  return images;
}

const SPECIALTY_LABELS = new Map([
  ["dual diagnosis", "Co-occurring mental health and substance use"], ["detox focused", "Detox-focused"],
  ["mental health treatment", "Mental health treatment"], ["substance use treatment", "Substance use treatment"],
  ["mat capable", "Medication-assisted treatment"], ["telehealth friendly", "Telehealth available"],
  ["adolescent", "Adolescents"], ["teen", "Teens"], ["veteran", "Veterans"], ["luxury", "Luxury setting"],
]);

function specialtiesFor(masterRow, recoveryRow) {
  const tags = [clean(masterRow?.["Service Specialty Tags"]), clean(masterRow?.["Best For Tags Str"])].join("|")
    .split("|").map(normalized).filter(Boolean);
  const recoveryText = [recoveryRow?.description, recoveryRow?.levels_of_care].join(" ").toLowerCase();
  if (/co-occurring|dual diagnosis/.test(recoveryText)) tags.push("dual diagnosis");
  if (/adolescen|\bteen/.test(recoveryText)) tags.push("adolescent");
  return unique(tags.map((tag) => SPECIALTY_LABELS.get(tag) || titleLabel(tag))).slice(0, 16);
}

function samhsaTherapies(row) {
  const text = clean(row["Samhsa Service Codes Named"]);
  const mappings = [
    ["Cognitive behavioral therapy (CBT)", /\bCBT\b|cognitive behavioral/i], ["Dialectical behavior therapy (DBT)", /\bDBT\b|dialectical behavior/i],
    ["Family therapy / psychoeducation", /family psychoeducation|family therap/i], ["Group therapy", /\bGT\b|group therap/i],
    ["Individual counseling", /individual counsel/i], ["Motivational interviewing", /motivational interviewing/i],
    ["Trauma-focused care", /trauma|\bPTSD\b/i], ["EMDR", /\bEMDR\b/i], ["Peer support", /\bPEER\b|peer support/i],
    ["Medication-assisted treatment (MAT)", /buprenorphine|methadone|naltrexone|medication-assisted/i],
  ];
  return mappings.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function detailsFromRecovery(row) {
  const images = row ? cleanImages(row) : [];
  const duration = clean(row?.treatment_duration).replace(/^the typical length is\s*/i, "").replace(/[.]$/, "");
  const ratingValue = Number.parseFloat(clean(row?.rating_value));
  const ratingCount = Number.parseInt(clean(row?.rating_count), 10);
  return {
    images, treatmentTypes: row ? recoveryTypes(row) : [], therapies: row ? recoveryTherapies(row) : [],
    amenities: row ? recoveryAmenities(row) : [], insurance: row ? recoveryInsurance(row) : [],
    insuranceDetails: row ? usefulInsuranceDetails(row) : null, priceRange: clean(row?.price_range) || null,
    treatmentDuration: duration && duration.toLowerCase() !== "various" ? duration : null,
    ratingValue: Number.isFinite(ratingValue) ? ratingValue : null, ratingCount: Number.isFinite(ratingCount) ? ratingCount : null,
  };
}

function publicDescription(name, city, state, treatmentTypes, levels, therapies) {
  const typeText = treatmentTypes.slice(0, 2).join(" and ").toLowerCase();
  const levelText = levels.slice(0, 3).join(", ").toLowerCase();
  const therapyText = therapies.slice(0, 2).join(" and ").toLowerCase();
  return `${name} is listed in ${city}, ${state}${typeText ? ` as a ${typeText} resource` : " as a behavioral health, treatment, or recovery resource"}.` +
    `${levelText ? ` Source data includes ${levelText}.` : ""}${therapyText ? ` Mentioned approaches include ${therapyText}.` : ""}` +
    " Contact the organization directly to confirm current services, eligibility, availability, cost, and licensing.";
}

function evidenceScoreFor(provider) {
  let score = 0;
  const sourceCount = Number(provider.sourceData?.masterRows?.[0]?.["Source Count"] || 0);
  if (/\bSAMHSA\b/i.test(provider.sourceNotes || "")) score += 30;
  if (sourceCount >= 2) score += 10;
  if (provider.address) score += 5;
  if (provider.phone) score += 5;
  if (provider.sourceUrl) score += 5;
  if (provider.treatmentTypes.length) score += 10;
  if (provider.therapies.length) score += 5;
  if (provider.specialties.length) score += 5;
  if (provider.insurance.length || provider.insuranceDetails) score += 5;
  if (provider.featuredImageUrl) score += 5;
  if (provider.priceRange || provider.treatmentDuration || provider.amenities.length) score += 5;
  if (provider.ratingValue !== null && provider.ratingCount) {
    const adjustedRating = (provider.ratingCount / (provider.ratingCount + 25)) * provider.ratingValue +
      (25 / (provider.ratingCount + 25)) * 4;
    score += Math.round((adjustedRating / 5) * 10);
  }
  return Math.min(score, 100);
}

function assignCanonicalFields(items) {
  const organizationNames = new Map();
  for (const provider of items) {
    const nameKey = normalized(provider.name);
    let organizationSlug = slugify(provider.name);
    const existingName = organizationNames.get(organizationSlug);
    if (existingName && existingName !== nameKey) organizationSlug = `${organizationSlug.slice(0, 84)}-${hash(nameKey).slice(0, 7)}`;
    organizationNames.set(organizationSlug, nameKey);
    provider.organizationSlug = organizationSlug;
  }

  const organizations = new Map();
  for (const provider of items) {
    const group = organizations.get(provider.organizationSlug) || [];
    group.push(provider);
    organizations.set(provider.organizationSlug, group);
  }

  for (const group of organizations.values()) {
    const cityCounts = new Map();
    const cityStateCounts = new Map();
    const cityStateZipCounts = new Map();
    for (const provider of group) {
      const city = slugify(provider.city);
      const cityState = slugify(`${provider.city}-${provider.state}`);
      const cityStateZip = slugify(`${provider.city}-${provider.state}-${provider.postalCode || "location"}`);
      cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
      cityStateCounts.set(cityState, (cityStateCounts.get(cityState) || 0) + 1);
      cityStateZipCounts.set(cityStateZip, (cityStateZipCounts.get(cityStateZip) || 0) + 1);
    }
    const used = new Set();
    for (const provider of group) {
      const city = slugify(provider.city);
      const cityState = slugify(`${provider.city}-${provider.state}`);
      const cityStateZip = slugify(`${provider.city}-${provider.state}-${provider.postalCode || "location"}`);
      let locationSlug = cityCounts.get(city) === 1 ? city : cityState;
      if (cityStateCounts.get(cityState) > 1) locationSlug = cityStateZip;
      if (cityStateZipCounts.get(cityStateZip) > 1 || used.has(locationSlug)) {
        locationSlug = `${locationSlug.slice(0, 84)}-${hash(provider.sourceKey).slice(0, 7)}`;
      }
      used.add(locationSlug);
      provider.locationSlug = locationSlug;
      provider.evidenceScore = evidenceScoreFor(provider);
    }
  }
}

function inferredState(row, recoveryByUrl, stateMaps) {
  const direct = clean(row.State).toUpperCase();
  if (US_REGIONS.has(direct)) return direct;
  const fromRecovery = recoveryByUrl.get(clean(row["Listing Url"]).replace(/\/$/, ""))?.state?.toUpperCase();
  if (US_REGIONS.has(fromRecovery)) return fromRecovery;
  const postalCode = zip5(row.Zip);
  if (stateMaps.byZip.has(postalCode)) return stateMaps.byZip.get(postalCode);
  const lookup = zipcodes.lookup(postalCode);
  if (lookup && US_REGIONS.has(lookup.state)) return lookup.state;
  if (stateMaps.byPrefix.has(postalCode.slice(0, 3))) return stateMaps.byPrefix.get(postalCode.slice(0, 3));
  if (stateMaps.byCity.has(normalized(row.City))) return stateMaps.byCity.get(normalized(row.City));
  return "";
}

function categoriesFor(row) {
  const text = [row["Service Specialty Tags"], row["Recovery Url Type"], row["Samhsa Service Codes Named"]].join(" ").toLowerCase();
  const values = [];
  if (/residential|inpatient|hospital/.test(text)) values.push("Treatment Centers");
  if (/detox|withdrawal/.test(text)) values.push("Medical Detox");
  if (/outpatient|day.treatment|partial.hospital|telehealth|virtual/.test(text)) values.push("Outpatient Programs");
  if (/therap|counsel/.test(text)) values.push("Counseling & Therapy");
  if (/sober.living|recovery.home|transitional.housing/.test(text)) values.push("Sober Living");
  if (clean(row["Samhsa In Mh"]) === "Y" || /mental.health|psychiatr/.test(text)) values.push("Mental Health Services");
  if (/case.management|peer.support|recovery.coach|employment/.test(text)) values.push("Recovery Support");
  return unique(values);
}

function levelsFor(row) {
  const text = [row["Service Specialty Tags"], row["Recovery Url Type"], row["Samhsa Service Codes Named"]].join(" ").toLowerCase();
  const values = [];
  if (/withdrawal|detox/.test(text)) values.push("Withdrawal management / detox");
  if (/residential|inpatient/.test(text)) values.push("Residential treatment");
  if (/partial.hospital|day.treatment/.test(text)) values.push("Partial hospitalization / day treatment");
  if (/intensive.outpatient/.test(text)) values.push("Intensive outpatient program (IOP)");
  if (/outpatient/.test(text)) values.push("Outpatient treatment");
  if (/hospital/.test(text)) values.push("Hospital-based care");
  if (/sober.living|recovery.home/.test(text)) values.push("Sober living");
  if (/telehealth|virtual/.test(text)) values.push("Virtual / telehealth");
  return unique(values);
}

function insuranceFor(row) {
  const text = clean(row["Samhsa Service Codes Named"]).toLowerCase();
  const values = [];
  if (/\bmedicare\b/.test(text)) values.push("Medicare");
  if (/\bmedicaid\b/.test(text)) values.push("Medicaid");
  if (/private insurance/.test(text)) values.push("Private insurance");
  if (/\btricare\b/.test(text)) values.push("TRICARE");
  if (/state.financed/.test(text)) values.push("State-financed health insurance");
  if (/cash|self.pay/.test(text)) values.push("Cash or self-pay");
  return unique(values);
}

function mergeRows(rows) {
  if (rows.length === 1) return rows[0];
  const ranked = [...rows].sort((a, b) => Number(b["Source Count"] || 0) - Number(a["Source Count"] || 0));
  const result = { ...ranked[0] };
  for (const row of ranked.slice(1)) {
    for (const [key, value] of Object.entries(row)) if (!clean(result[key]) && clean(value)) result[key] = value;
  }
  return result;
}

const [masterText, recoveryText] = await Promise.all([readFile(masterPath, "utf8"), readFile(recoveryPath, "utf8")]);
const masterRows = parse(masterText, { columns: true, bom: true, skip_empty_lines: true, relax_column_count: true });
const recoveryRows = parse(recoveryText, { columns: true, bom: true, skip_empty_lines: true, relax_column_count: true });
const recoveryByUrl = new Map(recoveryRows.map((row) => [clean(row.listing_url).replace(/\/$/, ""), row]).filter(([url]) => url));
const recoveryRowNumberByUrl = new Map(recoveryRows.map((row, index) => [clean(row.listing_url).replace(/\/$/, ""), index + 2]).filter(([url]) => url));

const zipSets = new Map();
const prefixSets = new Map();
const citySets = new Map();
function addState(map, key, state) {
  if (!key || !US_REGIONS.has(state)) return;
  const values = map.get(key) || new Set();
  values.add(state);
  map.set(key, values);
}
for (const row of masterRows) {
  const state = clean(row.State).toUpperCase();
  const postalCode = zip5(row.Zip);
  addState(zipSets, postalCode, state);
  addState(prefixSets, postalCode.slice(0, 3), state);
  addState(citySets, normalized(row.City), state);
}
for (const row of recoveryRows) {
  const state = clean(row.state).toUpperCase();
  const postalCode = zip5(row.zip_code);
  addState(zipSets, postalCode, state);
  addState(prefixSets, postalCode.slice(0, 3), state);
  addState(citySets, normalized(row.city), state);
}
const singles = (map) => new Map([...map].filter(([, values]) => values.size === 1).map(([key, values]) => [key, [...values][0]]));
const stateMaps = { byZip: singles(zipSets), byPrefix: singles(prefixSets), byCity: singles(citySets) };

const prepared = [];
const rejected = [];
for (let index = 0; index < masterRows.length; index += 1) {
  const row = masterRows[index];
  const state = inferredState(row, recoveryByUrl, stateMaps);
  const name = clean(row.Name);
  const city = clean(row.City);
  const postalCode = zip5(row.Zip);
  if (!name || !city || !state) {
    rejected.push({ row: index + 2, name, city, state, postalCode, reason: "Missing a publishable U.S. identity or location" });
    continue;
  }
  const address = clean(row.Street);
  const listingUrl = safeUrl(row["Listing Url"]);
  const identity = address
    ? [normalized(name), normalized(address), normalized(city), state, postalCode].join("|")
    : [normalized(name), normalized(city), state, postalCode, phoneDigits(row["Phone E164"] || row.Phone), listingUrl || ""].join("|");
  prepared.push({ row, rowNumber: index + 2, state, name, city, postalCode, address, listingUrl, identity });
}

const groups = new Map();
for (const item of prepared) {
  const group = groups.get(item.identity) || [];
  group.push(item);
  groups.set(item.identity, group);
}

const usedSlugs = new Map();
const providers = [];
for (const [identity, items] of groups) {
  const row = mergeRows(items.map((item) => item.row));
  const first = items[0];
  const sourceKey = `atc-master:${hash(identity).slice(0, 32)}`;
  const baseSlug = slugify(`${first.name} ${first.city} ${first.state}`);
  let slug = baseSlug;
  if (usedSlugs.has(slug) && usedSlugs.get(slug) !== sourceKey) slug = slugify(`${baseSlug}-${first.postalCode || hash(identity).slice(0, 7)}`);
  if (usedSlugs.has(slug) && usedSlugs.get(slug) !== sourceKey) slug = `${slug.slice(0, 91)}-${hash(identity).slice(0, 7)}`;
  usedSlugs.set(slug, sourceKey);
  const recoveryKey = clean(row["Listing Url"]).replace(/\/$/, "");
  const recoveryRow = recoveryKey ? recoveryByUrl.get(recoveryKey) : null;
  const details = detailsFromRecovery(recoveryRow);
  const categories = categoriesFor(row);
  const levels = unique([...levelsFor(row), ...details.treatmentTypes.filter((type) => !["Residential", "Outpatient", "Hospital", "Detox", "Virtual", "Sober Living", "Recovery Coach", "Interventionist"].includes(type))]);
  const treatmentTypes = unique([...details.treatmentTypes, ...levelsFor(row)]);
  const therapies = unique([...details.therapies, ...samhsaTherapies(row)]);
  const insurance = unique([...insuranceFor(row), ...details.insurance]);
  const amenities = details.amenities;
  const specialties = specialtiesFor(row, recoveryRow);
  const sourceCount = clean(row["Source Count"]);
  const sourceNames = [clean(row["Samhsa In Su"]) === "Y" || clean(row["Samhsa In Mh"]) === "Y" ? "SAMHSA" : "", first.listingUrl ? "Recovery.com" : ""].filter(Boolean);
  const description = publicDescription(first.name, first.city, first.state, treatmentTypes, levels, therapies);
  const sourceNotes = `Imported from ATC USA Master v2. Sources represented: ${sourceNames.join(" and ") || "public directory data"}. Match classification: ${clean(row["Match Confidence"]) || "not recorded"}; source count: ${sourceCount || "not recorded"}. Contact and service details have not been independently verified by TreatmentLane.`;
  const rawRows = items.map((item) => ({ sheetRow: item.rowNumber, ...item.row }));
  const rawRecoveryRow = recoveryRow ? { sheetRow: recoveryRowNumberByUrl.get(recoveryKey), ...recoveryRow } : null;
  const sourceData = { masterRows: rawRows, ...(rawRecoveryRow ? { recoveryRow: rawRecoveryRow } : {}) };
  const fingerprint = hash(JSON.stringify(sourceData));
  providers.push({
    sourceKey, name: first.name, slug, description, address: first.address || null, city: first.city, state: first.state,
    postalCode: first.postalCode || null, phone: clean(row["Phone E164"] || row.Phone) || null, website: null,
    categories, levels, insurance, treatmentTypes, therapies, amenities, specialties,
    featuredImageUrl: details.images[0] || null, imageUrls: details.images, insuranceDetails: details.insuranceDetails,
    priceRange: details.priceRange, treatmentDuration: details.treatmentDuration,
    ratingValue: details.ratingValue, ratingCount: details.ratingCount,
    licenseSummary: null, accreditation: [], sourceUrl: first.listingUrl,
    sourceNotes, intakePhone: clean(row["Intake Phone"]) || null, latitude: Number(row.Latitude) || null,
    longitude: Number(row.Longitude) || null, sourceData, fingerprint,
  });
}

const recoveryUrlsInMaster = new Set(masterRows.map((row) => clean(row["Listing Url"]).replace(/\/$/, "")).filter(Boolean));
const supplementalCandidates = recoveryRows.filter((row) => !recoveryUrlsInMaster.has(clean(row.listing_url).replace(/\/$/, "")));
const namePhoneKeys = new Set(providers.filter((item) => phoneDigits(item.phone)).map((item) => `${normalized(item.name)}|${phoneDigits(item.phone)}`));
const namePlaceKeys = new Set(providers.map((item) => `${normalized(item.name)}|${normalized(item.city)}|${item.state}`));
const addressKeys = new Set(providers.filter((item) => item.address).map((item) => `${normalized(item.address)}|${normalized(item.city)}|${item.state}`));
let supplementalNonUs = 0;
let supplementalIncomplete = 0;
let supplementalDuplicates = 0;

for (let index = 0; index < supplementalCandidates.length; index += 1) {
  const row = supplementalCandidates[index];
  const location = recoveryLocation(row);
  if (!location.isUS) { supplementalNonUs += 1; continue; }
  const name = clean(row.name);
  if (!name || !location.city || !location.state) { supplementalIncomplete += 1; continue; }
  const phone = clean(row.phone) || null;
  const namePhoneKey = `${normalized(name)}|${phoneDigits(phone)}`;
  const namePlaceKey = `${normalized(name)}|${normalized(location.city)}|${location.state}`;
  const addressKey = `${normalized(location.address)}|${normalized(location.city)}|${location.state}`;
  if ((phoneDigits(phone) && namePhoneKeys.has(namePhoneKey)) || namePlaceKeys.has(namePlaceKey) || (location.address && addressKeys.has(addressKey))) {
    supplementalDuplicates += 1;
    continue;
  }
  const sourceUrl = safeUrl(row.listing_url);
  const identity = sourceUrl || [normalized(name), normalized(location.address), normalized(location.city), location.state, location.postalCode, phoneDigits(phone)].join("|");
  const sourceKey = `recovery-supplement:${hash(identity).slice(0, 32)}`;
  const baseSlug = slugify(`${name} ${location.city} ${location.state}`);
  let slug = baseSlug;
  if (usedSlugs.has(slug) && usedSlugs.get(slug) !== sourceKey) slug = slugify(`${baseSlug}-${location.postalCode || hash(identity).slice(0, 7)}`);
  if (usedSlugs.has(slug) && usedSlugs.get(slug) !== sourceKey) slug = `${slug.slice(0, 91)}-${hash(identity).slice(0, 7)}`;
  usedSlugs.set(slug, sourceKey);
  namePhoneKeys.add(namePhoneKey);
  namePlaceKeys.add(namePlaceKey);
  if (location.address) addressKeys.add(addressKey);
  const rawRow = { sheetRow: recoveryRowNumberByUrl.get(clean(row.listing_url).replace(/\/$/, "")), ...row };
  const details = detailsFromRecovery(row);
  const treatmentTypes = details.treatmentTypes;
  const levels = treatmentTypes.filter((type) => !["Residential", "Outpatient", "Hospital", "Detox", "Virtual", "Sober Living", "Recovery Coach", "Interventionist"].includes(type));
  const therapies = details.therapies;
  providers.push({
    sourceKey, name, slug,
    description: publicDescription(name, location.city, location.state, treatmentTypes, levels, therapies),
    address: location.address || null, city: location.city, state: location.state, postalCode: location.postalCode || null,
    phone, website: null, categories: recoveryCategories(row), levels, insurance: details.insurance,
    treatmentTypes, therapies, amenities: details.amenities, specialties: specialtiesFor(null, row),
    featuredImageUrl: details.images[0] || null, imageUrls: details.images, insuranceDetails: details.insuranceDetails,
    priceRange: details.priceRange, treatmentDuration: details.treatmentDuration,
    ratingValue: details.ratingValue, ratingCount: details.ratingCount, licenseSummary: null,
    accreditation: [], sourceUrl,
    sourceNotes: "Imported from the recovery_centers_usa source sheet as a U.S. location not already represented in the canonical Master sheet. Contact and service details have not been independently verified by TreatmentLane.",
    intakePhone: null, latitude: Number(row.latitude) || null, longitude: Number(row.longitude) || null,
    sourceData: { recoveryRow: rawRow }, fingerprint: hash(JSON.stringify(rawRow)),
  });
}

assignCanonicalFields(providers);

const canonicalPathCounts = new Map();
for (const provider of providers) {
  const path = `${provider.organizationSlug}/${provider.locationSlug}`;
  canonicalPathCounts.set(path, (canonicalPathCounts.get(path) || 0) + 1);
}
const canonicalPathConflicts = [...canonicalPathCounts].filter(([, count]) => count > 1);
if (canonicalPathConflicts.length) {
  throw new Error(`Canonical provider URL collision: ${JSON.stringify(canonicalPathConflicts.slice(0, 10))}`);
}

const duplicateGroups = [...groups.values()].filter((group) => group.length > 1);
const summary = {
  masterRows: masterRows.length,
  recoveryReferenceRows: recoveryRows.length,
  recoveryRowsRepresentedInMaster: [...recoveryByUrl.keys()].filter((url) => recoveryUrlsInMaster.has(url)).length,
  recoveryRowsExcludedFromCanonicalMaster: [...recoveryByUrl.keys()].filter((url) => !recoveryUrlsInMaster.has(url)).length,
  exactDuplicateGroupsMerged: duplicateGroups.length,
  exactDuplicateRowsMerged: duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0),
  supplementalRecoveryCandidates: supplementalCandidates.length,
  supplementalNonUsExcluded: supplementalNonUs,
  supplementalIncompleteExcluded: supplementalIncomplete,
  supplementalDuplicatesExcluded: supplementalDuplicates,
  supplementalUsProvidersAdded: providers.filter((item) => item.sourceKey.startsWith("recovery-supplement:" )).length,
  publishableProviders: providers.length,
  uniqueCanonicalProviderUrls: canonicalPathCounts.size,
  canonicalProviderUrlConflicts: canonicalPathConflicts.length,
  listingsWithImages: providers.filter((item) => item.featuredImageUrl).length,
  listingsWithInsurance: providers.filter((item) => item.insurance.length || item.insuranceDetails).length,
  listingsWithTreatmentTypes: providers.filter((item) => item.treatmentTypes.length).length,
  listingsWithTherapies: providers.filter((item) => item.therapies.length).length,
  listingsWithAmenities: providers.filter((item) => item.amenities.length).length,
  listingsWithPrices: providers.filter((item) => item.priceRange).length,
  listingsWithDurations: providers.filter((item) => item.treatmentDuration).length,
  listingsWithRatings: providers.filter((item) => item.ratingValue !== null).length,
  rejectedRows: rejected.length,
  inferredStateRows: prepared.filter((item) => !US_REGIONS.has(clean(item.row.State).toUpperCase())).length,
};
console.log(JSON.stringify(summary, null, 2));
if (rejected.length) console.log("Rejected sample:", rejected.slice(0, 10));
if (!commit) {
  console.log("Dry run only. Re-run with --commit after reviewing the summary.");
  process.exit(0);
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const sql = neon(process.env.DATABASE_URL);
const batchSize = 120;
const columns = [
  "name", "slug", "description", "address", "city", "state", "postal_code", "phone", "website", "categories",
  "levels_of_care", "insurance", "license_summary", "accreditation", "source_url", "source_notes", "verification_status",
  "publication_status", "is_sponsored", "source_key", "intake_phone", "latitude", "longitude", "source_data", "import_fingerprint",
  "featured_image_url", "image_urls", "treatment_types", "therapies", "amenities", "specialties", "insurance_details",
  "price_range", "treatment_duration", "source_rating_value", "source_rating_count",
  "organization_slug", "location_slug", "evidence_score",
];

for (let offset = 0; offset < providers.length; offset += batchSize) {
  const batch = providers.slice(offset, offset + batchSize);
  const params = [];
  const tuples = batch.map((provider) => {
    const values = [
      provider.name, provider.slug, provider.description, provider.address, provider.city, provider.state, provider.postalCode,
      provider.phone, provider.website, pgArray(provider.categories), pgArray(provider.levels), pgArray(provider.insurance),
      provider.licenseSummary, pgArray(provider.accreditation), provider.sourceUrl, provider.sourceNotes, "listed", "published", false,
      provider.sourceKey, provider.intakePhone, provider.latitude, provider.longitude,
      JSON.stringify(provider.sourceData).replaceAll("\u2014", "-"), provider.fingerprint,
      provider.featuredImageUrl, pgArray(provider.imageUrls), pgArray(provider.treatmentTypes), pgArray(provider.therapies),
      pgArray(provider.amenities), pgArray(provider.specialties), provider.insuranceDetails, provider.priceRange,
      provider.treatmentDuration, provider.ratingValue, provider.ratingCount,
      provider.organizationSlug, provider.locationSlug, provider.evidenceScore,
    ];
    const start = params.length;
    params.push(...values);
    return `(${values.map((_, index) => `$${start + index + 1}`).join(",")})`;
  });
  const updateColumns = columns.filter((column) => !["source_key", "verification_status", "publication_status", "is_sponsored"].includes(column));
  const query = `insert into providers (${columns.join(",")}) values ${tuples.join(",")}
    on conflict (source_key) where source_key is not null do update set
    ${updateColumns.map((column) => `${column} = excluded.${column}`).join(",")}, updated_at = now()
    where providers.verification_status = 'listed'`;
  await sql.query(query, params);
  if (offset % 2400 === 0) console.log(`Imported ${Math.min(offset + batch.length, providers.length)} / ${providers.length}`);
}

const counts = await sql`select publication_status, verification_status, count(*)::int as count from providers group by publication_status, verification_status order by publication_status, verification_status`;
console.log("Import complete:", counts);
