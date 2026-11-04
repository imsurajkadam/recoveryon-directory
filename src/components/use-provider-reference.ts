"use client";

import { useSyncExternalStore } from "react";

function readProviderReference() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.startsWith("provider=")) return "";
  try {
    const value = decodeURIComponent(hash.slice("provider=".length)).slice(0, 300);
    return value.startsWith("/providers/") ? value : "";
  } catch {
    return "";
  }
}

/** Listing path passed in the URL fragment, so the form is not a crawlable query URL. */
export function useProviderReference() {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener("hashchange", notify);
      return () => window.removeEventListener("hashchange", notify);
    },
    readProviderReference,
    () => "",
  );
}
