import "server-only";

import type { ArticleFormat, ArticleTopic } from "@/lib/article-pipeline/topics";

// Prompts for each pipeline stage. Kept together so tone, safety rules and block shapes stay consistent.

export const VOICES = [
  "warm and plain-spoken, like a knowledgeable friend who has helped families through this",
  "practical consumer advocate: clear, direct, focused on saving the reader time and money",
  "calm, clinically informed explainer who defines every term the first time it appears",
  "myth-busting and reassuring: names common misconceptions, then corrects them with evidence",
];

const FORMATS: Record<ArticleFormat, string> = {
  explainer: "key_takeaways, then a 2-3 sentence plain answer, a 'what it is' section, 'how it works' as a steps block, 'who it helps' as a table or checklist, the stats block, a safety callout (tone warning if there is any medical risk), a cta block, then FAQs",
  comparison: "key_takeaways, then a short verdict paragraph, a REQUIRED comparison table (4-6 rows such as what it is, setting, typical length, cost and coverage, best for, risks), 'when to choose' sections for each option with a checklist each, the stats block, a cta, then FAQs",
  checklist: "key_takeaways, then why this decision matters, a REQUIRED checklist block (8-12 items), a red flags callout (tone warning), a table of questions to ask and what a good answer sounds like, the stats block, a cta, then FAQs",
  timeline: "key_takeaways, then an emergency callout (tone warning) near the top when withdrawal or overdose is involved, a REQUIRED timeline table (stage, timing, what to expect, when to get help), factors that change the timeline as a list, a steps block for getting support, the stats block, a cta, then FAQs",
  cost: "key_takeaways, then a short answer with realistic ranges (only cited figures from the research), a REQUIRED cost table by level of care or plan type, what drives the price as a list, a steps block for lowering costs and checking coverage, a hidden costs checklist, the stats block, a cta, then FAQs",
  qa: "key_takeaways, then a 2-3 sentence direct answer, H2 sections phrased as the real questions people ask, a table (for example plan types, or what is usually covered versus not), a steps block to check your own coverage or situation, the stats block, a cta, then FAQs",
  steps: "key_takeaways, then who this is for, a REQUIRED steps block (5-8 actionable steps), a checklist of what to have ready, a tip callout, the stats block, a cta, then FAQs",
};

export function researchMessages(topic: ArticleTopic) {
  return [
    {
      role: "system" as const,
      content: "You are a medical research assistant for TreatmentLane, a US directory of addiction and mental health treatment providers. You search the web, open authoritative sources, and report only facts you actually found. Never invent statistics, URLs, prices or coverage rules.",
    },
    {
      role: "user" as const,
      content: [
        `Research this topic for a consumer health article for US readers: "${topic.keyword}". Planned format: ${topic.format}.`,
        "Prefer: SAMHSA, NIDA, NIAAA, CDC, FDA, CMS and Medicare.gov, Medicaid.gov, HealthCare.gov, VA.gov, TRICARE.mil, MedlinePlus, NIH/NCBI, state health agencies, ASAM, and the insurer's own official pages for insurance topics. Never use rehab marketing sites or forums as evidence.",
        "Return ONLY a JSON object (no markdown) with keys:",
        "search_intent: one sentence on what the searcher wants",
        "key_facts: 8-14 objects {fact, source_url, source_title, publisher}, each one specific sentence with the exact page it came from",
        "numbers: objects {value, meaning, source_url} for figures worth a table (timelines, costs, percentages, hours)",
        "people_also_ask: 5-8 real questions people search",
        "competitor_gaps: 4-6 things the current top results explain badly or skip",
        "safety_notes: risks or emergency warnings the article must include",
        "sources: 4-8 objects {title, url, publisher} for pages you actually opened (https only)",
      ].join("\n"),
    },
  ];
}

