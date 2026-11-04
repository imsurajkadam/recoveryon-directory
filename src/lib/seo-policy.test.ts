import assert from "node:assert/strict";
import test from "node:test";
import { assessProviderIndexing, type IndexingSignals } from "./indexing-policy";
import { canonicalPathForProvider, chooseCanonicalProvider, type DuplicateCandidate } from "./provider-duplicates";
import { clampMetaDescription, fixIndefiniteArticles, getProviderSeoTitle, providerDisplayName } from "./provider-display";
import { paginationItems } from "./pagination";
import { chunkByLimits, chunkEntries, SITEMAP_URL_LIMIT } from "./sitemap-split";
import { listingRobots } from "./listing-robots";

const base: IndexingSignals = {
  name: "Example Clinic",
  city: "Austin",
  state: "TX",
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
  insurance: [],
  sourceUrl: null,
  licenseSummary: null,
  accreditation: [],
  verificationStatus: "listed",
  publicationStatus: "published",
};

test("name-only listings stay noindex", () => {
  const decision = assessProviderIndexing(base);
  assert.equal(decision.indexable, false);
  assert.equal(decision.reason, "name-only");
});

test("one useful contact or detail is enough to index", () => {
  for (const extra of [
    { phone: "(512) 555-0100" },
    { website: "https://example.org" },
    { address: "100 Main Street" },
    { levelsOfCare: ["Outpatient"] },
    { insurance: ["Medicaid"] },
    { categories: ["Outpatient Programs"] },
  ]) {
    const decision = assessProviderIndexing({ ...base, ...extra });
    assert.equal(decision.indexable, true, JSON.stringify(extra));
    assert.equal(decision.reason, null);
  }
});

test("demand and verified signals raise priority and do not index a stub", () => {
  const stub = assessProviderIndexing({
    ...base,
    organizationSlug: "lifestance-health",
    locationSlug: "highland",
    organizationLocationCount: 8,
  });
  assert.equal(stub.indexable, false);
  assert.ok(stub.boosts.includes("demand"));

  const reachable = assessProviderIndexing({ ...base, phone: "(512) 555-0100", sourceUrl: "https://findtreatment.gov/x", verificationStatus: "data-verified" });
  assert.equal(reachable.indexable, true);
  assert.ok(reachable.boosts.includes("verified"));
  assert.equal(reachable.priority, 0.8);

  const demanded = assessProviderIndexing({
    ...base,
    phone: "(512) 555-0100",
    organizationSlug: "lifestance-health",
    locationSlug: "highland",
    organizationLocationCount: 8,
  });
  assert.equal(demanded.priority, 0.9);
});

test("closed, test, unpublished, and duplicate listings stay noindex", () => {
  assert.equal(assessProviderIndexing({ ...base, phone: "555", name: "Example Clinic (Closed)" }).reason, "closed");
  assert.equal(assessProviderIndexing({ ...base, phone: "555", operationalStatus: "inactive" }).reason, "closed");
  assert.equal(assessProviderIndexing({ ...base, phone: "555", publicationStatus: "archived" }).reason, "closed");
  assert.equal(assessProviderIndexing({ ...base, phone: "555", name: "Test Clinic" }).reason, "test");
  assert.equal(assessProviderIndexing({ ...base, phone: "555", publicationStatus: "draft" }).reason, "unpublished");
  assert.equal(assessProviderIndexing({ ...base, phone: "555" }, { isDuplicate: true }).reason, "duplicate");
  assert.equal(assessProviderIndexing({ ...base, phone: "555", name: "X", city: "" }).reason, "missing-identity");
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

test("sitemap chunks stay under the URL and byte limits", () => {
  const chunks = chunkEntries(Array.from({ length: SITEMAP_URL_LIMIT + 10 }, (_, index) => index));
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, SITEMAP_URL_LIMIT);
  assert.equal(chunks[1].length, 10);
  const byBytes = chunkByLimits(["aaaa", "bbbb", "cccc"], (value) => value.length, 50, 8);
  assert.deepEqual(byBytes, [["aaaa", "bbbb"], ["cccc"]]);
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
