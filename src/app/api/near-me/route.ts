import { NextRequest, NextResponse } from "next/server";
import { careSearchFilter, careTypeBySlug, cityCarePath, CITY_CARE_MIN_LISTINGS, citySlug, stateByCode } from "@/lib/city-pages";
import { getStateCities, providerPath, searchProviders } from "@/lib/providers";

export const dynamic = "force-dynamic";

const noStore = { headers: { "Cache-Control": "private, no-store" } };

function decodeHeader(value: string | null) {
  if (!value) return "";
  try { return decodeURIComponent(value); } catch { return value; }
}

/** Listings for a care type near the visitor, located from Vercel's IP geolocation headers. */
export async function GET(request: NextRequest) {
  const type = careTypeBySlug(request.nextUrl.searchParams.get("care") || "");
  if (!type) return NextResponse.json({ found: false }, { status: 400, ...noStore });
  const country = request.headers.get("x-vercel-ip-country");
  const state = stateByCode((request.headers.get("x-vercel-ip-country-region") || "").toUpperCase());
  const ipCity = decodeHeader(request.headers.get("x-vercel-ip-city"));
  if (country !== "US" || !state) return NextResponse.json({ found: false }, noStore);

  try {
    const filter = careSearchFilter(type);
    const cities = await getStateCities(state.code);
    const city = ipCity ? cities.find((item) => citySlug(item.city) === citySlug(ipCity))?.city : undefined;
    const cityResult = city ? await searchProviders({ state: state.code, city, ...filter, pageSize: 6 }) : null;
    const useCity = Boolean(cityResult && cityResult.total > 0);
    const result = useCity && cityResult ? cityResult : await searchProviders({ state: state.code, ...filter, pageSize: 6 });
    return NextResponse.json({
      found: result.total > 0,
      place: useCity && city ? `${city}, ${state.code}` : state.name,
      total: result.total,
      moreUrl: useCity && city && result.total >= CITY_CARE_MIN_LISTINGS ? cityCarePath(state, city, type.slug) : `/locations/${state.slug}`,
      providers: result.providers.map((provider) => ({
        id: provider.id,
        name: provider.name,
        city: provider.city,
        state: provider.state,
        url: providerPath(provider),
        verified: provider.verificationStatus === "provider-confirmed",
        rating: provider.sourceRatingValue,
        reviews: provider.sourceRatingCount,
      })),
    }, noStore);
  } catch (error) {
    console.error("Near-me lookup failed", error);
    return NextResponse.json({ found: false }, { status: 500, ...noStore });
  }
}
