import type { NextConfig } from "next";

// Listings that moved onto their brand's main organization page. The old
// single-location URLs keep working and point at the new location page.
const regroupedProviderPaths: Array<[string, string]> = [
  ["newport-academy-atlanta", "newport-academy/roswell"],
  ["newport-academy-fairfax", "newport-academy/fairfax"],
  ["newport-academy-maryland", "newport-academy/rockville"],
  ["newport-academy-southern-california", "newport-academy/ranch"],
  ["newport-academy-st-cloud", "newport-academy/st-cloud"],
  ["newport-institute-young-adult-ocd-program", "newport-institute/alhambra"],
  ["newport-institute-buffalo", "newport-institute/buffalo"],
  ["newport-institute-connecticut", "newport-institute/congress"],
  ["newport-institute-southern-california", "newport-institute/periwinkle"],
  ["prairiecare-brooklyn-park-inpatient", "prairiecare/brooklyn-park-hospital"],
  ["prairiecare-brooklyn-park-medical-office", "prairiecare/brooklyn-park-mob"],
  ["prairiecare-edina", "prairiecare/edina"],
  ["prairiecare-mankato", "prairiecare/mankato"],
  ["prairiecare-maple-grove", "prairiecare/maple-grove"],
  ["prairiecare-maplewood", "prairiecare/maplewood"],
  ["prairiecare-rochester", "prairiecare/rochester"],
  ["prairiecare-woodbury", "prairiecare/woodbury"],
];

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.treatmentlane.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/rehabpath/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.treatmentlane.com" }],
        destination: "https://treatmentlane.com/:path*",
        permanent: true,
      },
      ...regroupedProviderPaths.map(([from, to]) => ({
        source: `/providers/${from}/:rest*`,
        destination: `/providers/${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
