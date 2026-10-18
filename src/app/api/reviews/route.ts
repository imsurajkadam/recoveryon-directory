import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, reviewerName, reviewerRole, rating, title, body: reviewBody } = body;
    
    if (!providerId || !reviewerName || !rating || !reviewBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }
    
    const sql = getDatabase();
    if (!sql) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    
    await sql`
      insert into reviews (provider_id, reviewer_name, reviewer_role, rating, title, body, status)
      values (${providerId}, ${reviewerName}, ${reviewerRole || 'former_client'}, ${rating}, ${title || null}, ${reviewBody}, 'pending')
    `;
    
    return NextResponse.json({ success: true, message: "Review submitted for moderation" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId");
  if (!providerId) return NextResponse.json({ error: "providerId required" }, { status: 400 });
  
  const sql = getDatabase();
  if (!sql) return NextResponse.json({ reviews: [] });
  
  const reviews = await sql`
    select id, reviewer_name, reviewer_role, rating, title, body, created_at
    from reviews
    where provider_id = ${providerId} and status = 'approved'
    order by created_at desc
    limit 20
  `;
  
  return NextResponse.json({ reviews });
}
