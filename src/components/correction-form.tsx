"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function CorrectionForm({ providerSlug = "" }: { providerSlug?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/correction-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    if (!response) {
      setStatus("error");
      setMessage("We could not connect. Please try again or email suraj@treatmentlane.com.");
      return;
    }
    const result = await response.json().catch(() => ({ message: "Something went wrong." }));
    if (!response.ok) {
      setStatus("error");
      setMessage(result.message || "We could not submit the correction.");
      return;
    }
    trackEvent("correction_submit");
    form.reset();
    setStatus("success");
  }

  if (status === "success") return <div className="success-panel" role="status"><CheckCircle2 size={32} /><h2>Correction received</h2><p>We will review the request against provider and public-source information before making a change.</p></div>;

  return <form className="form-card" onSubmit={submit}>
    <p className="form-required-note"><span className="required-mark" aria-hidden="true">*</span> Required fields</p>
    <div className="form-grid">
      <label><span className="field-label">Your name <span className="required-mark" aria-hidden="true">*</span></span><input name="requesterName" required maxLength={120} /></label>
      <label><span className="field-label">Email <span className="required-mark" aria-hidden="true">*</span></span><input name="requesterEmail" type="email" required maxLength={200} /></label>
      <label className="full-field"><span className="field-label">Provider name or listing URL <span className="optional-label">(optional)</span></span><input name="providerSlug" defaultValue={providerSlug} maxLength={300} placeholder="Organization name or TreatmentLane listing URL" /></label>
      <label className="full-field"><span className="field-label">What should be corrected? <span className="required-mark" aria-hidden="true">*</span></span><textarea name="details" required rows={6} maxLength={3000} placeholder="Describe the current information, the requested correction, and how it can be verified." /></label>
      <label className="full-field"><span className="field-label">Supporting source URL <span className="optional-label">(optional)</span></span><input name="sourceUrl" type="url" maxLength={500} placeholder="https://" /></label>
      <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
    </div>
    {status === "error" && <p className="form-error" role="alert">{message}</p>}
    <button className="button" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Submitting…" : "Submit correction"}</button>
    <p className="form-disclaimer">Requests are reviewed before publication. We may contact you or the organization to verify material changes.</p>
  </form>;
}