export function writerMessages(input: {
  topic: ArticleTopic;
  voice: string;
  research: unknown;
  listingData: unknown;
  existingGuides: string[];
  relatedGuides: { path: string; title: string }[];
  feedback?: string[];
}) {
  const { topic } = input;
  const data = input.listingData
    ? `TreatmentLane listing data (describe as "TreatmentLane lists..." and never as all providers in an area): ${JSON.stringify(input.listingData)}`
    : "No TreatmentLane data is available for this topic: leave out the stats block.";
  const system = [
    "You write for TreatmentLane (treatmentlane.com), a US directory that helps people compare addiction and mental health treatment providers.",
    `Voice for this article: ${input.voice}. Do not imitate any named writer and never invent personal stories.`,
    "This is health content: educate, never diagnose, never give individual medical instructions, never promise outcomes, and say clearly when a clinician has to decide.",
    "Every specific fact, figure, timeline or coverage rule must come from the research JSON and be cited inline as [publisher or page title](https URL), using only URLs from the research.",
    "STYLE RULES: no em dashes or en dashes anywhere (use commas, colons or two sentences). Any heading or title phrased as a question ends with a question mark. US spelling. Paragraphs of 2-4 sentences. Concrete and useful. Never use filler such as \"in today's world\", \"it is important to note\", \"navigating\", \"journey\", \"delve\" or \"landscape\".",
    `Internal links: use [label](/path) only for these TreatmentLane pages: ${topic.pillar}, /directory, /insurance, /care, /emergency-help, /sober-living-near-me, /iop-near-me, /detox-centers-near-me, and these guides: ${input.existingGuides.slice(0, 150).join(", ")}. Any other internal path is a broken link.`,
    "SEO RULES (the article must be the most useful result for this search):",
    "- Put the primary keyword (or a natural close variant) in the title, the seo_title, the meta_description, the first 100 words, and at least one H2. Never stuff it: use it naturally, and use the secondary keywords and related phrases across headings and body.",
    "- Right after key_takeaways, answer the search query directly in a 40-60 word paragraph that could be quoted as a featured snippet.",
    "- Phrase most H2s as the real questions people search (from people_also_ask), each followed by a direct 1-2 sentence answer before details.",
    "- FAQ answers: 40-70 words each, self-contained, answering the question in the first sentence. Do not repeat FAQs that the body already answers word for word.",
    "- seo_title: max 60 characters, keyword near the start, no site name. meta_description: 140-155 characters, includes the keyword and a reason to click.",
    "- image_alt: describes the illustration and includes the topic naturally.",
    "INTERNAL LINKING (required, this is how the site ranks):",
    "- Include 5 to 9 internal links inside paragraphs, list items, steps or callouts, spread across the article (not all in one section).",
    `- Link the pillar page ${topic.pillar} once, early in the article.`,
    `- Link at least 3 different guides from this most-related list, where they genuinely help the reader: ${input.relatedGuides.map((guide) => `${guide.title} (${guide.path})`).join("; ") || "none yet"}.`,
    "- Link one listings page (/directory, a /care page, a near-me page or an /insurance page) where the reader would act.",
    "- Anchor text must be descriptive words from the sentence that say what the linked page covers (for example [how long medical detox takes](/guides/...)). Never use 'click here', 'this guide', 'read more' or a bare URL. Never link the same page twice, and never link to this article itself.",
  ].join("\n");
  const blocks = [
    "article_blocks is an ordered array that mixes several block kinds (never only paragraphs). Allowed shapes:",
    '{"type":"key_takeaways","items":["3-5 short sentences"]} (always first)',
    '{"type":"heading","text":"...","level":2} or level 3',
    '{"type":"paragraph","text":"may include [label](/path) and [source](https://...) links"}',
    '{"type":"list","items":["..."],"ordered":false}',
    '{"type":"table","headers":["2-6 columns"],"rows":[["exactly one cell per header"]],"caption":"optional"}',
    '{"type":"steps","title":"optional","items":[{"title":"short","text":"1-3 sentences"}]} (2-10 items)',
    '{"type":"checklist","title":"optional","items":["..."]} (2-15 items)',
    '{"type":"stats","title":"From TreatmentLane listings","items":[{"value":"16,072","label":"listings accept Medicaid"}],"note":"Counts of published TreatmentLane listings as of DATE."} (2-4 items, numbers ONLY from the TreatmentLane data, with commas)',
    '{"type":"callout","tone":"info|tip|warning","title":"optional","text":"..."} (a warning callout must tell readers to call 911 in a medical emergency and call or text 988 in a mental health crisis)',
    '{"type":"image","image_key":"inline-1","alt":"descriptive alt text","caption":"short caption"} (exactly one, right after the second H2)',
    '{"type":"cta","text":"one sentence","label":"2-4 words","href":"/internal-path"} (one or two, pointing to listings pages)',
  ].join("\n");
  const user = [
    `Write the article for the primary keyword "${topic.keyword}". Required slug: ${topic.slug}. Category: ${topic.category}.`,
    `Structure (${topic.format}): ${FORMATS[topic.format]}.`,
    "Length: 1,400 to 2,000 words of body text. Cover the competitor gaps and the people-also-ask questions from the research.",
    data,
    `Research JSON: ${JSON.stringify(input.research)}`,
    blocks,
    input.feedback?.length ? `A fact-checker rejected the previous draft. Fix every one of these problems: ${input.feedback.join(" | ")}` : "",
    "Return ONLY one JSON object with keys: title (50-65 characters, includes the keyword naturally), seo_title (max 60 characters), meta_description (140-155 characters), excerpt (1-2 sentences), secondary_keywords (4-8 strings), article_blocks, faq (4-6 objects {question, answer}), sources (the research sources you cited, as {title, url, publisher}), image_alt (alt text for the hero image), image_prompts {hero, inline} (each describes ONE simple editorial illustration for this topic).",
  ].filter(Boolean).join("\n\n");
  return [{ role: "system" as const, content: system }, { role: "user" as const, content: user }];
}

