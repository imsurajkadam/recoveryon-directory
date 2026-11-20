import Link from "next/link";
import type { ReactNode } from "react";
import { careLadder } from "@/lib/care-facts";

export type SpotKind = "care" | "locations" | "insurance" | "guides" | "about" | "family" | "recovery";

const scenes: Record<SpotKind, ReactNode> = {
  care: <>
    <rect x="60" y="150" width="78" height="54" rx="12" fill="#fff" stroke="#b9ddd4" strokeWidth="2" />
    <rect x="142" y="112" width="78" height="92" rx="12" fill="#fff" stroke="#b9ddd4" strokeWidth="2" />
    <rect x="224" y="74" width="78" height="130" rx="12" fill="#fff" stroke="#b9ddd4" strokeWidth="2" />
    <rect x="74" y="166" width="50" height="8" rx="4" fill="#69c7af" /><rect x="74" y="182" width="34" height="6" rx="3" fill="#dce7e8" />
    <rect x="156" y="128" width="50" height="8" rx="4" fill="#247f86" /><rect x="156" y="144" width="38" height="6" rx="3" fill="#dce7e8" /><rect x="156" y="158" width="28" height="6" rx="3" fill="#dce7e8" />
    <rect x="238" y="90" width="50" height="8" rx="4" fill="#1f5fbf" /><rect x="238" y="106" width="40" height="6" rx="3" fill="#dce7e8" /><rect x="238" y="120" width="30" height="6" rx="3" fill="#dce7e8" /><rect x="238" y="134" width="36" height="6" rx="3" fill="#dce7e8" />
    <path d="M70 136 C110 96 150 100 180 84 S250 40 292 52" fill="none" stroke="#17666d" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
    <circle cx="292" cy="52" r="15" fill="#247f86" /><path d="M285 52l5 5 9-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M96 118c-7-10-22-2-14 10l14 13 14-13c8-12-7-20-14-10z" fill="#f2b8c6" />
  </>,
  locations: <>
    <path d="M52 92l66-26 62 22 68-26 60 24v104l-60-24-68 26-62-22-66 26z" fill="#fff" stroke="#b9ddd4" strokeWidth="2" strokeLinejoin="round" />
    <path d="M118 66v104M180 88v104M248 62v104" stroke="#dce7e8" strokeWidth="2" />
    <path d="M70 150c40-30 70 8 104-14s52-40 118-22" fill="none" stroke="#69c7af" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 8" />
    <g><path d="M150 132c0-17-26-17-26 0 0 12 13 24 13 24s13-12 13-24z" fill="#247f86" /><circle cx="137" cy="131" r="5" fill="#fff" /></g>
    <g><path d="M232 110c0-21-32-21-32 0 0 15 16 30 16 30s16-15 16-30z" fill="#1f5fbf" /><circle cx="216" cy="109" r="6" fill="#fff" /></g>
    <g><path d="M286 152c0-15-22-15-22 0 0 10 11 20 11 20s11-10 11-20z" fill="#e7a23c" /><circle cx="275" cy="151" r="4" fill="#fff" /></g>
    <circle cx="86" cy="112" r="5" fill="#69c7af" /><circle cx="196" cy="168" r="5" fill="#69c7af" />
  </>,
  insurance: <>
    <rect x="62" y="84" width="176" height="112" rx="16" fill="#fff" stroke="#b9ddd4" strokeWidth="2" />
    <rect x="62" y="104" width="176" height="20" fill="#247f86" />
    <rect x="80" y="140" width="70" height="9" rx="4.5" fill="#102a43" opacity=".75" /><rect x="80" y="158" width="104" height="7" rx="3.5" fill="#dce7e8" /><rect x="80" y="172" width="60" height="7" rx="3.5" fill="#dce7e8" />
    <path d="M258 70l44 16v38c0 30-20 52-44 62-24-10-44-32-44-62V86z" fill="#1f5fbf" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
    <path d="M240 126l13 13 24-27" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="96" cy="212" r="16" fill="#e7a23c" /><path d="M96 203v18M91 208c0-5 10-5 10 0s-10 3-10 8 10 5 10 0" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </>,
  guides: <>
    <path d="M180 88c-30-18-74-18-104-6v112c30-12 74-12 104 6z" fill="#fff" stroke="#b9ddd4" strokeWidth="2" strokeLinejoin="round" />
    <path d="M180 88c30-18 74-18 104-6v112c-30-12-74-12-104 6z" fill="#fff" stroke="#b9ddd4" strokeWidth="2" strokeLinejoin="round" />
    <path d="M96 106c20-6 44-6 64 2M96 124c20-6 44-6 64 2M96 142c20-6 44-6 64 2M96 160c14-4 30-4 44 0" fill="none" stroke="#dce7e8" strokeWidth="4" strokeLinecap="round" />
    <path d="M204 110l6 6 11-12M204 136l6 6 11-12M204 162l6 6 11-12" fill="none" stroke="#247f86" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M232 108h34M232 134h34M232 160h26" stroke="#dce7e8" strokeWidth="4" strokeLinecap="round" />
    <path d="M246 34h56a12 12 0 0112 12v30a12 12 0 01-12 12h-30l-14 13v-13h-12a12 12 0 01-12-12V46a12 12 0 0112-12z" fill="#1f5fbf" />
    <path d="M264 52c0-11 20-11 20 0 0 7-10 7-10 14" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" /><circle cx="274" cy="76" r="2.6" fill="#fff" />
  </>,
  about: <>
    <path d="M40 214c70-10 96-40 140-54s78-58 148-70" fill="none" stroke="#b9ddd4" strokeWidth="34" strokeLinecap="round" />
    <path d="M40 214c70-10 96-40 140-54s78-58 148-70" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 12" />
    <circle cx="292" cy="56" r="22" fill="#f6d488" />
    <rect x="112" y="96" width="6" height="74" rx="3" fill="#102a43" opacity=".7" /><path d="M118 100h56l12 12-12 12h-56z" fill="#247f86" /><path d="M112 130H64l-12 12 12 12h48z" fill="#1f5fbf" />
    <rect x="130" y="108" width="30" height="6" rx="3" fill="#fff" /><rect x="72" y="139" width="28" height="6" rx="3" fill="#fff" />
    <circle cx="226" cy="140" r="9" fill="#17666d" /><path d="M226 150v22M226 158l-10 8M226 158l10 8M226 172l-8 16M226 172l8 16" stroke="#17666d" strokeWidth="4" strokeLinecap="round" />
  </>,
  family: <>
    <path d="M70 196v-70l110-62 110 62v70z" fill="#fff" stroke="#b9ddd4" strokeWidth="2" strokeLinejoin="round" />
    <path d="M52 132l128-74 128 74" fill="none" stroke="#247f86" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="140" cy="140" r="12" fill="#1f5fbf" /><path d="M118 196c0-28 44-28 44 0z" fill="#1f5fbf" />
    <circle cx="220" cy="140" r="12" fill="#247f86" /><path d="M198 196c0-28 44-28 44 0z" fill="#247f86" />
    <circle cx="180" cy="160" r="9" fill="#e7a23c" /><path d="M164 196c0-20 32-20 32 0z" fill="#e7a23c" />
    <path d="M180 98c-6-9-19-2-12 9l12 11 12-11c7-11-6-18-12-9z" fill="#f2b8c6" />
  </>,
  recovery: <>
    <path d="M56 204h248" stroke="#b9ddd4" strokeWidth="4" strokeLinecap="round" />
    <path d="M76 204v-30h46v-30h46v-30h46v-30h46v120" fill="#fff" stroke="#b9ddd4" strokeWidth="2" strokeLinejoin="round" />
    <path d="M98 160l46-30 46-30 46-30" fill="none" stroke="#69c7af" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 8" />
    <circle cx="238" cy="66" r="9" fill="#17666d" /><path d="M238 76v6" stroke="#17666d" strokeWidth="4" strokeLinecap="round" />
    <rect x="262" y="38" width="5" height="46" rx="2.5" fill="#102a43" opacity=".7" /><path d="M267 40h34l-9 10 9 10h-34z" fill="#1f5fbf" />
    <circle cx="96" cy="70" r="20" fill="#f6d488" />
  </>,
};

