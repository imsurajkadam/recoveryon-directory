import { createDatabaseClient } from "./client.mjs";

const args = new Set(process.argv.slice(2));
const commit = args.has("--commit");
const confirmation = process.argv.find((arg) => arg.startsWith("--confirm="))?.split("=")[1];
const placeholder = "https://images.treatmentlane.com/brand/treatmentlane-listing-placeholder.webp";
const pgArray = (values) => `{${values.map((value) => `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`).join(",")}}`;

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function streetAddress(value, city, state, postalCode) {
  if (!value) return null;
  let address = String(value).trim().replace(/,?\s*(?:United States|USA)\s*$/i, "").trim();
  const parts = [city, state, postalCode].filter(Boolean).map(escapeRegExp);
  if (parts.length >= 2) address = address.replace(new RegExp(`,?\\s*${parts.join("(?:,|\\s)+")}\\s*$`, "i"), "").replace(/,\s*$/, "").trim();
  return address || null;
}

function sourceDetail(value) {
  if (!value) return null;
  return /\b(fill out|submit (?:the|our)|contact us|call us|reach out|our admissions|our secure form|we will|we'll|your information is private)\b/i.test(value) ? null : value;
}

function imageUrl(value) {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (url.hostname === "images.treatmentlane.com") return url.toString();
    if (["treatmentlane.com", "www.treatmentlane.com"].includes(url.hostname) && url.pathname === "/images/treatmentlane-listing-placeholder.webp") return placeholder;
  } catch {}
  return null;
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
const sql = createDatabaseClient();
const rows = await sql`select id, address, city, state, postal_code, insurance_details, featured_image_url, image_urls from providers`;
const changes = [];
const summary = { scanned: rows.length, changed: 0, addresses: 0, sourceCopy: 0, featuredImages: 0, imageLists: 0 };

for (const row of rows) {
  const address = streetAddress(row.address, row.city, row.state, row.postal_code);
  const insuranceDetails = sourceDetail(row.insurance_details);
  const featuredImageUrl = imageUrl(row.featured_image_url);
  const imageUrls = [...new Set((row.image_urls || []).map(imageUrl).filter(Boolean))];
  const addressChanged = address !== row.address;
  const sourceCopyChanged = insuranceDetails !== row.insurance_details;
  const featuredImageChanged = featuredImageUrl !== row.featured_image_url;
  const imageListChanged = JSON.stringify(imageUrls) !== JSON.stringify(row.image_urls || []);
  if (!addressChanged && !sourceCopyChanged && !featuredImageChanged && !imageListChanged) continue;
  if (addressChanged) summary.addresses += 1;
  if (sourceCopyChanged) summary.sourceCopy += 1;
  if (featuredImageChanged) summary.featuredImages += 1;
  if (imageListChanged) summary.imageLists += 1;
  changes.push({ id: row.id, address, insuranceDetails, featuredImageUrl, imageUrls });
}

summary.changed = changes.length;
console.log(JSON.stringify({ ...summary, sampleIds: changes.slice(0, 10).map((row) => row.id) }, null, 2));

if (!commit) {
  console.log("Dry run only. Review the counts, then use --commit --confirm=cleanup-provider-source-data.");
  await sql.end();
  process.exit(0);
}
if (confirmation !== "cleanup-provider-source-data") throw new Error("Commit confirmation is missing or incorrect");

const batchSize = 200;
await sql.begin(async (transaction) => {
  for (let offset = 0; offset < changes.length; offset += batchSize) {
    const batch = changes.slice(offset, offset + batchSize);
    const params = [];
    const tuples = batch.map((row) => {
      const start = params.length;
      params.push(row.id, row.address, row.insuranceDetails, row.featuredImageUrl, pgArray(row.imageUrls));
      return `($${start + 1}::uuid, $${start + 2}::text, $${start + 3}::text, $${start + 4}::text, $${start + 5}::text[])`;
    });
    await transaction.unsafe(`update providers as provider set
      address = data.address,
      insurance_details = data.insurance_details,
      featured_image_url = data.featured_image_url,
      image_urls = data.image_urls,
      updated_at = now()
      from (values ${tuples.join(",")}) as data(id, address, insurance_details, featured_image_url, image_urls)
      where provider.id = data.id`, params);
  }
});

console.log(JSON.stringify({ committed: changes.length }, null, 2));
await sql.end();
