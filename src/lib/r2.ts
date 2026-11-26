import "server-only";

import { AwsClient } from "aws4fetch";
import sharp from "sharp";

// Uploads article images to TreatmentLane's Cloudflare R2 bucket (served from images.treatmentlane.com).
// Returns null when R2 is not configured so callers can fall back gracefully.

let client: AwsClient | null | undefined;

function r2Client() {
  if (client !== undefined) return client;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  client = accessKeyId && secretAccessKey
    ? new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" })
    : null;
  return client;
}

export function isR2Configured() {
  return Boolean(r2Client() && process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET && process.env.R2_PUBLIC_BASE_URL);
}

const EXTENSIONS: Record<string, string> = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg" };

/** Uploads one image and returns its public URL, or null if R2 is unavailable or the upload fails. */
export async function uploadArticleImage(path: string, base64: string, mimeType: string) {
  const aws = r2Client();
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  const extension = EXTENSIONS[mimeType];
  if (!aws || !accountId || !bucket || !publicBase || !extension) return null;
  const key = `articles/${path}.${extension}`;
  const body = Buffer.from(base64, "base64");
  if (body.length < 100) return null;
  try {
    const response = await aws.fetch(`https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`, {
      method: "PUT",
      body,
      headers: { "Content-Type": mimeType, "Cache-Control": "public, max-age=31536000, immutable" },
    });
    if (!response.ok) {
      console.error("R2 article image upload failed", response.status, key);
      return null;
    }
    return `${publicBase}/${key}`;
  } catch (error) {
    console.error("R2 article image upload error", key, error);
    return null;
  }
}

/** Converts any supported image to a compressed WebP (max 1400px wide) before upload. */
export async function toWebp(base64: string) {
  try {
    const output = await sharp(Buffer.from(base64, "base64"))
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();
    return output.toString("base64");
  } catch (error) {
    console.error("Article image conversion failed", error);
    return null;
  }
}

/** Compresses to WebP, then uploads. Returns the public URL or null. */
export async function uploadArticleWebp(path: string, base64: string) {
  const webp = await toWebp(base64);
  return webp ? uploadArticleImage(path, webp, "image/webp") : null;
}

export function isOwnedImageUrl(url: string) {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");
  return Boolean(base && url.startsWith(`${base}/articles/`));
}