/** Decorative spot illustration in the site palette. Hidden from assistive technology. */
export function SpotArt({ kind, className = "" }: { kind: SpotKind; className?: string }) {
  return <svg className={`spot-art ${className}`} viewBox="0 0 360 250" role="presentation" aria-hidden="true" focusable="false">
    <ellipse cx="180" cy="132" rx="168" ry="108" fill="#eaf7f4" />
    <circle cx="48" cy="58" r="8" fill="#69c7af" opacity=".5" /><circle cx="326" cy="200" r="11" fill="#1f5fbf" opacity=".18" /><circle cx="318" cy="30" r="5" fill="#e7a23c" opacity=".6" />
    {scenes[kind]}
  </svg>;
}

export function IllustratedHero({ kind, kicker, title, children }: { kind: SpotKind; kicker?: string; title: string; children?: ReactNode }) {
  return <section className="page-hero illustrated-hero"><div className="shell illustrated-hero-grid">
    <div>{kicker ? <span className="kicker plain">{kicker}</span> : null}<h1>{title}</h1>{children}</div>
    <SpotArt kind={kind} />
  </div></section>;
}

/** Levels of care from most to least intensive. `current` highlights the levels a category covers. */
export function CareLadder({ current = [] }: { current?: number[] }) {
  return <figure className="care-ladder">
    <div className="care-ladder-scale" aria-hidden="true"><span>More intensive</span><span>Less intensive</span></div>
    <ol>{careLadder.map((level, index) => <li key={level.label} className={current.includes(index) ? "is-current" : ""} style={{ "--step": index } as React.CSSProperties}>
      <span className="care-ladder-bar" aria-hidden="true" />
      <Link href={level.href} prefetch={false}><strong>{level.label}</strong><span>{level.detail}</span><small>{level.time}</small></Link>
    </li>)}</ol>
    <figcaption>People often move between levels as their needs change. A clinical assessment decides the starting point.</figcaption>
  </figure>;
}

