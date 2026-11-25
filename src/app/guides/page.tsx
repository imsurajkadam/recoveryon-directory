import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IllustratedHero, SpotArt } from "@/components/illustrations";
import { getPublishedArticleSummaries } from "@/lib/articles";
import { guides } from "@/lib/content";
import { guideTopic, guideTopicOrder } from "@/lib/guide-topics";
import { withQuestionMark } from "@/lib/text-question";

export const metadata: Metadata = { title: "Recovery and treatment decision guides", description: "Plain-language guides for verifying providers, understanding levels of care, and asking about treatment costs.", alternates: { canonical: "/guides" } };

export default async function GuidesPage() {
  const articles = await getPublishedArticleSummaries();
  const cards = [
    ...articles.map((article) => ({ slug: article.slug, title: article.title, description: article.excerpt, reviewedOn: article.reviewedAt, thumbnail: article.heroImageUrl || (article.hasThumbnail ? `/api/content/articles/${article.id}/thumbnail` : null), imageAlt: article.imageAlt })),
    ...guides.map((guide) => ({ slug: guide.slug, title: guide.title, description: guide.description, reviewedOn: guide.reviewedOn, thumbnail: null as string | null, imageAlt: "" })),
  ].filter((card, index, all) => all.findIndex((other) => other.slug === card.slug) === index);
  const groups = guideTopicOrder.map((topic) => ({ topic, cards: cards.filter((card) => guideTopic(card.slug).id === topic.id) })).filter((group) => group.cards.length > 0);

  return <>
    <IllustratedHero kind="guides" kicker="Guides" title="Clear questions for difficult decisions">
      <p>{cards.length} plain-language guides, grouped by what you are trying to work out. They are educational and do not replace advice from a qualified professional.</p>
    </IllustratedHero>
    <section className="section section-snug"><div className="shell">
      <nav className="guide-topic-nav" aria-label="Guide topics">{groups.map(({ topic, cards: items }) => <a key={topic.id} href={`#${topic.id}`}>{topic.label} ({items.length})</a>)}</nav>
      {groups.map(({ topic, cards: items }) => <section className="guide-topic" id={topic.id} key={topic.id}>
        <h2>{topic.label}</h2>
        <div className="guide-grid">{items.map((guide) => <article className="guide-card" key={guide.slug}>
          {guide.thumbnail
            ? <Image className="guide-card-thumb" src={guide.thumbnail} alt={guide.imageAlt} width={600} height={300} />
            : <SpotArt kind={topic.art} />}
          <span>Reviewed {new Date(guide.reviewedOn).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
          <h3><Link href={`/guides/${guide.slug}`} prefetch={false}>{withQuestionMark(guide.title)}</Link></h3>
          <p>{guide.description}</p>
          <Link className="card-link" href={`/guides/${guide.slug}`} prefetch={false}>Read guide <ArrowRight size={16} /></Link>
        </article>)}</div>
      </section>)}
    </div></section>
  </>;
}
