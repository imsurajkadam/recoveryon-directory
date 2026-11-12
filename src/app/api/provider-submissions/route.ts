import { NextResponse } from "next/server";
import { z } from "zod";
import { createProviderSubmission } from "@/lib/db";
import { notifyProviderSubmission } from "@/lib/form-notifications";

const schema = z.object({
  organizationName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(120),
  workEmail: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  website: z.union([z.string().trim().url().max(300), z.literal("")]).optional().default(""),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().length(2),
  relationship: z.string().trim().min(2).max(100),
  notes: z.string().trim().max(2000).optional().default(""),
  listingReference: z.union([z.string().trim().regex(/^\/providers\/[a-z0-9/-]+$/).max(300), z.literal("")]).optional().default(""),
  listingDescription: z.string().trim().max(1500).optional().default(""),
  photoUrls: z.string().trim().max(1500).optional().default(""),
  photoRights: z.string().optional().default(""),
  companyFax: z.string().max(0).optional().default(""),
});

/** Claim details are kept in the existing notes column so no schema change is needed. */
function composeNotes(data: z.infer<typeof schema>) {
  const photoUrls = data.photoUrls.split(/\s+/).filter((url) => /^https:\/\/\S+$/.test(url)).slice(0, 10);
  const parts = [
    data.notes,
    data.listingReference ? `Listing: https://treatmentlane.com${data.listingReference}` : "",
    data.listingDescription ? `Provider-written description:\n${data.listingDescription}` : "",
    photoUrls.length ? `Photo links:\n${photoUrls.join("\n")}\nPhoto rights confirmed: ${data.photoRights === "on" ? "yes" : "no"}` : "",
  ].filter(Boolean);
  return parts.join("\n\n");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  if (parsed.data.companyFax) return NextResponse.json({ ok: true }, { status: 201 });
  const data = { ...parsed.data, notes: composeNotes(parsed.data) };
  try {
    const saved = await createProviderSubmission(data);
    if (!saved) return NextResponse.json({ message: "Applications are temporarily unavailable. Please email suraj@treatmentlane.com." }, { status: 503 });
  } catch {
    return NextResponse.json({ message: "We could not save the application. Please try again." }, { status: 500 });
  }
  try {
    await notifyProviderSubmission(data);
  } catch (error) {
    console.error("Provider application notification failed", error instanceof Error ? error.message : "Unknown error");
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
