"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function BadgeEmbedCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); }
  }
  return <div className="badge-embed">
    <textarea className="badge-code" readOnly value={code} aria-label="Badge embed code" onFocus={(event) => event.currentTarget.select()} />
    <div><button className="button" type="button" onClick={copy}>{copied ? <><Check size={17} /> Copied</> : <><Copy size={17} /> Copy embed code</>}</button></div>
  </div>;
}
