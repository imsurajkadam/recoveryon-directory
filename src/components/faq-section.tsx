import type { FaqEntry } from "@/lib/faq-schema";

export function FaqSection({ faqs }: { faqs: FaqEntry[] }) {
  if (!faqs.length) return null;
  return (
    <section className="section">
      <div className="shell content-shell prose">
        <h2>Frequently asked questions</h2>
        {faqs.map((faq) => (
          <section key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
