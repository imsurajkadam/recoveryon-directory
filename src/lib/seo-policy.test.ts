import assert from "node:assert/strict";
import test from "node:test";
import { indexingTiers, isProviderIndexable, type IndexingSignals } from "./indexing-policy";
import { canonicalPathForProvider, chooseCanonicalProvider, type DuplicateCandidate } from "./provider-duplicates";
import { clampMetaDescription, fixIndefiniteArticles, getProviderSeoTitle, providerDisplayName } from "./provider-display";
import { paginationItems } from "./pagination";
import { chunkEntries, SITEMAP_URL_LIMIT } from "./sitemap-split";
import { listingRobots } from "./listing-robots";

const base: IndexingSignals = {
  organizationSlug: "example-clinic",
  locationSlug: "austin",
  organizationLocationCount: 1,
  address: null,
  phone: null,
  website: null,
  categories: [],
  levelsOfCare: [],
  treatmentTypes: [],
  therapies: [],
  sourceUrl: null,
  licenseSummary: null,
  accreditation: [],
  verificationStatus: "listed",
};

test("thin listings stay noindex", () => {
  assert.equal(isProviderIndexable(base), false);
  assert.deepEqual(indexingTiers(base), []);
});

test("complete phone, website, address, and one service is indexable", () => {
  const provider: IndexingSignals = {
    ...base,
    phone: "(512) 555-0100",
    website: "https://example.org",
    address: "100 Main Street",
    levelsOfCare: ["Outpatient"],
  };
  assert.deepEqual(indexingTiers(provider), ["complete"]);
  assert.equal(isProviderIndexable(provider), true);
});

test("contact details without a service stay noindex", () => {
  const provider: IndexingSignals = {
    ...base,
    phone: "(512) 555-0100",
    website: "https://example.org",
    address: "100 Main Street",
  };
  assert.equal(isProviderIndexable(provider), false);
});

test("verified source or licence qualifies without a full contact profile", () => {
  assert.equal(isProviderIndexable({ ...base, sourceUrl: "https://findtreatment.gov/x", licenseSummary: "State license 123" }), true);
  assert.equal(isProviderIndexable({ ...base, sourceUrl: "https://findtreatment.gov/x", accreditation: ["Joint Commission"] }), true);
  assert.equal(isProviderIndexable({ ...base, sourceUrl: "https://findtreatment.gov/x", verificationStatus: "data-verified" }), true);
  assert.equal(isProviderIndexable({ ...base, sourceUrl: "https://findtreatment.gov/x" }), false);
  assert.equal(isProviderIndexable({ ...base, licenseSummary: "State license 123" }), false);
});

test("search-demand allowlist stays indexable", () => {
  const provider: IndexingSignals = {
    ...base,
    organizationSlug: "lifestance-health",
    locationSlug: "highland",
    organizationLocationCount: 8,
  };
  assert.equal(isProviderIndexable(provider), true);
  assert.ok(indexingTiers(provider).includes("demand"));
});

test("demand on an extra slug keeps the canonical location indexable", () => {
  const canonical: IndexingSignals = { ...base, organizationSlug: "example-clinic", locationSlug: "austin", organizationLocationCount: 2 };
  assert.equal(isProviderIndexable(canonical), false);
  assert.equal(isProviderIndexable(canonical, ["/providers/lifestance-health-highland"]), true);
});

test("provider titles use brand casing, city, and no street or ellipsis", () => {
  const title = getProviderSeoTitle({
    name: "Lifestance Health",
    city: "Detroit",
    state: "MI",
    address: "2628 South Milford Rd, Highland",
  });
  assert.equal(title, "LifeStance Health Highland, MI: Insurance, Services & Phone");
  assert.equal(title.includes("..."), false);
  assert.equal(title.includes("Milford"), false);
  assert.equal(providerDisplayName("Lifestance Health"), "LifeStance Health");
});

test("indefinite article agrees with the following word", () => {
  assert.equal(fixIndefiniteArticles("listed as a outpatient treatment resource"), "listed as an outpatient treatment resource");
  assert.equal(fixIndefiniteArticles("listed as a residential resource"), "listed as a residential resource");
  assert.equal(fixIndefiniteArticles("As a inpatient program"), "As an inpatient program");
});

test("meta descriptions stay within 160 characters and do not add an ellipsis", () => {
  const long = "Rehab costs range from free community programs to tens of thousands of dollars for residential care. This guide explains typical price ranges, what drives them, and how to get a clear written estimate before you commit. This is educational information only, not medical advice.";
  const clamped = clampMetaDescription(long);
  assert.ok(clamped.length <= 160);
  assert.equal(clamped.includes("..."), false);
  assert.match(clamped, /residential care\.$/);
});

test("duplicate location slugs redirect to the organization subpage", () => {
  const subpage: DuplicateCandidate = {
    id: "b",
    organizationSlug: "lifestance-health",
    locationSlug: "highland",
    organizationLocationCount: 22,
    address: "2628 South Milford Rd, Highland, MI 48357",
    city: "Highland",
    state: "MI",
    phone: "(248) 555-0199",
    evidenceScore: 40,
  };
  const extra: DuplicateCandidate = {
    ...subpage,
    id: "a",
    organizationSlug: "lifestance-health-highland",
    locationSlug: "highland",
    organizationLocationCount: 1,
    city: "Detroit",
    evidenceScore: 90,
  };
  assert.equal(chooseCanonicalProvider([extra, subpage]).id, "b");
  assert.equal(canonicalPathForProvider(extra, [extra, subpage]), "/providers/lifestance-health/highland");
  assert.equal(canonicalPathForProvider(subpage, [extra, subpage]), null);
  const stripped = { ...subpage, address: "2628 South Milford Rd" };
  const redirected = canonicalPathForProvider({ ...extra, address: "2628 South Milford Rd, Highland, MI 48357" }, [stripped, extra]);
  assert.equal(redirected, "/providers/lifestance-health/highland");
});

test("numbered pagination keeps the window bounded", () => {
  assert.deepEqual(paginationItems(1, 10), [1, 2, 3, "gap", 10]);
  assert.deepEqual(paginationItems(5, 10), [1, "gap", 3, 4, 5, 6, 7, "gap", 10]);
  assert.deepEqual(paginationItems(10, 10), [1, "gap", 8, 9, 10]);
});

test("sitemap chunks stay under the protocol limit", () => {
  const chunks = chunkEntries(Array.from({ length: SITEMAP_URL_LIMIT + 10 }, (_, index) => index));
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, SITEMAP_URL_LIMIT);
  assert.equal(chunks[1].length, 10);
});

test("directory filters are noindex and page URLs stay indexable", () => {
  assert.deepEqual(listingRobots({ page: "2" }, "/directory"), {
    index: true,
    canonical: "/directory?page=2",
  });
  assert.deepEqual(listingRobots({ page: "1" }, "/directory"), {
    index: true,
    canonical: "/directory",
  });
  assert.deepEqual(listingRobots({ state: "AL", page: "3" }, "/directory"), {
    index: false,
    canonical: "/directory",
  });
  assert.deepEqual(listingRobots({ q: "detox" }, "/directory"), {
    index: false,
    canonical: "/directory",
  });
});
