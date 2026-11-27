import "server-only";

import { absoluteUrl, SITE_URL } from "@/lib/site";

// IndexNow tells Bing, Yandex, Seznam and others about new or changed URLs straight away.
// The key file lives at /public/<key>.txt. Google does not use IndexNow; it reads the sitemap.
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a29b0d38ad9eebd86c5b1f9a0d441256";

export async function pingIndexNow(paths: string[]) {
  const urlList = [...new Set(paths)].map((path) => (path.startsWith("http") ? path : absoluteUrl(path)));
  if (!urlList.length) return false;
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: new URL(SITE_URL).host, key: INDEXNOW_KEY, keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`), urlList }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok && response.status !== 202) console.error("IndexNow ping failed", response.status, (await response.text()).slice(0, 200));
    return response.ok || response.status === 202;
  } catch (error) {
    console.error("IndexNow ping failed", error);
    return false;
  }
}
