export type SitemapUrl = {
  loc: string;
  lastmod: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] || character);
}

export function sitemapResponse(entries: SitemapUrl[]) {
  const urls = entries.map((entry) => [
    "  <url>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
    entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : "",
    entry.priority === undefined ? "" : `    <priority>${entry.priority.toFixed(1)}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n")).join("\n");
  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
}

export function sitemapIndexResponse(entries: Array<{ loc: string; lastmod: string }>) {
  const sitemaps = entries.map((entry) => [
    "  <sitemap>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
    "  </sitemap>",
  ].join("\n")).join("\n");
  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>`);
}

function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
