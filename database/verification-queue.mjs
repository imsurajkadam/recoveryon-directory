import { createDatabaseClient } from "./client.mjs";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
const limit = Math.min(Math.max(Number.parseInt(limitArgument?.split("=")[1] || "100", 10) || 100, 1), 1000);
const sql = createDatabaseClient();
const rows = await sql.unsafe(
  `select id, name, organization_slug, location_slug, address, city, state, postal_code, phone,
      website, source_url, evidence_score, source_rating_value, source_rating_count, updated_at
   from providers
   where publication_status = 'published'
     and verification_status = 'listed'
     and organization_slug is not null
     and location_slug is not null
     and address is not null
     and phone is not null
     and source_url is not null
     and featured_image_url is not null
     and cardinality(treatment_types) > 0
     and source_notes ilike '%SAMHSA%'
     and coalesce(source_rating_count, 0) >= 10
   order by evidence_score desc, source_rating_count desc nulls last, name, city
   limit $1`,
  [limit],
);

const queue = rows.map((row) => ({
  providerId: row.id,
  name: row.name,
  treatmentLanePath: `/providers/${row.organization_slug}/${row.location_slug}`,
  location: [row.address, row.city, row.state, row.postal_code].filter(Boolean).join(", "),
  phone: row.phone,
  website: row.website,
  currentSource: row.source_url,
  evidenceScore: Number(row.evidence_score),
  sourceRating: row.source_rating_value === null ? null : Number(row.source_rating_value),
  sourceRatingCount: row.source_rating_count,
  requiredChecks: [
    "match official identity and contact information",
    "confirm active state license where applicable",
    "confirm SAMHSA facility record",
    "check material conflicts across sources",
    "confirm services before applying a verification label",
  ],
}));

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), requested: limit, candidates: queue.length, queue }, null, 2));
await sql.end();
