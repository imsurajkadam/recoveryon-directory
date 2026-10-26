"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
}

const roleLabels: Record<string, string> = {
  former_client: "Former Client",
  family_member: "Family Member",
  other: "Reviewer",
};

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return <span className="stars" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={size} fill={i <= rating ? "currentColor" : "none"} className={i <= rating ? "star-filled" : "star-empty"} />
    ))}
  </span>;
}

export function ProviderReviews({ providerId, providerName }: { providerId: string; providerName: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", role: "former_client", rating: 5, title: "", body: "" });

  useEffect(() => {
    fetch(`/api/reviews?providerId=${providerId}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(() => {});
  }, [providerId]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, reviewerName: form.name, reviewerRole: form.role, rating: form.rating, title: form.title, body: form.body }),
    });
    if (res.ok) {
      trackEvent("review_submit");
      setSubmitted(true);
    }
  }

  return <section className="provider-reviews" id="reviews">
    <h2>TreatmentLane reviews {reviews.length > 0 && <span className="review-count">({reviews.length})</span>}</h2>
    {reviews.length > 0 ? <>
      <div className="reviews-summary"><Stars rating={Math.round(avg)} size={20} /> <strong>{avg.toFixed(1)}</strong> average from {reviews.length} review{reviews.length === 1 ? "" : "s"}</div>
      <div className="reviews-list">
        {reviews.map((r) => <article key={r.id} className="review-card">
          <div className="review-header"><Stars rating={r.rating} /> <span className="reviewer-role">{roleLabels[r.reviewer_role] || "Reviewer"}</span></div>
          {r.title && <h3>{r.title}</h3>}
          <p>{r.body}</p>
          <p className="review-meta">{r.reviewer_name} &middot; {new Date(r.created_at).toLocaleDateString()}</p>
        </article>)}
      </div>
    </> : <p>No reviews yet. Were you a client at {providerName}? Share your experience to help others.</p>}
    
    {!showForm && !submitted && <button className="button" onClick={() => setShowForm(true)}>Write a review</button>}
    {submitted && <div className="notice">Thank you. Your review was submitted and will appear after moderation.</div>}
    {showForm && !submitted && <form className="review-form" onSubmit={submit}>
      <label>Your name <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>I am a <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="former_client">Former client</option>
        <option value="family_member">Family member</option>
        <option value="other">Other</option>
      </select></label>
      <label>Rating <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>)}
      </select></label>
      <label>Title (optional) <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label>Your review <textarea required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
      <button type="submit" className="button">Submit review</button>
    </form>}
  </section>;
}
