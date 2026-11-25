import "server-only";

import { saveArticlePackage, validateArticlePackage } from "@/lib/article-store";
import { MODELS, openAiImage, openRouterChat, parseJsonReply } from "@/lib/article-pipeline/openrouter";
import { checkerMessages, imagePrompt, researchMessages, VOICES, writerMessages } from "@/lib/article-pipeline/prompts";
import { ARTICLE_TOPICS, type ArticleTopic } from "@/lib/article-pipeline/topics";
import { guides } from "@/lib/content";
import { getDatabase } from "@/lib/db";
import { notifyArticlePipeline } from "@/lib/form-notifications";
import { getListingContext } from "@/lib/listing-context";
import { uploadArticleWebp } from "@/lib/r2";

// The article pipeline runs one stage per call so every call fits in a serverless time limit:
//   research -> write -> check -> publish -> done
// Jobs live in content_pipeline_jobs; each day gets a random target of 5-10 articles (IST).

type Stage = "research" | "write" | "check" | "publish" | "done" | "failed";
type JobData = {
  voice?: string;
  research?: Record<string, unknown> & { sources?: { title?: string; url: string; publisher?: string }[] };
  listing?: unknown;
  article?: Record<string, unknown>;
  feedback?: string[];
  check?: unknown;
  cost?: number;
  published_url?: string;
};
type Job = { id: string; topic_id: string; slug: string; stage: Stage; attempts: number; revisions: number; data: JobData };

const MAX_STAGE_ATTEMPTS = 3;
const MAX_REVISIONS = 1;
const MAX_STEPS_PER_DAY = 90;

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function topicFor(job: Pick<Job, "topic_id">): ArticleTopic {
  const topic = ARTICLE_TOPICS.find((item) => item.id === job.topic_id);
  if (!topic) throw new Error(`Unknown topic ${job.topic_id}`);
  return topic;
}

function addCost(data: JobData, cost: number | undefined) {
  data.cost = Math.round(((data.cost || 0) + (cost || 0)) * 10000) / 10000;
}

/** Removes em and en dashes everywhere (house style) and trims strings. */
function cleanStrings<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replace(/(\d)\s*[–—]\s*(\d)/g, "$1-$2")
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/ {2,}/g, " ")
      .trim() as T;
  }
  if (Array.isArray(value)) return value.map(cleanStrings) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanStrings(item)])) as T;
  return value;
}

async function existingGuidePaths() {
  const sql = getDatabase();
  const rows = sql ? await sql`select slug from content_articles where status = 'published'` : [];
  return [...new Set([...guides.map((guide) => guide.slug), ...rows.map((row) => String(row.slug))])].map((slug) => `/guides/${slug}`);
}

async function runResearch(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  data.voice = data.voice || VOICES[ARTICLE_TOPICS.indexOf(topic) % VOICES.length];
  data.listing = await getListingContext(topic.filters).catch(() => null);
  const reply = await openRouterChat({
    model: MODELS.research,
    temperature: 0.2,
    max_tokens: 6000,
    messages: researchMessages(topic),
    tools: [{ type: "openrouter:web_search", parameters: { engine: "exa", max_results: 4, max_total_results: 8 } }],
  });
  addCost(data, reply.usage?.cost);
  const research = parseJsonReply<NonNullable<JobData["research"]>>(reply.content);
  const sources = (research.sources || []).filter((source) => typeof source?.url === "string" && source.url.startsWith("https://"));
  for (const citation of reply.citations) {
    if (sources.length >= 8) break;
    if (citation.url.startsWith("https://") && !sources.some((source) => source.url === citation.url)) sources.push({ title: citation.title, url: citation.url });
  }
  if (sources.length < 2) throw new Error("Research found fewer than 2 usable sources");
  research.sources = sources;
  data.research = research;
  return "write" as Stage;
}

async function runWrite(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  const reply = await openRouterChat({
    model: MODELS.writer,
    temperature: 0.7,
    max_tokens: 24000,
    reasoning: { effort: "low" },
    response_format: { type: "json_object" },
    messages: writerMessages({ topic, voice: data.voice || VOICES[0], research: data.research, listingData: data.listing, existingGuides: await existingGuidePaths(), feedback: data.feedback }),
  });
  addCost(data, reply.usage?.cost);
  const article = cleanStrings(parseJsonReply<Record<string, unknown>>(reply.content));
  const blocks = Array.isArray(article.article_blocks) ? article.article_blocks as Record<string, unknown>[] : [];
  if (blocks.length < 8) throw new Error(`Draft too thin (${blocks.length} blocks)`);
  const kinds = new Set(blocks.map((block) => block.type));
  if (!kinds.has("key_takeaways") || (!kinds.has("table") && !kinds.has("steps") && !kinds.has("checklist"))) {
    throw new Error("Draft is missing key takeaways or a structured block (table, steps or checklist)");
  }
  data.article = article;
  return "check" as Stage;
}

