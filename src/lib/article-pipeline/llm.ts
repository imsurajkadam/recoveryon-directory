import "server-only";

import { CLAUDE_MODEL, claudeChat, claudeConfigured, ClaudeError } from "@/lib/article-pipeline/anthropic";
import { MODELS, openRouterChat, type ChatResult } from "@/lib/article-pipeline/openrouter";

// Picks the provider for each text stage. Claude while its credits last; DeepSeek on OpenRouter otherwise.

type Stage = "research" | "write" | "check" | "link";
type Message = { role: "system" | "user" | "assistant"; content: string };

const CLAUDE_LIMITS: Record<Stage, { maxTokens: number; webSearch?: number }> = {
  research: { maxTokens: 8000, webSearch: 6 },
  write: { maxTokens: 20000 },
  check: { maxTokens: 6000 },
  link: { maxTokens: 2500 },
};

// Set once Claude says the key or credits are no longer usable, so the rest of this run skips it.
let claudeDown = false;

/** True while articles are being written by Claude (used for the daily pace). */
export function usingClaude() {
  return claudeConfigured() && !claudeDown;
}

export async function pipelineChat(
  stage: Stage,
  messages: Message[],
  openRouterOptions: Record<string, unknown>,
): Promise<ChatResult & { model: string }> {
  if (usingClaude()) {
    try {
      const reply = await claudeChat({ messages, ...CLAUDE_LIMITS[stage] });
      if (reply.content.trim()) return { ...reply, model: CLAUDE_MODEL };
      console.error("Claude returned an empty reply; falling back to OpenRouter", stage);
    } catch (error) {
      // A timeout means the step already used most of its time budget: let the stage retry later.
      if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) throw error;
      if (error instanceof ClaudeError && error.unavailable) claudeDown = true;
      console.error("Claude failed; falling back to OpenRouter", stage, error instanceof Error ? error.message : error);
    }
  }
  const model = MODELS[stage === "write" || stage === "link" ? "writer" : stage === "check" ? "checker" : "research"];
  const reply = await openRouterChat({ model, messages, ...openRouterOptions });
  return { ...reply, model };
}
