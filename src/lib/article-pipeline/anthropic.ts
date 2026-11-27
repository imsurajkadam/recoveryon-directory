import "server-only";

import type { ChatResult } from "@/lib/article-pipeline/openrouter";

// Claude (Anthropic API) client for the article pipeline. Used while the prepaid Claude API credits
// last (ANTHROPIC_CREDITS_UNTIL, default 9 Dec 2026). After that, or if the key is missing or the
// credits run out, the pipeline falls back to DeepSeek on OpenRouter (see llm.ts).

export const CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

// USD per million tokens, and per web search. Claude Sonnet 5.5 list prices.
const PRICE = { input: 2, output: 10, cacheWrite: 2.5, cacheRead: 0.2, search: 0.01 };

const DEFAULT_UNTIL = "2026-12-09T07:30:00Z";

export function claudeConfigured() {
  if (!process.env.ANTHROPIC_API_KEY) return false;
  const until = Date.parse(process.env.ANTHROPIC_CREDITS_UNTIL || DEFAULT_UNTIL);
  return Number.isNaN(until) || Date.now() < until;
}

type Message = { role: "system" | "user" | "assistant"; content: string };
type Block = {
  type: string;
  text?: string;
  citations?: { type: string; url?: string; title?: string }[];
  content?: { type: string; url?: string; title?: string }[] | { type: string };
};
type Usage = {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  server_tool_use?: { web_search_requests?: number };
};

export class ClaudeError extends Error {
  constructor(message: string, public status: number, public unavailable: boolean) {
    super(message);
  }
}

function costOf(usage: Usage | undefined) {
  if (!usage) return 0;
  return (
    ((usage.input_tokens || 0) * PRICE.input +
      (usage.output_tokens || 0) * PRICE.output +
      (usage.cache_creation_input_tokens || 0) * PRICE.cacheWrite +
      (usage.cache_read_input_tokens || 0) * PRICE.cacheRead) / 1_000_000 +
    (usage.server_tool_use?.web_search_requests || 0) * PRICE.search
  );
}

/**
 * Sends one request to Claude. `webSearch` turns on Anthropic's server-side web search tool.
 * Returns the same shape as openRouterChat so the pipeline does not care which provider answered.
 */
export async function claudeChat(input: { messages: Message[]; maxTokens: number; webSearch?: number }, timeoutMs = 270_000): Promise<ChatResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new ClaudeError("ANTHROPIC_API_KEY is not configured", 0, true);

  const system = input.messages.filter((message) => message.role === "system").map((message) => message.content).join("\n\n");
  const messages: { role: "user" | "assistant"; content: string | Block[] }[] = input.messages
    .filter((message) => message.role !== "system")
    .map((message) => ({ role: message.role as "user" | "assistant", content: message.content }));
  const headers: Record<string, string> = {
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  };
  if (process.env.ANTHROPIC_WORKSPACE_ID) headers["anthropic-workspace-id"] = process.env.ANTHROPIC_WORKSPACE_ID;

  const deadline = Date.now() + timeoutMs;
  const allBlocks: Block[] = [];
  let finalBlocks: Block[] = [];
  let cost = 0;
  let promptTokens = 0;
  let completionTokens = 0;

  // A turn that uses server tools can pause ("pause_turn"); send it back to let Claude continue.
  for (let round = 0; round < 3; round += 1) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: input.maxTokens,
        ...(system ? { system } : {}),
        messages,
        ...(input.webSearch ? { tools: [{ type: "web_search_20250305", name: "web_search", max_uses: input.webSearch }] } : {}),
      }),
      signal: AbortSignal.timeout(Math.max(10_000, deadline - Date.now())),
    });
    const text = await response.text();
    if (!response.ok) {
      // 401/403: bad key or workspace. 402 or a "credit balance" 400: credits used up or expired.
      const unavailable = [401, 402, 403, 404].includes(response.status) || /credit balance|billing|workspace/i.test(text);
      throw new ClaudeError(`Claude ${CLAUDE_MODEL} failed (${response.status}): ${text.slice(0, 400)}`, response.status, unavailable);
    }
    const json = JSON.parse(text) as { content?: Block[]; stop_reason?: string; usage?: Usage };
    const content = json.content || [];
    cost += costOf(json.usage);
    promptTokens += json.usage?.input_tokens || 0;
    completionTokens += json.usage?.output_tokens || 0;
    allBlocks.push(...content);
    finalBlocks = content;
    if (json.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content });
  }

  // The answer is the text written after the last search result (earlier text is "searching..." chatter).
  const lastSearch = finalBlocks.map((block) => block.type).lastIndexOf("web_search_tool_result");
  const answer = finalBlocks.slice(lastSearch + 1).filter((block) => block.type === "text").map((block) => block.text || "").join("");

  const citations: ChatResult["citations"] = [];
  const addCitation = (url?: string, title?: string) => {
    if (url && !citations.some((item) => item.url === url)) citations.push({ url, title });
  };
  for (const block of allBlocks) {
    if (block.type === "text") for (const citation of block.citations || []) addCitation(citation.url, citation.title);
  }
  for (const block of allBlocks) {
    if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      for (const result of block.content) if (result.type === "web_search_result") addCitation(result.url, result.title);
    }
  }

  return {
    content: answer,
    citations,
    images: [],
    usage: { prompt_tokens: promptTokens, completion_tokens: completionTokens, cost: Math.round(cost * 10000) / 10000 },
  };
}
