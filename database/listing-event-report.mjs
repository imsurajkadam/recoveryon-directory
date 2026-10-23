import { createDatabaseClient } from "./client.mjs";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const providerSlug = process.argv[2]?.trim();
const days = Math.min(Math.max(Number.parseInt(process.argv[3] || "30", 10) || 30, 1), 365);
if (!providerSlug) throw new Error("Usage: npm run db:listing-report -- <provider-slug> [days]");

const sql = createDatabaseClient();
const providers = await sql`select id, name, slug from providers where slug = ${providerSlug} limit 1`;
const provider = providers[0];
if (!provider) throw new Error(`No provider found for slug: ${providerSlug}`);

const rows = await sql`
  select event_date, impressions, clicks
  from listing_event_daily
  where provider_id = ${provider.id}
    and event_date >= current_date - (${days} - 1)
  order by event_date desc`;

const totals = rows.reduce((summary, row) => ({
  impressions: summary.impressions + Number(row.impressions),
  clicks: summary.clicks + Number(row.clicks),
}), { impressions: 0, clicks: 0 });

console.log(`${provider.name} (${provider.slug})`);
console.log(`Last ${days} days: ${totals.impressions} impressions, ${totals.clicks} clicks`);
console.table(rows.map((row) => ({
  date: String(row.event_date),
  impressions: Number(row.impressions),
  clicks: Number(row.clicks),
})));
await sql.end();
