"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function TrackedContactLink({ children, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return <a {...props} onClick={(event) => { trackEvent("provider_contact_click"); onClick?.(event); }}>{children}</a>;
}