export function StepsDiagram({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return <ol className="steps-diagram">{steps.map((step, index) => <li key={step.title}><span className="steps-number" aria-hidden="true">{index + 1}</span><div><strong>{step.title}</strong><p>{step.body}</p></div></li>)}</ol>;
}

export type BarItem = { label: string; count: number; href?: string };
export function BarList({ items, unit = "listings" }: { items: BarItem[]; unit?: string }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return <ul className="bar-list">{items.map((item) => {
    const inner = <><span className="bar-label">{item.label}</span><span className="bar-track" aria-hidden="true"><span style={{ width: `${Math.max((item.count / max) * 100, 2)}%` }} /></span><span className="bar-count">{item.count.toLocaleString("en-US")} <small>{unit}</small></span></>;
    return <li key={item.label}>{item.href ? <Link href={item.href} prefetch={false}>{inner}</Link> : <div>{inner}</div>}</li>;
  })}</ul>;
}

const tileGrid: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0], VT: [9, 1], NH: [10, 1],
  WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], IL: [5, 2], WI: [6, 2], MI: [7, 2], NY: [8, 2], RI: [9, 2], MA: [10, 2],
  OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IN: [5, 3], OH: [6, 3], PA: [7, 3], NJ: [8, 3], CT: [9, 3],
  CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
  AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5], DC: [8, 5],
  OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6],
  HI: [0, 7], TX: [3, 7], FL: [8, 7],
};

/** Tile map of the United States shaded by number of published listings. Each tile links to its state page. */
export function StateTileMap({ states }: { states: Array<{ code: string; name: string; slug: string; count: number }> }) {
  const max = Math.max(...states.map((state) => state.count), 1);
  const shade = (count: number) => (count ? Math.min(4, 1 + Math.floor((Math.sqrt(count) / Math.sqrt(max)) * 4)) : 0);
  return <figure className="tile-map">
    <div className="tile-map-grid">{states.filter((state) => tileGrid[state.code]).map((state) => {
      const [column, row] = tileGrid[state.code];
      return <Link key={state.code} href={`/locations/${state.slug}`} prefetch={false} className={`tile shade-${shade(state.count)}`} style={{ gridColumn: column + 1, gridRow: row + 1 }} title={`${state.name}: ${state.count.toLocaleString("en-US")} listings`} aria-label={`${state.name}: ${state.count.toLocaleString("en-US")} listings`}>
        <strong>{state.code}</strong><small>{state.count >= 1000 ? `${(state.count / 1000).toFixed(1)}k` : state.count}</small>
      </Link>;
    })}</div>
    <figcaption><span>Fewer listings</span><i className="shade-1" /><i className="shade-2" /><i className="shade-3" /><i className="shade-4" /><span>More listings</span></figcaption>
  </figure>;
}

const verificationLevels = [
  { label: "Directory listing", body: "Collected from public source data. Not yet confirmed." },
  { label: "Data verified", body: "Matched across independent sources with dated evidence." },
  { label: "TreatmentLane Verified", body: "Claimed by the provider, who confirmed the details with us." },
  { label: "Independently reviewed", body: "Checked by our team against named third-party sources." },
];

export function VerificationLadder() {
  return <figure className="verify-ladder"><ol>{verificationLevels.map((level, index) => <li key={level.label} style={{ "--step": index } as React.CSSProperties}><span aria-hidden="true">{index + 1}</span><strong>{level.label}</strong><p>{level.body}</p></li>)}</ol><figcaption>Each label describes how much checking a listing has had. None of them is a clinical endorsement.</figcaption></figure>;
}

export function StatRow({ stats }: { stats: Array<{ value: string; label: string }> }) {
  return <dl className="stat-row">{stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>;
}
