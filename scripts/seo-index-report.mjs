import postgres from "postgres";
import { assessProviderIndexing } from "../src/lib/indexing-policy.ts";
import { chooseCanonicalProvider, clusterDuplicates } from "../src/lib/provider-duplicates.ts";
import { providerPath } from "../src/lib/provider-path.ts";

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set, so listing counts were not queried.");
  console.log("Run this against the TreatmentLane directory database:");
  console.log("  node --env-file=.env.local --experimental-strip-types --import ./scripts/test-register.mjs scripts/seo-index-report.mjs");
  console.log("or:");
  console.log("  DATABASE_URL=postgres://... npm run seo:index-report");
  process.exit(0);
}

function textList(value) {
  return Array.isArray(value) ? value.map(String) : [];
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, connect_timeout: 20 });

try {
  const statusRows = await sql`select publication_status, count(*)::int as count from providers group by publication_status order by publication_status`;
  const rows = await sql`select p.id, p.name, p.organization_slug, p.location_slug, p.address, p.city, p.state,
      p.phone, p.website, p.categories, p.levels_of_care, p.treatment_types, p.therapies, p.insurance,
      p.license_summary, p.accreditation, p.source_url, p.verification_status, p.publication_status, p.evidence_score,
      coalesce(org_counts.cnt, 1)::int as organization_location_count
    from providers p
    left join (
      select organization_slug, count(*)::int as cnt
      from providers
      where publication_status = 'published' and organization_slug is not null
      group by organization_slug
    ) org_counts on org_counts.organization_slug = p.organization_slug
    where p.publication_status = 'published'
      and p.organization_slug is not null
      and p.location_slug is not null`;

  const listings = rows.map((row) => ({
    id: String(row.id),
    name: String(row.name || ""),
    organizationSlug: String(row.organization_slug),
    locationSlug: String(row.location_slug),
    organizationLocationCount: Number(row.organization_location_count || 1),
    address: row.address ? String(row.address) : null,
    city: String(row.city || ""),
    state: String(row.state || ""),
    phone: row.phone ? String(row.phone) : null,
    website: row.website ? String(row.website) : null,
    categories: textList(row.categories),
    levelsOfCare: textList(row.levels_of_care),
    treatmentTypes: textList(row.treatment_types),
    therapies: textList(row.therapies),
    insurance: textList(row.insurance),
    sourceUrl: row.source_url ? String(row.source_url) : null,
    licenseSummary: row.license_summary ? String(row.license_summary) : null,
    accreditation: textList(row.accreditation),
    verificationStatus: String(row.verification_status),
    publicationStatus: String(row.publication_status),
    evidenceScore: Number(row.evidence_score || 0),
  }));

  const reasons = { closed: 0, test: 0, duplicate: 0, "missing-identity": 0, "name-only": 0, unpublished: 0 };
  const boosts = { demand: 0, verified: 0 };
  let indexable = 0;
  for (const cluster of clusterDuplicates(listings)) {
    const canonical = chooseCanonicalProvider(cluster);
    const alternatePaths = cluster.map((listing) => providerPath(listing));
    for (const listing of cluster) {
      const decision = assessProviderIndexing(listing, { isDuplicate: listing.id !== canonical.id, alternatePaths });
      if (decision.indexable) {
        indexable += 1;
        if (decision.boosts.includes("demand")) boosts.demand += 1;
        if (decision.boosts.includes("verified")) boosts.verified += 1;
      } else if (decision.reason) reasons[decision.reason] += 1;
    }
  }

  const published = listings.length;
  const noindexed = published - indexable;
  console.log(`Published listings: ${published.toLocaleString()}`);
  console.log(`Indexable: ${indexable.toLocaleString()}`);
  console.log(`Noindexed: ${noindexed.toLocaleString()}`);
  for (const [reason, count] of Object.entries(reasons)) {
    if (count) console.log(`  ${reason}: ${count.toLocaleString()}`);
  }
  console.log(`Sitemap priority boosts among indexable listings: demand ${boosts.demand.toLocaleString()}, verified ${boosts.verified.toLocaleString()}`);
  console.log("Publication status (all rows, including unpublished):");
  for (const row of statusRows) console.log(`  ${row.publication_status}: ${Number(row.count).toLocaleString()}`);
  console.log("Indexable count is location URLs. Multi-location organization hubs are additional sitemap URLs.");
} finally {
  await sql.end();
}
