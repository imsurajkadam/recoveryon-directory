import type { CSSProperties } from "react";
import { Brain, Building2, CalendarClock, HeartHandshake, House, MessagesSquare, Stethoscope, Users, type LucideIcon } from "lucide-react";

type CareVisual = { Icon: LucideIcon; accent: string; soft: string; tags: string[] };

const careVisuals: Record<string, CareVisual> = {
  "treatment-centers": { Icon: Building2, accent: "#17666d", soft: "#e6f4f1", tags: ["Residential", "24/7 support"] },
  "medical-detox": { Icon: Stethoscope, accent: "#1f5fbf", soft: "#eaf1fd", tags: ["Medically supervised", "Short term"] },
  "outpatient-programs": { Icon: CalendarClock, accent: "#6a4fc4", soft: "#f0ecfb", tags: ["Live at home", "PHP · IOP · OP"] },
  "counseling-therapy": { Icon: MessagesSquare, accent: "#b8621b", soft: "#fcf1e6", tags: ["Individual", "Family & group"] },
  "sober-living": { Icon: House, accent: "#2f7d4f", soft: "#e8f5ed", tags: ["Recovery housing", "Peer community"] },
  "support-groups": { Icon: Users, accent: "#b4426b", soft: "#fbebf1", tags: ["Peer-led", "Often free"] },
  "mental-health-services": { Icon: Brain, accent: "#3f51b5", soft: "#ecedfa", tags: ["Psychiatry", "Co-occurring care"] },
  "recovery-support": { Icon: HeartHandshake, accent: "#0f7f99", soft: "#e5f4f8", tags: ["Case management", "Ongoing help"] },
};

const fallback: CareVisual = { Icon: Building2, accent: "#17666d", soft: "#e6f4f1", tags: [] };

export function getCareVisual(slug: string): CareVisual {
  return careVisuals[slug] || fallback;
}

export function careAccentStyle(slug: string): CSSProperties {
  const { accent, soft } = getCareVisual(slug);
  return { "--care-accent": accent, "--care-soft": soft } as CSSProperties;
}
