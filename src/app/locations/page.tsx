import type { Metadata } from "next";
import Link from "next/link";
import { states } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recovery resources by state",
  description: "Browse addiction treatment, recovery, and mental health resources by U.S. state.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Locations</span><h1>Browse recovery resources by state</h1><p>State pages remain out of search results until they contain useful, reviewed listings.</p></div></section><section className="section"><div className="shell all-states">{states.map((state) => <Link key={state.code} href={`/locations/${state.slug}`} prefetch={false}>{state.name}</Link>)}</div></section></>;
}
