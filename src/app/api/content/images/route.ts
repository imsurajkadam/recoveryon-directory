import { NextResponse } from "next/server";
import { z } from "zod";
import { isContentApiAuthorized } from "@/lib/articles";
import { isR2Configured, uploadArticleWebp } from "@/lib/r2";

export const runtime = "nodejs";

// Uploads one article image at a time (keeps each request under Vercel's body limit).
// The image is compressed to WebP and stored in R2; the returned URL can be used as
// hero_image_url or as an image block's src in POST /api/content/articles.
const uploadSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  key: z.string().trim().regex(/^[a-z0-9-]{1,40}$/),
  base64: z.string().min(100).max(4_000_000),
});

export async function POST(request: Request) {
  if (!isContentApiAuthorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!isR2Configured()) return NextResponse.json({ message: "Image storage unavailable" }, { status: 503 });
  const parsed = uploadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid image upload", issues: parsed.error.issues }, { status: 400 });
  const base64 = parsed.data.base64.replace(/^data:image\/[a-z]+;base64,/, "");
  const url = await uploadArticleWebp(`${parsed.data.slug}/${Date.now().toString(36)}-${parsed.data.key}`, base64);
  if (!url) return NextResponse.json({ message: "Image could not be processed or stored" }, { status: 502 });
  return NextResponse.json({ url }, { status: 201 });
}
