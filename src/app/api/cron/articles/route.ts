import { timingSafeEqual } from "node:crypto";
import { after, NextResponse } from "next/server";
import { pipelineStatus, runPipelineStep } from "@/lib/article-pipeline/run";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Vercel Cron calls this twice a day with "Authorization: Bearer $CRON_SECRET". Each call answers
// straight away and works through pipeline stages in the background until the day's articles are
// done or about three minutes have passed. Add ?status=1 to see progress without running anything.

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  if (!secret || !supplied || secret.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(secret), Buffer.from(supplied));
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (new URL(request.url).searchParams.has("status")) return NextResponse.json(await pipelineStatus());

  after(async () => {
    // Run as many stages as fit in this call (a whole article usually takes about two minutes).
    // Only hand off to a fresh call when time runs short, because Vercel limits how many times a
    // site can call itself in a row.
    const startedAt = Date.now();
    try {
      for (;;) {
        const result = await runPipelineStep();
        console.log("article pipeline step", JSON.stringify(result));
        if (!result.more) break;
        if (Date.now() - startedAt > 170_000) {
          const response = await fetch(absoluteUrl("/api/cron/articles"), {
            headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
            cache: "no-store",
            signal: AbortSignal.timeout(30_000),
          }).catch((error) => {
            console.error("article pipeline hand-off failed", error);
            return null;
          });
          if (response && !response.ok) console.error("article pipeline hand-off refused", response.status);
          break;
        }
      }
    } catch (error) {
      console.error("article pipeline step crashed", error);
    }
  });
  return NextResponse.json({ accepted: true }, { status: 202 });
}
