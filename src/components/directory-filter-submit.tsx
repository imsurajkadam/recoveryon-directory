"use client";

import { trackEvent } from "@/lib/analytics";

export function DirectoryFilterSubmit() {
  return <button className="button" type="submit" onClick={() => trackEvent("directory_search")}>Apply filters</button>;
}