async function runCheck(job: Job) {
  const data = job.data;
  const reply = await openRouterChat({
    model: MODELS.checker,
    temperature: 0,
    max_tokens: 8000,
    reasoning: { effort: "low" },
    response_format: { type: "json_object" },
    messages: checkerMessages(data.article, data.research, data.listing),
  });
  addCost(data, reply.usage?.cost);
  const verdict = parseJsonReply<{ approved?: boolean; blocking_issues?: string[]; suggestions?: string[] }>(reply.content);
  data.check = verdict;
  const issues = (verdict.blocking_issues || []).filter((issue) => typeof issue === "string" && issue.trim());
  if (verdict.approved === true && issues.length === 0) return "publish" as Stage;
  if (job.revisions < MAX_REVISIONS) {
    data.feedback = issues.length ? issues : ["The checker did not approve the draft. Tighten sourcing and safety language."];
    job.revisions += 1;
    return "write" as Stage;
  }
  throw Object.assign(new Error(`Fact check rejected the article twice: ${issues.join(" | ").slice(0, 600)}`), { final: true });
}

async function generateImage(description: string) {
  const prompt = imagePrompt(description);
  const viaOpenAi = await openAiImage(prompt).catch(() => null);
  if (viaOpenAi) return { base64: viaOpenAi, cost: 0.006 };
  const reply = await openRouterChat({
    model: MODELS.image,
    messages: [{ role: "user", content: prompt }],
    modalities: ["image", "text"],
    image_config: { aspect_ratio: "3:2" },
  }, 120_000);
  const dataUrl = reply.images[0];
  return { base64: dataUrl ? dataUrl.replace(/^data:image\/[a-z+]+;base64,/, "") : null, cost: reply.usage?.cost };
}

async function runPublish(job: Job) {
  const topic = topicFor(job);
  const data = job.data;
  const article = { ...(data.article || {}) };
  const prompts = (article.image_prompts || {}) as { hero?: string; inline?: string };
  const stamp = Date.now().toString(36);

  let heroUrl: string | null = null;
  let inlineUrl: string | null = null;
  for (const [kind, description] of [["hero", prompts.hero || topic.keyword], ["inline", prompts.inline]] as const) {
    if (!description) continue;
    try {
      const image = await generateImage(description);
      addCost(data, image.cost);
      const url = image.base64 ? await uploadArticleWebp(`${topic.slug}/${stamp}-${kind}`, image.base64) : null;
      if (kind === "hero") heroUrl = url; else inlineUrl = url;
    } catch (error) {
      console.error("Article image failed", topic.slug, kind, error);
    }
  }

  const blocks = (Array.isArray(article.article_blocks) ? article.article_blocks as Record<string, unknown>[] : []).flatMap((block) => {
    if (block.type !== "image") return [block];
    return inlineUrl ? [{ type: "image", src: inlineUrl, alt: block.alt || topic.keyword, caption: block.caption }] : [];
  });
  const clip = (value: unknown, max: number) => String(value || "").slice(0, max).trim();
  const pkg = {
    content_unit_id: `TLP-${topic.id}`,
    title: clip(article.title, 180),
    slug: topic.slug,
    excerpt: clip(article.excerpt, 500),
    seo_title: clip(article.seo_title || article.title, 60),
    meta_description: clip(article.meta_description, 175),
    primary_keyword: topic.keyword,
    secondary_keywords: (Array.isArray(article.secondary_keywords) ? article.secondary_keywords : []).slice(0, 12).map((item) => clip(item, 180)).filter((item) => item.length >= 2),
    category: topic.category,
    author_name: "TreatmentLane Editorial Team",
    automated_quality_gate_passed: true,
    article_blocks: blocks,
    faq: (Array.isArray(article.faq) ? article.faq : []).slice(0, 8),
    sources: (Array.isArray(article.sources) && article.sources.length ? article.sources : data.research?.sources || []).filter((source: { url?: string }) => typeof source?.url === "string" && source.url.startsWith("https://")).slice(0, 12),
    claim_source_map: [],
    internal_links: [topic.pillar],
    image_alt: clip(article.image_alt || `Illustration for ${topic.keyword}`, 300),
    hero_image_url: heroUrl || undefined,
    status: "published" as const,
  };
  const parsed = validateArticlePackage(pkg);
  if (!parsed.success) {
    const problems = parsed.error.issues.slice(0, 8).map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    if (job.revisions < MAX_REVISIONS + 1) {
      data.feedback = [`The article JSON failed validation. Fix: ${problems.join("; ")}`];
      job.revisions += 1;
      return "write" as Stage;
    }
    throw Object.assign(new Error(`Article failed validation: ${problems.join("; ")}`), { final: true });
  }
  const result = await saveArticlePackage(parsed.data, `pipeline-${topic.slug}`);
  if (result.status >= 300) throw new Error(`Saving failed (${result.status}): ${JSON.stringify(result.body).slice(0, 300)}`);
  data.published_url = `https://treatmentlane.com/guides/${topic.slug}`;
  return "done" as Stage;
}

