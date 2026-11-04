import "server-only";

import { getPublishedArticleSummaries } from "@/lib/articles";
import { guides } from "@/lib/content";
import { cityHubPath } from "@/lib/places";
import { getPublishedCities, getProviderSitemapEntries, getProviderSitemapManifest } from "@/lib/providers";
import { absoluteUrl } from "@/lib/site";
import { chunkByLimits, sitemapEntryBytes } from "@/lib/sitemap-split";
import { type SitemapUrl } from "@/lib/sitemap-xml";
import { states } from "@/lib/us-states";

function dateOnly(value: string) {
  return value.slice(0, 10);
}

function latest(values: string[], fallback: string) {
  return values.reduce((max, value) => value > max ? value : max, fallback);
}

export async function citySitemapChunks(): Promise<SitemapUrl[][]> {
  const stateSlug = new Map(states.map((state) => [state.code, state.slug]));
  const byPath = new Map<string, string>();
  for (const city of await getPublishedCities()) {
    const slug = stateSlug.get(city.state);
    if (!slug) continue;
    const path = cityHubPath(slug, city.city);
    const existing = byPath.get(path);
    if (!existing || city.updatedAt > existing) byPath.set(path, city.updatedAt);
  }
  const entries: SitemapUrl[] = [...byPath.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([path, updatedAt]) => ({
    loc: absoluteUrl(path),
    lastmod: dateOnly(updatedAt),
    changefreq: "weekly",
    priority: 0.6,
  }));
  return chunkByLimits(entries, (entry) => sitemapEntryBytes(entry.loc, entry.lastmod, entry.priority ?? 0.6));
}

export async function locationSitemapEntries(): Promise<SitemapUrl[]> {
  const stateByCode = new Map(states.map((state) => [state.code, state]));
  const lastmod = new Map<string, string>();
  for (const city of await getPublishedCities()) {
    const state = stateByCode.get(city.state);
    if (!state) continue;
    const existing = lastmod.get(state.slug);
    if (!existing || city.updatedAt > existing) lastmod.set(state.slug, city.updatedAt);
  }
  return [...lastmod.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([slug, updatedAt]) => ({
    loc: absoluteUrl(`/locations/${slug}`),
    lastmod: dateOnly(updatedAt),
    changefreq: "monthly",
    priority: 0.7,
  }));
}

export async function providerSitemapDocument(segmentId: string): Promise<SitemapUrl[] | null> {
  const entries = await getProviderSitemapEntries(segmentId);
  if (!entries) return null;
  return entries.map((entry) => ({
    loc: absoluteUrl(entry.path),
    lastmod: dateOnly(entry.lastmod),
    changefreq: "monthly" as const,
    priority: entry.priority,
  }));
}

export async function sitemapIndexEntries() {
  const [manifest, cities, locations, articles] = await Promise.all([
    getProviderSitemapManifest(),
    citySitemapChunks(),
    locationSitemapEntries(),
    getPublishedArticleSummaries(),
  ]);
  const guideLastmod = latest([
    ...guides.map((guide) => guide.reviewedOn),
    ...articles.map((article) => dateOnly(article.updatedAt)),
  ], "2026-09-28");
  const locationLastmod = latest(locations.map((entry) => entry.lastmod), "2026-09-28");
  const entries = [
    { loc: absoluteUrl("/sitemaps/core.xml"), lastmod: "2026-11-04" },
    { loc: absoluteUrl("/sitemaps/guides.xml"), lastmod: guideLastmod },
    { loc: absoluteUrl("/sitemaps/locations.xml"), lastmod: locationLastmod },
  ];
  cities.forEach((chunk, index) => {
    if (!chunk.length) return;
    entries.push({ loc: absoluteUrl(`/sitemaps/cities/${index + 1}.xml`), lastmod: latest(chunk.map((entry) => entry.lastmod), chunk[0].lastmod) });
  });
  for (const segment of manifest) {
    entries.push({ loc: absoluteUrl(`/sitemaps/providers/${segment.id}.xml`), lastmod: dateOnly(segment.lastmod) });
  }
  return entries;
}
