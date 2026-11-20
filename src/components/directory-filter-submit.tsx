"use client";

import { trackEvent } from "@/lib/analytics";

export function DirectoryFilterSubmit({ label = "Apply filters" }: { label?: string }) {
  return <button className="button" type="submit" onClick={() => trackEvent("directory_search")}>{label}</button>;
}
