import type { Metadata } from "next";
import { CompareTool } from "@/components/compare-tool";

export const metadata: Metadata = {
  title: "Compare treatment centers side by side",
  description: "Compare up to 3 addiction treatment centers side by side: services, insurance, pricing estimates, verification status, and reviews.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return <>
    <section className="page-hero"><div className="shell">
      <h1>Compare treatment centers</h1>
      <p>Select up to 3 centers to compare services, insurance, pricing, verification, and reviews side by side.</p>
    </div></section>
    <section className="section"><div className="shell">
      <CompareTool />
    </div></section>
  </>;
}
