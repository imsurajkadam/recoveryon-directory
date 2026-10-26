"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { states } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function ProviderApplicationForm({ listingReference = "" }: { listingReference?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/provider-submissions", {
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
      setMessage(result.message || "We could not submit the form. Please try again.");
      return;
    }
    trackEvent("provider_application_submit");
    form.reset();
    setStatus("success");
  }

  if (status === "success") {
    return <div className="success-panel" role="status"><CheckCircle2 size={32} /><h2>Application received</h2><p>We will review the organization and contact you if we need additional information.</p></div>;
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <p className="form-required-note"><span className="required-mark" aria-hidden="true">*</span> Required fields</p>
      <div className="form-grid">
        <label><span className="field-label">Organization name <span className="required-mark" aria-hidden="true">*</span></span><input name="organizationName" required maxLength={160} /></label>
        <label><span className="field-label">Your name <span className="required-mark" aria-hidden="true">*</span></span><input name="contactName" required maxLength={120} /></label>
        <label><span className="field-label">Work email <span className="required-mark" aria-hidden="true">*</span></span><input name="workEmail" type="email" required maxLength={200} /></label>
        <label><span className="field-label">Phone <span className="optional-label">(optional)</span></span><input name="phone" type="tel" maxLength={40} /></label>
        <label><span className="field-label">Website <span className="optional-label">(optional)</span></span><input name="website" type="url" placeholder="https://" maxLength={300} /></label>
        <label><span className="field-label">Relationship to organization <span className="required-mark" aria-hidden="true">*</span></span><select name="relationship" required defaultValue=""><option value="" disabled>Select one</option><option>Owner or executive</option><option>Employee</option><option>Authorized marketing partner</option><option>Other authorized representative</option></select></label>
        <label><span className="field-label">City <span className="required-mark" aria-hidden="true">*</span></span><input name="city" required maxLength={100} /></label>
        <label><span className="field-label">State <span className="required-mark" aria-hidden="true">*</span></span><select name="state" required defaultValue=""><option value="" disabled>Select state</option>{states.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}</select></label>
        <label className="full-field"><span className="field-label">Notes <span className="optional-label">(optional)</span></span><textarea name="notes" rows={5} maxLength={2000} defaultValue={listingReference ? `Claim request for TreatmentLane listing: ${listingReference}` : ""} placeholder="Tell us what services you provide and whether this is a new listing or a claim." /></label>
        <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {status === "error" && <p className="form-error" role="alert">{message}</p>}
      <button className="button" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Submitting…" : "Submit for review"}</button>
      <p className="form-disclaimer">Submitting does not guarantee publication or a verification label. We may contact the organization and review public records.</p>
    </form>
  );
}
