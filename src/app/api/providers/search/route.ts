import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const limit = Math.min(Number(searchParams.get("limit")) || 6, 10);
  if (!q.trim()) return NextResponse.json({ providers: [] });
  
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ providers: [] });
  
  try {
    const rows = await sql`
      select id, name, city, state
      from providers
      where publication_status = 'published'
        and (name ilike ${'%' + q + '%'} or city ilike ${'%' + q + '%'})
      order by is_sponsored desc, name
      limit ${limit}
    `;
    return NextResponse.json({ providers: rows.map((r: any) => ({ id: String(r.id), name: String(r.name), city: String(r.city), state: String(r.state) })) });
  } catch { return NextResponse.json({ providers: [] }); }
}
