import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LinkableGuide } from "@/lib/internal-links";
import { withQuestionMark } from "@/lib/text-question";

// A compact list of guide links with their one-line summaries. Used on guide pages ("Keep reading")
// and on pillar pages ("Guides on this topic") so every guide is reachable from related pages.
export function RelatedGuides({ guides, title = "Keep reading", id = "related-guides", className = "" }: { guides: LinkableGuide[]; title?: string; id?: string; className?: string }) {
  if (!guides.length) return null;
  return <section className={`related-guides ${className}`.trim()} id={id} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>{title}</h2>
    <ul>
      {guides.map((guide) => <li key={guide.slug}>
        <Link href={guide.path} prefetch={false}>{withQuestionMark(guide.title)} <ArrowRight size={15} aria-hidden="true" /></Link>
        {guide.description ? <p>{guide.description}</p> : null}
      </li>)}
    </ul>
  </section>;
}
