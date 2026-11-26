import { NextResponse } from "next/server";
import { isContentApiAuthorized } from "@/lib/articles";
import { getListingContext } from "@/lib/listing-context";

export const runtime = "nodejs";

// Live listing counts for article writers. Optional filters: insurance, category, level, state.
export async function GET(request: Request) {
  if (!isContentApiAuthorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const context = await getListingContext({
    insurance: url.searchParams.get("insurance") || undefined,
    category: url.searchParams.get("category") || undefined,
    level: url.searchParams.get("level") || undefined,
    state: url.searchParams.get("state") || undefined,
  });
  if (!context) return NextResponse.json({ message: "Database unavailable" }, { status: 503 });
  return NextResponse.json(context, { headers: { "Cache-Control": "no-store" } });
}
