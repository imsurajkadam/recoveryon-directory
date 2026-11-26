import "server-only";

import { jsonrepair } from "jsonrepair";

// Minimal OpenRouter client for the article pipeline. Models are chosen for cost:
// DeepSeek V4.1 Flash researches, writes and fact-checks. Images come from OpenAI gpt-image-1-mini
// (cheapest per image), with Gemini Flash Lite on OpenRouter as the fallback.
export const MODELS = {
  research: "deepseek/deepseek-v4.1-flash",
  writer: "deepseek/deepseek-v4.1-flash",
  checker: "deepseek/deepseek-v4.1-flash",
  image: "google/gemini-3.1-flash-lite-image",
} as const;

type Message = { role: "system" | "user" | "assistant"; content: string };

export type ChatResult = {
  content: string;
  citations: { title?: string; url: string }[];
  images: string[];
  usage: { prompt_tokens?: number; completion_tokens?: number; cost?: number } | null;
};

export async function openRouterChat(body: Record<string, unknown> & { model: string; messages: Message[] }, timeoutMs = 240_000): Promise<ChatResult> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not configured");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://treatmentlane.com",
      "X-Title": "TreatmentLane article pipeline",
    },
    body: JSON.stringify({ ...body, usage: { include: true } }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`OpenRouter ${body.model} failed (${response.status}): ${text.slice(0, 400)}`);
  const json = JSON.parse(text) as {
    choices?: { message?: { content?: string | null; annotations?: { type: string; url_citation?: { url: string; title?: string } }[]; images?: { image_url?: { url?: string } }[] } }[];
    usage?: ChatResult["usage"];
    error?: { message?: string };
  };
  if (json.error) throw new Error(`OpenRouter ${body.model} error: ${json.error.message}`);
  const message = json.choices?.[0]?.message;
  if (!message) throw new Error(`OpenRouter ${body.model} returned no message`);
  return {
    content: message.content || "",
    citations: (message.annotations || []).flatMap((annotation) => annotation.type === "url_citation" && annotation.url_citation?.url ? [{ url: annotation.url_citation.url, title: annotation.url_citation.title }] : []),
    images: (message.images || []).flatMap((image) => image.image_url?.url ? [image.image_url.url] : []),
    usage: json.usage || null,
  };
}

/** Pulls the first JSON object out of a model reply (tolerates code fences and stray text). */
export function parseJsonReply<T = Record<string, unknown>>(content: string): T {
  const raw = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error(`Model reply had no JSON object: ${raw.slice(0, 200)}`);
  const candidate = raw.slice(start, end + 1);
  try {
    return JSON.parse(candidate) as T;
  } catch {
    // Models occasionally emit a stray comma or unescaped quote; repair before giving up.
    return JSON.parse(jsonrepair(candidate)) as T;
  }
}

/** Cheapest image route: OpenAI gpt-image-1-mini at low quality (WebP). Returns base64 or null. */
export async function openAiImage(prompt: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1-mini", prompt, size: "1536x1024", quality: "low", output_format: "webp", output_compression: 85 }),
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) {
    console.error("OpenAI image failed", response.status, (await response.text()).slice(0, 300));
    return null;
  }
  const json = await response.json() as { data?: { b64_json?: string }[] };
  return json.data?.[0]?.b64_json || null;
}