export function checkerMessages(article: unknown, research: unknown, listingData: unknown) {
  return [
    {
      role: "system" as const,
      content: "You are a strict medical and consumer-protection editor for TreatmentLane. You check health articles before they are published automatically.",
    },
    {
      role: "user" as const,
      content: [
        "Check this article package against the research it was written from.",
        `Article: ${JSON.stringify(article)}`,
        `Research: ${JSON.stringify(research)}`,
        `TreatmentLane listing data the writer was given (stats blocks may quote these numbers): ${JSON.stringify(listingData ?? null)}`,
        "Blocking problems are ONLY: unsafe medical guidance; a clinical, statistical, cost or coverage claim with no matching source in the research; a contradiction of a cited source; diagnosing or giving individual treatment instructions; promised outcomes; a missing emergency warning where withdrawal, overdose or crisis is discussed; invented TreatmentLane numbers; text that reads as marketing for a specific provider.",
        "Minor wording, style or nice-to-have additions are NOT blocking.",
        'Return ONLY JSON: {"approved": boolean, "blocking_issues": ["..."], "suggestions": ["..."]}. approved is true only when blocking_issues is empty.',
      ].join("\n\n"),
    },
  ];
}

export function imagePrompt(description: string) {
  return [
    `Editorial illustration for a healthcare information website: ${description}.`,
    "Style: flat modern vector illustration, simple shapes, soft gradients, calm and trustworthy, generous empty space.",
    "Colors: deep navy (#1F3A5F), calm teal (#2A9D8F), warm off-white background (#F4EFE6), small soft coral accents.",
    "Landscape 3:2 composition, subject centered, readable as a small thumbnail.",
    "Strictly no text, letters, numbers or logos. No realistic faces. No pills, capsules, syringes, needles, alcohol bottles, drugs, blood or distressed people.",
  ].join(" ");
}

/** Asks for one existing paragraph to be lightly rewritten so it links to a newly published guide. */
export function interlinkMessages(input: { newTitle: string; newPath: string; newSummary: string; oldTitle: string; paragraphs: { index: number; text: string }[] }) {
  return [
    {
      role: "system" as const,
      content: "You are the internal-linking editor for TreatmentLane, a US directory of addiction and mental health treatment providers. You add one natural, genuinely helpful link from an existing article to a new one, changing as few words as possible.",
    },
    {
      role: "user" as const,
      content: [
        `New article: "${input.newTitle}" at ${input.newPath}. What it covers: ${input.newSummary}`,
        `Existing article: "${input.oldTitle}". Its paragraphs, numbered:`,
        input.paragraphs.map((paragraph) => `[${paragraph.index}] ${paragraph.text}`).join("\n\n"),
        "Pick the ONE paragraph where a reader would most want the new article, and return it with one link added as [descriptive anchor words](" + input.newPath + ").",
        "Rules: keep every existing sentence, fact and link exactly as it is; you may add or adjust at most one short clause so the link reads naturally; the anchor text must describe what the new article covers (never 'click here', 'this guide' or 'read more'); no em or en dashes; US spelling.",
        "If no paragraph is a genuinely natural fit, skip.",
        `Return ONLY JSON: {"block_index": number, "text": "the full rewritten paragraph"} or {"skip": true}.`,
      ].join("\n\n"),
    },
  ];
}
