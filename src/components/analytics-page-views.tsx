"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export function AnalyticsPageViews() {
  const pathname = usePathname();
  useEffect(() => {
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const send = () => {
      if (trackPageView(pathname) || attempts >= 20) return;
      attempts += 1;
      timer = setTimeout(send, 250);
    };
    send();
    return () => { if (timer) clearTimeout(timer); };
  }, [pathname]);
  return null;
}
