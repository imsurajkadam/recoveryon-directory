import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ error: "unavailable" }, { status: 500 });
  
  try {
    const rows = await sql`
      select id, name, city, state, phone, website, price_range, insurance,
             verification_status, accreditation
      from providers where id = ${id} and publication_status = 'published' limit 1
    `;
    if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
    const r: any = rows[0];
    
    const revRows = await sql`
      select count(*)::int as cnt, avg(rating)::float as avg
      from reviews where provider_id = ${id} and status = 'approved'
    `;
    const rev: any = revRows[0] || {};
    
    return NextResponse.json({ provider: {
      id: String(r.id), name: String(r.name), city: String(r.city), state: String(r.state),
      phone: r.phone ? String(r.phone) : null, website: r.website ? String(r.website) : null,
      priceRange: r.price_range ? String(r.price_range) : null,
      insurance: Array.isArray(r.insurance) ? r.insurance : [],
      verificationStatus: String(r.verification_status),
      accreditation: Array.isArray(r.accreditation) ? r.accreditation : [],
      avgRating: rev.avg ? Number(rev.avg) : null, reviewCount: Number(rev.cnt || 0),
    }});
  } catch { return NextResponse.json({ error: "failed" }, { status: 500 }); }
}
