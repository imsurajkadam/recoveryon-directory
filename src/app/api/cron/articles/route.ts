import { timingSafeEqual } from "node:crypto";
import { after, NextResponse } from "next/server";
import { pipelineStatus, runPipelineStep } from "@/lib/article-pipeline/run";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Vercel Cron calls this once a day with "Authorization: Bearer $CRON_SECRET". Each call answers
// straight away, runs one pipeline stage in the background, then calls itself again until the
// day's articles are done. Add ?status=1 to see progress without running anything.

// Accepts Vercel's CRON_SECRET or PIPELINE_TRIGGER_SECRET (used by the Supabase pg_cron job that
// restarts the chain every 10 minutes, because Vercel stops a function that keeps calling itself).
function authorized(request: Request) {
  const supplied = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  if (!supplied) return false;
  return [process.env.CRON_SECRET, process.env.PIPELINE_TRIGGER_SECRET].some((secret) =>
    Boolean(secret) && secret!.length === supplied.length && timingSafeEqual(Buffer.from(secret!), Buffer.from(supplied)));
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (new URL(request.url).searchParams.has("status")) return NextResponse.json(await pipelineStatus());

  after(async () => {
    try {
      const result = await runPipelineStep();
      console.log("article pipeline step", JSON.stringify(result));
      if (result.more) {
        const next = await fetch(absoluteUrl("/api/cron/articles"), {
          headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
          cache: "no-store",
          signal: AbortSignal.timeout(30_000),
        }).catch((error) => { console.error("article pipeline chain failed", error); return null; });
        if (next && next.status !== 202) console.error("article pipeline chain refused", next.status, (await next.text()).slice(0, 200));
      }
    } catch (error) {
      console.error("article pipeline step crashed", error);
    }
  });
  return NextResponse.json({ accepted: true }, { status: 202 });
}
