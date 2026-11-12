import { NextRequest } from "next/server";
import { providerFromListingPath } from "@/lib/badge";

export const revalidate = 86400;

function svg(verified: boolean) {
  const accent = verified ? "#1f5fbf" : "#2b7a78";
  const title = verified ? "TreatmentLane Verified" : "Listed on TreatmentLane";
  const caption = verified ? "Provider confirmed with TreatmentLane" : "Find and compare treatment";
  const icon = verified
    ? `<circle cx="28" cy="28" r="14" fill="${accent}"/><path d="M21.5 28.5l4.5 4.5 8.5-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<circle cx="28" cy="28" r="14" fill="${accent}"/><path d="M22 34l6-12 6 12M24.5 29h7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="56" viewBox="0 0 240 56" role="img" aria-label="${title}">
<title>${title}</title>
<rect x="0.5" y="0.5" width="239" height="55" rx="12" fill="#ffffff" stroke="#d7dee6"/>
${icon}
<text x="52" y="25" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="14" font-weight="700" fill="#14273d">${title}</text>
<text x="52" y="41" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif" font-size="11" fill="#5b6b7c">${caption}</text>
</svg>`;
}

/** Embeddable badge: "TreatmentLane Verified" for provider-confirmed listings, otherwise "Listed on TreatmentLane". */
export async function GET(request: NextRequest) {
  const listing = (request.nextUrl.searchParams.get("listing") || "").slice(0, 300);
  const provider = listing ? await providerFromListingPath(listing).catch(() => null) : null;
  const verified = provider?.verificationStatus === "provider-confirmed";
  return new Response(svg(Boolean(verified)), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  });
}
