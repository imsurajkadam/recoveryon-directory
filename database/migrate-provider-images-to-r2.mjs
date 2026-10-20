import { createHash } from "node:crypto";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const flags = new Set(args);
const apply = flags.has("--apply");
const confirmRights = flags.has("--confirm-rights");
const maxProvidersArg = args.find((value) => value.startsWith("--max-providers="));
const maxProviders = maxProvidersArg ? Number.parseInt(maxProvidersArg.split("=")[1], 10) : null;
const concurrencyArg = args.find((value) => value.startsWith("--concurrency="));
const concurrency = Math.max(1, Math.min(12, concurrencyArg ? Number.parseInt(concurrencyArg.split("=")[1], 10) : 4));

const required = apply
  ? ["DATABASE_URL", "R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_PUBLIC_BASE_URL"]
  : ["DATABASE_URL", "R2_PUBLIC_BASE_URL"];

for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is not configured`);
}

if (maxProviders !== null && (!Number.isSafeInteger(maxProviders) || maxProviders < 1)) {
  throw new Error("--max-providers must be a positive integer");
}

const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "");
const publicHost = new URL(publicBaseUrl).hostname;
const configuredHosts = new Set(
  (process.env.R2_ALLOWED_SOURCE_HOSTS || "treatmentlane.com,www.treatmentlane.com,images.treatmentlane.com")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);
const ownedHosts = new Set(["treatmentlane.com", "www.treatmentlane.com", "images.treatmentlane.com"]);
const treatmentLaneBrandFiles = new Set([
  "treatmentlane-featured-listing.webp",
  "treatmentlane-listing-placeholder.webp",
  "treatmentlane-provider-profile.webp",
  "treatmentlane-verification.webp",
]);

function sourceUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function contentExtension(contentType, url) {
  const types = new Map([
    ["image/avif", "avif"],
    ["image/gif", "gif"],
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
  ]);
  const normalized = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (types.has(normalized)) return types.get(normalized);
  const match = url.pathname.match(/\.([a-z0-9]{2,5})$/i);
  return match?.[1]?.toLowerCase() || "img";
}

function objectKey(url, contentType) {
  const digest = createHash("sha256").update(url.toString()).digest("hex");
  return `providers/${digest.slice(0, 2)}/${digest}.${contentExtension(contentType, url)}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function mapConcurrent(items, limit, task) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select id, slug, featured_image_url, image_urls
  from providers
  where publication_status = 'published'
    and (featured_image_url is not null or cardinality(image_urls) > 0)
  order by id
`;

const candidates = rows
  .map((row) => {
    const images = unique([row.featured_image_url, ...(row.image_urls || [])]);
    const eligible = images
      .map(sourceUrl)
      .filter((url) => url && url.hostname !== publicHost && configuredHosts.has(url.hostname));
    return { ...row, images, eligible };
  })
  .filter((row) => row.eligible.length > 0);

const selected = maxProviders ? candidates.slice(0, maxProviders) : candidates;
const hostCounts = {};
for (const row of candidates) {
  for (const url of row.eligible) hostCounts[url.hostname] = (hostCounts[url.hostname] || 0) + 1;
}

const externalHosts = [...new Set(selected.flatMap((row) => row.eligible.map((url) => url.hostname)))]
  .filter((hostname) => !ownedHosts.has(hostname));

const summary = {
  mode: apply ? "apply" : "dry-run",
  publishedProvidersWithImages: rows.length,
  candidateProviders: candidates.length,
  selectedProviders: selected.length,
  candidateImagesByHost: hostCounts,
  publicBaseUrl,
  allowedSourceHosts: [...configuredHosts],
  externalHosts,
};
console.log(JSON.stringify(summary, null, 2));

if (!apply) {
  console.log("Dry run only. Use --apply after reviewing the source hosts and confirming storage rights.");
  process.exit(0);
}

if (externalHosts.length > 0 && !confirmRights) {
  throw new Error("External source hosts require --confirm-rights before files can be copied.");
}

const workDirectory = resolve(process.cwd(), "work", "image-migrations");
await mkdir(workDirectory, { recursive: true });
const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
const rollbackPath = resolve(workDirectory, `r2-provider-images-${stamp}-rollback.json`);
const statePath = resolve(workDirectory, `r2-provider-images-${stamp}-state.jsonl`);

await writeFile(rollbackPath, `${JSON.stringify({
  createdAt: new Date().toISOString(),
  publicBaseUrl,
  providers: selected.map((row) => ({
    id: row.id,
    slug: row.slug,
    featuredImageUrl: row.featured_image_url,
    imageUrls: row.image_urls,
  })),
}, null, 2)}\n`, { mode: 0o600 });

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const uploadedBySource = new Map();
let uploadedObjects = 0;
let reusedObjects = 0;
let updatedProviders = 0;
let failedProviders = 0;

async function uploadImage(url) {
  if (uploadedBySource.has(url.toString())) return uploadedBySource.get(url.toString());

  const promise = (async () => {
    const brandFile = url.pathname.startsWith("/images/") ? url.pathname.split("/").at(-1) : null;
    if (ownedHosts.has(url.hostname) && brandFile && treatmentLaneBrandFiles.has(brandFile)) {
      reusedObjects += 1;
      return `${publicBaseUrl}/brand/${brandFile}`;
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "TreatmentLaneImageMigration/1.0 (+https://treatmentlane.com)" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
    const contentType = String(response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!contentType.startsWith("image/")) throw new Error(`Source returned ${contentType || "an unknown content type"}`);
    const contentLength = Number.parseInt(response.headers.get("content-length") || "0", 10);
    if (contentLength > 20 * 1024 * 1024) throw new Error("Source image is larger than 20 MB");
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 20 * 1024 * 1024) throw new Error("Source image is larger than 20 MB");

    const key = objectKey(url, contentType);
    try {
      await s3.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
      reusedObjects += 1;
    } catch (error) {
      const status = error?.$metadata?.httpStatusCode;
      if (status !== 404) throw error;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
        Metadata: { source: url.hostname },
      }));
      uploadedObjects += 1;
    }
    return `${publicBaseUrl}/${key}`;
  })();

  uploadedBySource.set(url.toString(), promise);
  return promise;
}

await mapConcurrent(selected, concurrency, async (row) => {
  try {
    const replacements = new Map();
    for (const url of row.eligible) replacements.set(url.toString(), await uploadImage(url));

    const nextFeatured = replacements.get(row.featured_image_url) || row.featured_image_url;
    const nextImages = (row.image_urls || []).map((url) => replacements.get(url) || url);
    const result = await sql.query(`
      update providers
      set featured_image_url = $1,
          image_urls = $2::text[],
          updated_at = now()
      where id = $3::uuid
        and featured_image_url is not distinct from $4
        and image_urls = $5::text[]
      returning id
    `, [nextFeatured, nextImages, row.id, row.featured_image_url, row.image_urls || []]);

    if (result.length !== 1) throw new Error("Provider changed after the rollback export and was not updated");
    updatedProviders += 1;
    await appendFile(statePath, `${JSON.stringify({ providerId: row.id, slug: row.slug, status: "updated" })}\n`, { mode: 0o600 });
  } catch (error) {
    failedProviders += 1;
    await appendFile(statePath, `${JSON.stringify({
      providerId: row.id,
      slug: row.slug,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    })}\n`, { mode: 0o600 });
  }
});

console.log(JSON.stringify({
  rollbackPath,
  statePath,
  uploadedObjects,
  reusedObjects,
  updatedProviders,
  failedProviders,
}, null, 2));

if (failedProviders > 0) process.exitCode = 1;
