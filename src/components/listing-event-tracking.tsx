"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

type ListingEventType = "impression" | "click";

function sendListingEvent(providerId: string, eventType: ListingEventType) {
  const body = JSON.stringify({ providerId, eventType });

  if (eventType === "click" && navigator.sendBeacon) {
    const queued = navigator.sendBeacon("/api/listing-events", new Blob([body], { type: "application/json" }));
    if (queued) return;
  }

  void fetch("/api/listing-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function ListingImpression({ providerId }: { providerId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    sendListingEvent(providerId, "impression");
  }, [providerId]);

  return null;
}

export function ListingCta({ providerId, href, children }: { providerId: string; href: string; children: ReactNode }) {
  return <Link className="provider-card-cta" href={href} prefetch={false} onClick={() => sendListingEvent(providerId, "click")}>{children}</Link>;
}
