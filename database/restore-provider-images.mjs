import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";

const args = new Set(process.argv.slice(2));
const commit = args.has("--commit");
const root = process.cwd();
const recoveryPath = resolve(root, process.env.RECOVERY_CSV || "work/data/recovery-centers-usa.csv");
const placeholderUrl = "https://images.treatmentlane.com/brand/treatmentlane-listing-placeholder.webp";
const recoveryBrandedAsset = "og-image-recovery-com.jpg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const clean = (value) => String(value || "").replaceAll("\u2014", "-").trim();
const normalizeSourceUrl = (value) => clean(value).replace(/\/$/, "");

function cleanImages(row) {
  const candidates = [row.featured_image, ...clean(row.all_images).split(/\s*\|\s*/)]
    .map((value) => clean(value).replace(/\\$/, ""));
  const used = new Set();
  const images = [];

  for (const candidate of candidates) {
    if (!candidate.startsWith("https://res.cloudinary.com/rehabpath/image/upload/")) continue;
    if (/\.svg(?:\?|$)|h_48,w_48|e_trim:10/i.test(candidate)) continue;
    const filename = candidate.split("?")[0].split("/").at(-1);
    const assetKey = filename?.replace(/\.[^.]+$/, "");
    if (!assetKey || used.has(assetKey)) continue;
    used.add(assetKey);
    images.push(filename === recoveryBrandedAsset ? placeholderUrl : candidate);
    if (images.length === 8) break;
  }

  return images;
}

const recoveryText = await readFile(recoveryPath, "utf8");
const recoveryRows = parse(recoveryText, {
  columns: true,
  bom: true,
  skip_empty_lines: true,
  relax_column_count: true,
});
const imagesBySourceUrl = new Map();

for (const row of recoveryRows) {
  const sourceUrl = normalizeSourceUrl(row.listing_url);
  if (!sourceUrl || imagesBySourceUrl.has(sourceUrl)) continue;
  imagesBySourceUrl.set(sourceUrl, cleanImages(row));
}

const sql = neon(process.env.DATABASE_URL);
const affected = await sql`
  select id, name, source_url
  from providers
  where featured_image_url = ${placeholderUrl}
    and image_urls = array[${placeholderUrl}]::text[]
  order by name, id
`;

const restorations = [];
const unmatched = [];
const brandedOnly = [];
for (const provider of affected) {
  const images = imagesBySourceUrl.get(normalizeSourceUrl(provider.source_url));
  if (!images?.length) {
    unmatched.push({ id: provider.id, name: provider.name, sourceUrl: provider.source_url });
    continue;
  }
  if (images.length === 1 && images[0] === placeholderUrl) {
    brandedOnly.push({ id: provider.id, name: provider.name });
    continue;
  }
  restorations.push({
    id: provider.id,
    name: provider.name,
    featuredImageUrl: images[0],
    imageUrls: images,
  });
}

const summary = {
  sourceRows: recoveryRows.length,
  affectedProviders: affected.length,
  providersToRestore: restorations.length,
  providersWithPropertyImages: restorations.filter((item) => item.imageUrls.some((image) => image !== placeholderUrl)).length,
  providersWithBrandedReplacement: restorations.filter((item) => item.imageUrls.includes(placeholderUrl)).length,
  brandedOnlyProvidersAlreadyCorrect: brandedOnly.length,
  unmatchedProviders: unmatched.length,
  sample: restorations.slice(0, 10).map((item) => ({
    name: item.name,
    imageCount: item.imageUrls.length,
    includesBrandedReplacement: item.imageUrls.includes(placeholderUrl),
  })),
  unmatchedSample: unmatched.slice(0, 10),
};

console.log(JSON.stringify(summary, null, 2));

if (!commit) {
  console.log("Dry run only. Re-run with --commit after reviewing the summary.");
  process.exit(0);
}

let restored = 0;
const batchSize = 200;
for (let offset = 0; offset < restorations.length; offset += batchSize) {
  const batch = restorations.slice(offset, offset + batchSize).map((item) => ({
    id: item.id,
    featuredImageUrl: item.featuredImageUrl,
    imageUrls: item.imageUrls,
  }));
  const result = await sql.query(`
    with restored_images as (
      select id, featured_image_url, image_urls
      from jsonb_to_recordset($1::jsonb)
        as value(id uuid, featured_image_url text, image_urls text[])
    )
    update providers
    set featured_image_url = restored_images.featured_image_url,
        image_urls = restored_images.image_urls,
        updated_at = now()
    from restored_images
    where providers.id = restored_images.id
      and providers.featured_image_url = $2
      and providers.image_urls = array[$2]::text[]
    returning providers.id
  `, [JSON.stringify(batch.map((item) => ({
    id: item.id,
    featured_image_url: item.featuredImageUrl,
    image_urls: item.imageUrls,
  }))), placeholderUrl]);
  restored += result.length;
}

console.log(JSON.stringify({ restoredProviders: restored, skippedAfterDryRun: restorations.length - restored }, null, 2));
