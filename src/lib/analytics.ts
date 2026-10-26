"use client";

export type AnalyticsEvent =
  | "advertiser_inquiry_submit"
  | "contact_submit"
  | "correction_submit"
  | "directory_search"
  | "provider_application_submit"
  | "provider_contact_click"
  | "provider_profile_open"
  | "review_submit";

function privacySafePath(pathname: string) {
  return pathname.startsWith("/providers/") ? "/providers/[listing]"
    : pathname.startsWith("/care/") ? "/care/[category]"
      : pathname.startsWith("/guides/") ? "/guides/[article]"
        : pathname.startsWith("/locations/") ? "/locations/[state]"
          : pathname;
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  // Deliberately send no provider, location, health, or form-content values.
  const pagePath = privacySafePath(window.location.pathname);
  gtag("event", event, {
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
    page_title: pagePath,
    page_referrer: "",
    transport_type: "beacon",
  });
}

export function trackPageView(pathname: string) {
  if (typeof window === "undefined") return false;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return false;
  const pagePath = privacySafePath(pathname);
  gtag("event", "page_view", {
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
    page_title: pagePath,
    page_referrer: "",
    transport_type: "beacon",
  });
  return true;
}
