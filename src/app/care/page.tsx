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
  return <><section className="page-hero"><div className="shell"><span className="kicker plain">Types of care</span><h1>Understand your options before comparing providers</h1><p>These explanations are general information. A qualified professional can help assess which level of care may be appropriate.</p></div></section><article className="content-shell prose">
    <h2>What this page covers</h2>
    <p>This page explains the eight kinds of addiction treatment and recovery support listed in the TreatmentLane directory. Treatment is not a single service: people move between levels of care as their needs change, and many providers offer more than one kind. Knowing what each category means makes it easier to compare listings and to ask providers useful questions.</p>
    <p>Treatment centers are residential and inpatient programs offering structured support for substance use recovery. Medical detox is clinically supervised withdrawal management and stabilization, and withdrawal can be medically serious, so it matters who provides clinical oversight and how care continues after detox. Outpatient programs cover flexible outpatient, intensive outpatient, and partial hospitalization programs, which let a person live at home while attending treatment on a set schedule.</p>
    <p>Counseling and therapy covers individual, family, and group counseling for addiction, recovery, and co-occurring needs. Sober living means structured recovery residences that support the transition to independent living. Support groups are peer-led recovery meetings and family support communities, which can complement professional care but do not replace medical advice, diagnosis, detoxification, or emergency services.</p>
    <p>Mental health services cover psychiatry, therapy, and integrated support for mental health and substance use needs together. Recovery support covers case management, peer coaching, employment help, and other practical services that help a person rebuild daily life after treatment. Each category page below explains its option in more detail and links to providers offering it.</p>
    <p>When you compare providers, look at the level of care, licensing, clinical services, admission criteria, and aftercare plan, and confirm insurance, cost, and availability directly with the provider. Nothing on this page is medical advice, and it does not replace an assessment by a qualified professional.</p>
  </article><section className="section"><div className="shell category-grid">{careCategories.map((category) => <Link className="category-card" key={category.slug} href={`/care/${category.slug}`} prefetch={false}><h2>{category.name}</h2><p>{category.description}</p><span className="card-link">Learn more <ArrowRight size={16} /></span></Link>)}</div></section></>;
}
