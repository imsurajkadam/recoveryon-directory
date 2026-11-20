import type { SpotKind } from "@/components/illustrations";

export type GuideTopic = { id: string; label: string; art: SpotKind; diagram?: "insurance" | "levels" | "choosing"; cta: { label: string; href: string; text: string } };

const directoryCta = { label: "Search the directory", href: "/directory", text: "Compare published listings by place, type of care, and insurance." };

const topics: Array<GuideTopic & { match: RegExp }> = [
  { id: "paying", label: "Paying for treatment", art: "insurance", diagram: "insurance", match: /cost|insurance|medicaid|medicare|paying|blue-cross|cover/, cta: { label: "Browse by insurance", href: "/insurance", text: "See listings that report accepting your plan, then confirm coverage directly." } },
  { id: "families", label: "For families", art: "family", match: /loved-one|family|enabling|intervention|children-of|supporting|talk-to/, cta: directoryCta },
  { id: "groups", label: "Programs for specific groups", art: "about", match: /teen|young-adult|women|mens-|veterans|pregnancy|older-adults|lgbtq|professionals|college|executive|faith/, cta: directoryCta },
  { id: "mental-health", label: "Mental health and addiction", art: "guides", match: /dual-diagnosis|depression|anxiety|ptsd|bipolar|adhd|eating-disorders|ocd|mental-health/, cta: { label: "Mental health services", href: "/care/mental-health-services", text: "Find providers that treat mental health and substance use together." } },
  { id: "substances", label: "Substances and withdrawal", art: "care", match: /alcohol|opioid|fentanyl|heroin|cocaine|meth-|benzodiazepine|cannabis|kratom|prescription|polysubstance|stimulant|hallucinogen/, cta: { label: "Find medical detox", href: "/care/medical-detox", text: "Withdrawal can be medically serious. Compare supervised detox listings." } },
  { id: "therapies", label: "Therapies and approaches", art: "guides", match: /cbt|dbt|emdr|therapy|holistic|contingency|medication-assisted|12-step|trauma-informed/, cta: { label: "Counseling and therapy", href: "/care/counseling-therapy", text: "Compare counseling and therapy listings near you." } },
  { id: "recovery", label: "Life in recovery", art: "recovery", match: /after-rehab|relapse|post-acute|cravings|recovery|sober/, cta: { label: "Recovery support", href: "/care/recovery-support", text: "Find sober living, peer support, and ongoing recovery services." } },
  { id: "levels", label: "Levels of care", art: "care", diagram: "levels", match: /detox|php|iop|outpatient|residential|inpatient|levels-of-care|telehealth|therapeutic-community|partial-hospitalization/, cta: { label: "Types of care", href: "/care", text: "See each level of care and the listings that offer it." } },
  { id: "choosing", label: "Choosing a provider", art: "guides", diagram: "choosing", match: /verify|questions|choose|compare|find-|packing|bring|doctor/, cta: directoryCta },
];

const fallback: GuideTopic = { id: "more", label: "More guides", art: "guides", cta: directoryCta };

export const guideTopicOrder: GuideTopic[] = [...topics.filter((topic) => topic.id === "choosing"), ...topics.filter((topic) => topic.id === "levels"), ...topics.filter((topic) => !["choosing", "levels"].includes(topic.id)), fallback];

export function guideTopic(slug: string): GuideTopic {
  return topics.find((topic) => topic.match.test(slug)) || fallback;
}

export function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 70) || "section";
}

export function readingMinutes(texts: string[]) {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
