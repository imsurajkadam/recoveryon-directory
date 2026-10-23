import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDatabaseClient } from "./client.mjs";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const inputArg = args.find((value) => value.startsWith("--input="));
if (!inputArg) throw new Error("Provide --input=work/image-migrations/<rollback-file>.json");
if (!process.env.R2_PUBLIC_BASE_URL) throw new Error("R2_PUBLIC_BASE_URL is not configured");

const inputPath = resolve(process.cwd(), inputArg.split("=").slice(1).join("="));
const backup = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(backup.providers)) throw new Error("The rollback file does not contain a providers array");

const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "");
const brandFiles = new Set([
  "treatmentlane-featured-listing.webp",
  "treatmentlane-listing-placeholder.webp",
  "treatmentlane-provider-profile.webp",
  "treatmentlane-verification.webp",
]);

function migratedUrl(value) {
  if (!value) return value;
  try {
    const url = new URL(value);
    const file = url.pathname.startsWith("/images/") ? url.pathname.split("/").at(-1) : null;
    if (["treatmentlane.com", "www.treatmentlane.com"].includes(url.hostname) && file && brandFiles.has(file)) {
      return `${publicBaseUrl}/brand/${file}`;
    }
  } catch {
    return value;
  }
  return value;
}

const restorations = backup.providers.map((provider) => ({
  slug: provider.slug,
  featuredImageUrl: migratedUrl(provider.featuredImageUrl),
  imageUrls: (provider.imageUrls || []).map(migratedUrl),
}));

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  inputPath,
  providers: restorations.length,
  publicBaseUrl,
}, null, 2));

if (!apply) process.exit(0);

const sql = createDatabaseClient();
let updated = 0;
const batchSize = 200;
for (let offset = 0; offset < restorations.length; offset += batchSize) {
  const batch = restorations.slice(offset, offset + batchSize);
  const result = await sql.unsafe(`
    with migrated_images as (
      select slug, featured_image_url, image_urls
      from jsonb_to_recordset($1::jsonb)
        as value(slug text, featured_image_url text, image_urls text[])
    )
    update providers
    set featured_image_url = migrated_images.featured_image_url,
        image_urls = migrated_images.image_urls,
        updated_at = now()
    from migrated_images
    where providers.slug = migrated_images.slug
    returning providers.id
  `, [batch.map((provider) => ({
    slug: provider.slug,
    featured_image_url: provider.featuredImageUrl,
    image_urls: provider.imageUrls,
  }))]);
  updated += result.length;
}

console.log(JSON.stringify({ updatedProviders: updated, missingProviders: restorations.length - updated }, null, 2));
await sql.end();
