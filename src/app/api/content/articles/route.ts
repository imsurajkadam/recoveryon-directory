import { NextResponse } from "next/server";
import { isContentApiAuthorized } from "@/lib/articles";
import { saveArticlePackage, validateArticlePackage } from "@/lib/article-store";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  if (!isContentApiAuthorized(request)) return unauthorized();
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey) return NextResponse.json({ message: "Idempotency-Key is required" }, { status: 400 });
  const parsed = validateArticlePackage(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid article package", issues: parsed.error.issues }, { status: 400 });
  const result = await saveArticlePackage(parsed.data, idempotencyKey);
  return NextResponse.json(result.body, { status: result.status });
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
