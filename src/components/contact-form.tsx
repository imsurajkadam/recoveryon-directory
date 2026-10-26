"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ topic = "", topicLocked = false }: { topic?: string; topicLocked?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/contact-inquiries", {
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
      setMessage(result.message || "We could not submit your message.");
      return;
    }
    trackEvent(topic === "partnership" ? "advertiser_inquiry_submit" : "contact_submit");
    form.reset();
    setStatus("success");
  }

  if (status === "success") return <div className="success-panel" role="status"><CheckCircle2 size={32} /><h2>Message received</h2><p>Thank you. We will review your message and respond when a reply is needed.</p></div>;

  return <form className="form-card" onSubmit={submit}>
    <p className="form-required-note"><span className="required-mark" aria-hidden="true">*</span> Required fields</p>
    <div className="form-grid">
      <label><span className="field-label">Your name <span className="required-mark" aria-hidden="true">*</span></span><input name="name" required maxLength={120} /></label>
      <label><span className="field-label">Email <span className="required-mark" aria-hidden="true">*</span></span><input name="email" type="email" required maxLength={200} /></label>
      {topicLocked ? <input type="hidden" name="topic" value={topic} /> : <label className="full-field"><span className="field-label">Topic <span className="required-mark" aria-hidden="true">*</span></span><select name="topic" required defaultValue={topic}><option value="" disabled>Select one</option><option value="general">General question</option><option value="provider">Provider listing</option><option value="partnership">Partnership or media</option><option value="privacy">Privacy request</option><option value="other">Other</option></select></label>}
      <label className="full-field"><span className="field-label">Message <span className="required-mark" aria-hidden="true">*</span></span><textarea name="message" required rows={6} maxLength={3000} /></label>
      <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
    </div>
    {status === "error" && <p className="form-error" role="alert">{message}</p>}
    <button className="button" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Sending…" : "Send message"}</button>
    <p className="form-disclaimer">Do not use this form for emergencies or confidential medical information.</p>
  </form>;
}
