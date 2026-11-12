import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LifeBuoy } from "lucide-react";
import { careAccentStyle, getCareVisual } from "@/components/care-visuals";
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
  </article><section className="section"><div className="shell">
    <div className="category-grid care-grid">{careCategories.map((category, index) => {
      const { Icon, tags } = getCareVisual(category.slug);
      return <Link className="category-card care-card" style={careAccentStyle(category.slug)} key={category.slug} href={`/care/${category.slug}`} prefetch={false}>
        <div className="care-card-top"><span className="care-icon" aria-hidden="true"><Icon size={26} strokeWidth={1.8} /></span><span className="care-index">{String(index + 1).padStart(2, "0")}</span></div>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
        {tags.length > 0 && <div className="care-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
        <span className="card-link">Learn more <ArrowRight size={16} /></span>
      </Link>;
    })}</div>
    <div className="care-help">
      <span className="care-help-icon" aria-hidden="true"><LifeBuoy size={26} /></span>
      <div><h2>Not sure which level of care fits?</h2><p>A doctor, counselor, or the free, confidential SAMHSA National Helpline at 1-800-662-4357 can help you think through options. In a crisis, call or text 988.</p></div>
      <Link className="button" href="/directory" prefetch={false}>Browse the directory <ArrowRight size={16} /></Link>
    </div>
  </div></section></>;
}