const RUNNERS: Record<"research" | "write" | "check" | "publish", (job: Job) => Promise<Stage>> = {
  research: runResearch,
  write: runWrite,
  check: runCheck,
  publish: runPublish,
};

export async function pipelineStatus() {
  const sql = getDatabase();
  if (!sql) return null;
  const day = todayInIndia();
  const [today] = await sql`select * from content_pipeline_days where day = ${day}`;
  const jobs = await sql`select topic_id, slug, stage, attempts, revisions, last_error, data->>'cost' as cost,
    data->>'published_url' as published_url, updated_at from content_pipeline_jobs order by created_at desc limit 25`;
  return { day, today: today || null, topics_total: ARTICLE_TOPICS.length, recent_jobs: jobs };
}

/** Runs one stage of one job. Returns whether more work remains today. */
export async function runPipelineStep(): Promise<{ action: string; more: boolean; detail?: string }> {
  const sql = getDatabase();
  if (!sql) return { action: "no-database", more: false };
  const day = todayInIndia();
  const target = 5 + Math.floor(Math.random() * 6);
  await sql`insert into content_pipeline_days (day, target) values (${day}, ${target}) on conflict (day) do nothing`;
  const [counter] = await sql`update content_pipeline_days set steps = steps + 1 where day = ${day} returning target, published, steps`;
  if (counter.steps > MAX_STEPS_PER_DAY) return { action: "step-limit", more: false };

  // Claim an unfinished job (the lock stops two overlapping calls from working on the same job).
  let [row] = await sql`update content_pipeline_jobs set locked_until = now() + interval '6 minutes', updated_at = now()
    where id = (select id from content_pipeline_jobs
      where stage in ('research', 'write', 'check', 'publish') and (locked_until is null or locked_until < now())
      order by created_at limit 1 for update skip locked)
    returning id, topic_id, slug, stage, attempts, revisions, data`;

  if (!row) {
    const [busy] = await sql`select count(*)::int as n from content_pipeline_jobs where stage in ('research', 'write', 'check', 'publish')`;
    if (busy.n > 0) return { action: "waiting-for-lock", more: false };
    if (counter.published >= counter.target) return { action: "daily-target-reached", more: false };
    const taken = new Set([
      ...(await sql`select slug from content_articles`).map((item) => String(item.slug)),
      ...(await sql`select slug from content_pipeline_jobs`).map((item) => String(item.slug)),
      ...guides.map((guide) => guide.slug),
    ]);
    const topic = ARTICLE_TOPICS.find((item) => !taken.has(item.slug));
    if (!topic) {
      if (counter.published === 0) await notifyArticlePipeline("topic list used up", [{ label: "What to do", value: "All topics in src/lib/article-pipeline/topics.ts are published or failed. Add new topics to keep publishing." }]).catch(() => undefined);
      return { action: "topics-used-up", more: false };
    }
    [row] = await sql`insert into content_pipeline_jobs (topic_id, slug, stage, started_on, locked_until)
      values (${topic.id}, ${topic.slug}, 'research', ${day}, now() + interval '6 minutes')
      on conflict (slug) do nothing
      returning id, topic_id, slug, stage, attempts, revisions, data`;
    if (!row) return { action: "topic-race", more: true };
  }

  const job = { ...row, data: (row.data || {}) as JobData } as Job;
  const stage = job.stage as keyof typeof RUNNERS;
  try {
    const nextStage = await RUNNERS[stage](job);
    await sql`update content_pipeline_jobs set stage = ${nextStage}, attempts = 0, revisions = ${job.revisions},
      data = ${sql.json(JSON.parse(JSON.stringify(job.data)))}::jsonb, last_error = null, locked_until = null, updated_at = now()
      where id = ${job.id}`;
    if (nextStage === "done") await sql`update content_pipeline_days set published = published + 1 where day = ${day}`;
    return { action: `${job.slug}: ${stage} -> ${nextStage}`, more: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const attempts = job.attempts + 1;
    const failed = Boolean((error as { final?: boolean }).final) || attempts >= MAX_STAGE_ATTEMPTS;
    await sql`update content_pipeline_jobs set stage = ${failed ? "failed" : job.stage}, attempts = ${attempts},
      revisions = ${job.revisions}, data = ${sql.json(JSON.parse(JSON.stringify(job.data)))}::jsonb,
      last_error = ${message.slice(0, 2000)}, locked_until = null, updated_at = now() where id = ${job.id}`;
    if (failed) {
      await notifyArticlePipeline(`article failed: ${job.slug}`, [
        { label: "Topic", value: `${job.topic_id} (${job.slug})` },
        { label: "Stage", value: stage },
        { label: "Error", value: message.slice(0, 1500) },
        { label: "What happens next", value: "The pipeline skips this topic and moves on to the next one." },
      ]).catch(() => undefined);
    }
    return { action: `${job.slug}: ${stage} error${failed ? " (gave up)" : ""}`, more: true, detail: message.slice(0, 300) };
  }
}
