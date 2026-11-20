import type { FaqEntry } from "@/lib/faq-schema";
import { withQuestionMark } from "@/lib/text-question";

export function FaqSection({ faqs }: { faqs: FaqEntry[] }) {
  if (!faqs.length) return null;
  return (
    <section className="section" id="faqs">
      <div className="shell content-shell prose">
        <h2>Frequently asked questions</h2>
        {faqs.map((faq) => (
          <section key={faq.question}>
            <h3>{withQuestionMark(faq.question)}</h3>
            <p>{faq.answer}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
