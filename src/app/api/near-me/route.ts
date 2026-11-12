import { NextRequest, NextResponse } from "next/server";
import { careSearchFilter, careTypeBySlug, cityCarePath, CITY_CARE_MIN_LISTINGS, citySlug, stateByCode, type CityCareType } from "@/lib/city-pages";
import { getStateCities, getZipCenter, providerPath, searchNearestProviders, searchProviders } from "@/lib/providers";
import type { Provider } from "@/lib/types";

export const dynamic = "force-dynamic";

const noStore = { headers: { "Cache-Control": "private, no-store" } };

type Mode = "gps" | "search" | "ip" | "national";

function decodeHeader(value: string | null) {
  if (!value) return "";
  try { return decodeURIComponent(value); } catch { return value; }
}

function payload(mode: Mode, place: string, total: number, providers: Array<Provider & { distanceMiles?: number }>, moreUrl: string) {
  return {
    found: providers.length > 0,
    mode,
    place,
    total,
    moreUrl,
    providers: providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      city: provider.city,
      state: provider.state,
      url: providerPath(provider),
      verified: provider.verificationStatus === "provider-confirmed",
      rating: provider.sourceRatingValue,
      reviews: provider.sourceRatingCount,
      distanceMiles: typeof provider.distanceMiles === "number" ? Math.round(provider.distanceMiles) : null,
    })),
  };
}

function directoryUrl(type: CityCareType, location?: string) {
  const params = new URLSearchParams();
  if (type.category) params.set("category", type.category);
  else if (type.levels?.[0]) params.set("level", type.levels[0]);
  if (location) params.set("location", location);
  return `/directory?${params.toString()}`;
}

async function national(type: CityCareType) {
  const result = await searchProviders({ ...careSearchFilter(type), sort: "most-reviewed", pageSize: 6 });
  return payload("national", "the US", result.total, result.providers, directoryUrl(type));
}

/**
 * Listings for a care type near the visitor. Order of precedence:
 * browser coordinates (?lat&lng), a typed city or ZIP (?q), Vercel IP geolocation,
 * then the most-reviewed listings nationwide so the block is never empty.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = careTypeBySlug(params.get("care") || "");
  if (!type) return NextResponse.json({ found: false }, { status: 400, ...noStore });
  const filter = careSearchFilter(type);
  const nearbyFilter = { category: type.category, levels: type.levels };

  try {
    const lat = Number(params.get("lat"));
    const lng = Number(params.get("lng"));
    if (params.has("lat") && params.has("lng") && Number.isFinite(lat) && Number.isFinite(lng)) {
      const nearest = await searchNearestProviders(lat, lng, nearbyFilter);
      if (nearest.length) {
        const first = nearest[0];
        return NextResponse.json(payload("gps", "your location", nearest.length, nearest, directoryUrl(type, `${first.city}, ${first.state}`)), noStore);
      }
      return NextResponse.json(await national(type), noStore);
    }

    const query = (params.get("q") || "").trim().slice(0, 80);
    if (query) {
      const zip = query.match(/^\d{5}/)?.[0];
      const center = zip ? await getZipCenter(zip) : null;
      if (center) {
        const nearest = await searchNearestProviders(center.lat, center.lng, nearbyFilter);
        if (nearest.length) return NextResponse.json(payload("search", zip!, nearest.length, nearest, directoryUrl(type, `${center.city}, ${center.state}`)), noStore);
      }
      const result = await searchProviders({ location: query, ...filter, sort: "most-reviewed", pageSize: 6 });
      if (result.total) return NextResponse.json(payload("search", query, result.total, result.providers, directoryUrl(type, query)), noStore);
      return NextResponse.json({ ...(await national(type)), notFoundQuery: query }, noStore);
    }

    const country = request.headers.get("x-vercel-ip-country");
    const state = stateByCode((request.headers.get("x-vercel-ip-country-region") || "").toUpperCase());
    if (country === "US" && state) {
      const ipLat = Number(request.headers.get("x-vercel-ip-latitude"));
      const ipLng = Number(request.headers.get("x-vercel-ip-longitude"));
      const ipCity = decodeHeader(request.headers.get("x-vercel-ip-city"));
      const cities = await getStateCities(state.code);
      const city = ipCity ? cities.find((item) => citySlug(item.city) === citySlug(ipCity))?.city : undefined;
      const cityResult = city ? await searchProviders({ state: state.code, city, ...filter, pageSize: 6 }) : null;
      if (city && cityResult && cityResult.total > 0) {
        const moreUrl = cityResult.total >= CITY_CARE_MIN_LISTINGS ? cityCarePath(state, city, type.slug) : directoryUrl(type, `${city}, ${state.code}`);
        return NextResponse.json(payload("ip", `${city}, ${state.code}`, cityResult.total, cityResult.providers, moreUrl), noStore);
      }
      if (Number.isFinite(ipLat) && Number.isFinite(ipLng) && ipLat !== 0) {
        const nearest = await searchNearestProviders(ipLat, ipLng, nearbyFilter);
        if (nearest.length) return NextResponse.json(payload("ip", ipCity ? `${ipCity}, ${state.code}` : state.name, nearest.length, nearest, `/locations/${state.slug}`), noStore);
      }
      const stateResult = await searchProviders({ state: state.code, ...filter, pageSize: 6 });
      if (stateResult.total) return NextResponse.json(payload("ip", state.name, stateResult.total, stateResult.providers, `/locations/${state.slug}`), noStore);
    }

    return NextResponse.json(await national(type), noStore);
  } catch (error) {
    console.error("Near-me lookup failed", error);
    return NextResponse.json({ found: false }, { status: 500, ...noStore });
  }
}
