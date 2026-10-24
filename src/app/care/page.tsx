import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { careCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Types of addiction treatment and recovery support",
  description: "Understand the main types of addiction treatment, therapy, recovery housing, and ongoing support before comparing providers.",
  alternates: { canonical: "/care" },
};

export default function CarePage() {
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Types of care</span><h1>Understand your options before comparing providers</h1><p>These explanations are general information. A qualified professional can help assess which level of care may be appropriate.</p></div></section><section className="section"><div className="shell category-grid">{careCategories.map((category) => <Link className="category-card" key={category.slug} href={`/care/${category.slug}`} prefetch={false}><h2>{category.name}</h2><p>{category.description}</p><span className="card-link">Learn more <ArrowRight size={16} /></span></Link>)}</div></section></>;
}
