import "server-only";

import { timingSafeEqual } from "node:crypto";
import { getDatabase } from "@/lib/db";

// Blocks an article can be built from. Older articles only use heading, paragraph, list and callout.
export type ArticleBlock =
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; text: string; tone?: "info" | "tip" | "warning"; title?: string }
  | { type: "key_takeaways"; items: string[]; title?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "steps"; items: { title: string; text: string }[]; title?: string }
  | { type: "checklist"; items: string[]; title?: string }
  | { type: "stats"; items: { value: string; label: string }[]; title?: string; note?: string }
  | { type: "image"; src?: string; image_key?: string; alt: string; caption?: string }
  | { type: "cta"; text: string; href: string; label: string };

/** Plain text of a block, for reading-time and table-of-contents purposes. */
export function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "heading": case "paragraph": return block.text || "";
    case "callout": return [block.title, block.text].filter(Boolean).join(" ");
    case "list": case "key_takeaways": case "checklist": return (block.items || []).join(" ");
    case "table": return [block.caption, ...(block.headers || []), ...(block.rows || []).flat()].filter(Boolean).join(" ");
    case "steps": return (block.items || []).map((item) => `${item.title} ${item.text}`).join(" ");
    case "stats": return (block.items || []).map((item) => `${item.value} ${item.label}`).join(" ");
    case "image": return block.caption || "";
    case "cta": return block.text || "";
    default: return "";
  }
}

export type ArticleFaq = { question: string; answer: string };
export type ArticleSource = { title?: string; label?: string; url: string; publisher?: string };

export type PublishedArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  authorName: string;
  reviewerName: string;
  reviewerCredentials: string;
  reviewedAt: string;
  publishedAt: string;
  updatedAt: string;
  thumbnailMimeType: string;
  hasThumbnail: boolean;
  heroImageUrl: string;
  imageAlt: string;
  blocks: ArticleBlock[];
  faq: ArticleFaq[];
  sources: ArticleSource[];
  internalLinks: string[];
};

type ArticleRow = Record<string, unknown>;

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

// The database driver returns timestamps as Date objects, not strings. Only accepting strings made every
// article date fall back to 1 January 1970 (shown as "Editorially checked January 1, 1970").
function isoDate(value: unknown, fallback: string) {
  const parsed = value instanceof Date ? value : new Date(typeof value === "string" || typeof value === "number" ? value : fallback);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function mapPublishedArticle(row: ArticleRow): PublishedArticle {
  const payload = row.payload && typeof row.payload === "object" ? row.payload as Record<string, unknown> : {};
  const updatedAt = isoDate(row.updated_at, new Date(0).toISOString());
  const publishedAt = isoDate(row.published_at, updatedAt);
  return {
    id: text(row.id),
    slug: text(row.slug),
    title: text(row.title),
    excerpt: text(row.excerpt),
    seoTitle: text(row.seo_title),
    metaDescription: text(row.meta_description),
    primaryKeyword: text(row.primary_keyword),
    secondaryKeywords: stringList(row.secondary_keywords),
    category: text(row.category),
    authorName: text(row.author_name, "TreatmentLane Editorial Team"),
    reviewerName: text(row.reviewer_name),
    reviewerCredentials: text(row.reviewer_credentials),
    reviewedAt: isoDate(row.reviewed_at, publishedAt),
    publishedAt,
    updatedAt,
    thumbnailMimeType: text(row.thumbnail_mime_type, "image/webp"),
    hasThumbnail: Boolean(row.has_thumbnail),
    heroImageUrl: text(payload.hero_image_url) || text(row.hero_image_url),
    imageAlt: text(payload.image_alt, text(row.title)),
    blocks: Array.isArray(payload.article_blocks) ? payload.article_blocks as ArticleBlock[] : [],
    faq: Array.isArray(payload.faq) ? payload.faq as ArticleFaq[] : [],
    sources: Array.isArray(payload.sources) ? payload.sources as ArticleSource[] : [],
    internalLinks: stringList(payload.internal_links),
  };
}

export function isContentApiAuthorized(request: Request) {
  const expected = process.env.TREATMENTLANE_CONTENT_API_TOKEN;
  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!expected || !supplied) return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

export async function getPublishedArticleBySlug(slug: string) {
  const sql = getDatabase();
  if (!sql) return null;
  const rows = await sql`select *, thumbnail_base64 is not null as has_thumbnail
    from content_articles where slug = ${slug} and status = 'published' limit 1`;
  return rows[0] ? mapPublishedArticle(rows[0] as ArticleRow) : null;
}

export async function getPublishedArticleSummaries() {
  const sql = getDatabase();
  if (!sql) return [];
  const rows = await sql`select id, slug, title, excerpt, seo_title, meta_description,
    primary_keyword, secondary_keywords, category, author_name, reviewer_name,
    reviewer_credentials, reviewed_at, published_at, updated_at,
    thumbnail_mime_type, thumbnail_base64 is not null as has_thumbnail,
    payload->>'hero_image_url' as hero_image_url,
    jsonb_build_object('internal_links', coalesce(payload->'internal_links', '[]'::jsonb), 'image_alt', payload->'image_alt') as payload
    from content_articles where status = 'published' order by published_at desc`;
  return rows.map((row) => mapPublishedArticle(row as ArticleRow));
}

export async function getPublishedArticleThumbnail(id: string) {
  const sql = getDatabase();
  if (!sql) return null;
  const rows = await sql`select thumbnail_base64, thumbnail_mime_type
    from content_articles where id = ${id} and status = 'published' limit 1`;
  if (!rows[0]?.thumbnail_base64) return null;
  return { data: String(rows[0].thumbnail_base64), mimeType: String(rows[0].thumbnail_mime_type || "image/webp") };
}
