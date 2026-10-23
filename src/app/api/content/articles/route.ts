import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isContentApiAuthorized } from "@/lib/articles";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";

const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), text: z.string().trim().min(2).max(240), level: z.union([z.literal(2), z.literal(3)]).default(2) }),
  z.object({ type: z.literal("paragraph"), text: z.string().trim().min(2).max(5000) }),
  z.object({ type: z.literal("callout"), text: z.string().trim().min(2).max(2000) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().trim().min(1).max(1000)).min(1).max(30) }),
]);

const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(10).max(3000),
});

const sourceSchema = z.object({
  title: z.string().trim().min(2).max(300).optional(),
  label: z.string().trim().min(2).max(300).optional(),
  publisher: z.string().trim().min(2).max(200).optional(),
  url: z.string().url().refine((value) => value.startsWith("https://"), "Source URLs must use HTTPS"),
});

const draftSchema = z.object({
  content_unit_id: z.string().trim().min(3).max(120),
  title: z.string().trim().min(10).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  excerpt: z.string().trim().min(20).max(500),
  seo_title: z.string().trim().min(10).max(70),
  meta_description: z.string().trim().min(30).max(180),
  primary_keyword: z.string().trim().min(3).max(180),
  secondary_keywords: z.array(z.string().trim().min(2).max(180)).max(30).default([]),
  category: z.string().trim().min(2).max(120),
  author_name: z.string().trim().min(2).max(120).default("TreatmentLane Editorial Team"),
  reviewer_required: z.boolean().default(false),
  automated_quality_gate_passed: z.boolean().optional(),
  article_blocks: z.array(articleBlockSchema).min(1).max(200),
  faq: z.array(faqSchema).max(12).default([]),
  sources: z.array(sourceSchema).min(1).max(50),
  claim_source_map: z.unknown(),
  internal_links: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
  image_alt: z.string().trim().min(5).max(300),
  thumbnail_base64: z.string().min(20).max(12_000_000).optional(),
  suggested_publish_at: z.string().datetime().optional(),
  status: z.enum(["needs_medical_review", "published"]),
}).passthrough().superRefine((value, context) => {
  if (value.status === "published" && value.automated_quality_gate_passed !== true) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["automated_quality_gate_passed"],
      message: "Direct publication requires a passed automated quality gate",
    });
  }
});

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  if (!isContentApiAuthorized(request)) return unauthorized();
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey) return NextResponse.json({ message: "Idempotency-Key is required" }, { status: 400 });
  const parsed = draftSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid article package", issues: parsed.error.issues }, { status: 400 });
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database unavailable" }, { status: 503 });
  const { thumbnail_base64: thumbnailBase64, ...payload } = parsed.data;
  const databasePayload = JSON.parse(JSON.stringify(payload));
  const publicationStatus = payload.status;
  const rows = await sql`insert into content_articles
    (content_unit_id, idempotency_key, slug, title, excerpt, seo_title, meta_description,
     primary_keyword, secondary_keywords, category, author_name, payload, thumbnail_base64,
     status, scheduled_at, published_at)
    values (${payload.content_unit_id}, ${idempotencyKey}, ${payload.slug}, ${payload.title},
      ${payload.excerpt}, ${payload.seo_title}, ${payload.meta_description}, ${payload.primary_keyword},
      ${payload.secondary_keywords}, ${payload.category}, ${payload.author_name},
      ${sql.json(databasePayload)}::jsonb, ${thumbnailBase64 || null}, ${publicationStatus},
      ${payload.suggested_publish_at || null},
      ${publicationStatus === "published" ? new Date().toISOString() : null})
    on conflict (idempotency_key) do update set
      slug = excluded.slug,
      title = excluded.title,
      excerpt = excluded.excerpt,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      primary_keyword = excluded.primary_keyword,
      secondary_keywords = excluded.secondary_keywords,
      category = excluded.category,
      author_name = excluded.autor_name,
      payload = excluded.payload,
      thumbnail_base64 = coalesce(excluded.thumbnail_base64, content_articles.thumbnail_base64),
      status = excluded.status,
      scheduled_at = excluded.scheduled_at,
      published_at = case when excluded.status = 'published'
        then coalesce(content_articles.published_at, now())
        else content_articles.published_at end,
      updated_at = now()
    returning id, slug, status, scheduled_at`;
  if (rows[0]) {
    revalidatePath("/guides");
    revalidatePath(`/guides/${payload.slug}`);
    return NextResponse.json({ article: rows[0], created: true }, { status: 201 });
  }
  const existing = await sql`select id, slug, status, scheduled_at from content_articles
    where idempotency_key = ${idempotencyKey} limit 1`;
  return NextResponse.json({ article: existing[0], created: false }, { status: 200 });
}

export async function GET(request: Request) {
  if (!isContentApiAuthorized(request)) return unauthorized();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  if (status !== "approved") return NextResponse.json({ message: "Only the approved queue is available" }, { status: 400 });
  const dueBeforeValue = url.searchParams.get("due_before");
  const dueBefore = dueBeforeValue && !Number.isNaN(Date.parse(dueBeforeValue)) ? dueBeforeValue : new Date().toISOString();
  const limit = Math.min(5, Math.max(1, Number(url.searchParams.get("limit")) || 5));
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ message: "Database unavailable" }, { status: 503 });
  const rows = await sql.unsafe(
    `select id, content_unit_id, slug, title, status, scheduled_at, reviewed_at,
       reviewer_name, reviewer_credentials
     from content_articles
     where status = 'approved'
       and reviewer_name is not null
       and reviewer_credentials is not null
       and reviewed_at is not null
       and coalesce(scheduled_at, now()) <= $1
     order by coalesce(scheduled_at, created_at), created_at
     limit $2`,
    [dueBefore, limit],
   );
  return NextResponse.json({ articles: rows });
}
