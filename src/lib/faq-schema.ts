export type FaqEntry = { question: string; answer: string };

type EditorialContent = { intro: string; sections: { heading: string; body: string }[] };

// Keep FAQ answers concise for structured data: whole sentences only,
// up to roughly maxChars characters.
export function excerptSentences(text: string, maxChars = 320): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+["']?/g) || [clean];
  let out = "";
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence.trim()}` : sentence.trim();
    if (next.length > maxChars && out) break;
    out = next;
    if (out.length >= maxChars * 0.6) break;
  }
  return (out || clean.slice(0, maxChars)).trim();
}

export function buildFaqPageJsonLd(faqs: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function getStateFaqs(stateName: string, total: number, editorial?: EditorialContent): FaqEntry[] {
  const faqs: FaqEntry[] = [];
  if (total > 0) {
    faqs.push({
      question: `How many addiction treatment centers are in ${stateName}?`,
      answer: `TreatmentLane lists ${total.toLocaleString("en-US")} published addiction treatment, detox, mental health, and recovery listings in ${stateName}. Compare services, insurance information, and contact details, then confirm licensing and availability directly with the provider.`,
    });
  }
  if (editorial) {
    const licensing = editorial.sections.find((section) => section.heading === "Licensing and oversight");
    if (licensing) {
      faqs.push({ question: `How is addiction treatment licensed in ${stateName}?`, answer: excerptSentences(licensing.body) });
    }
    const paying = editorial.sections.find((section) => section.heading === "Paying for treatment");
    if (paying) {
      faqs.push({ question: `How can I pay for addiction treatment in ${stateName}?`, answer: excerptSentences(paying.body) });
    }
    const questions = editorial.sections.find((section) => section.heading === "Questions to ask providers");
    if (questions) {
      faqs.push({ question: `What should I ask a treatment center in ${stateName} before choosing one?`, answer: excerptSentences(questions.body) });
    }
  }
  return faqs;
}

export function getCareFaqs(categoryName: string, shortName: string, guidance: string, total: number, editorial?: EditorialContent): FaqEntry[] {
  const faqs: FaqEntry[] = [];
  if (editorial) {
    faqs.push({ question: `What should I know about ${shortName.toLowerCase()}?`, answer: excerptSentences(editorial.intro) });
    const costSection = editorial.sections.find((section) => section.heading.toLowerCase().includes("cost"));
    if (costSection) {
      faqs.push({ question: `How much does ${shortName.toLowerCase()} cost?`, answer: excerptSentences(costSection.body) });
    }
  }
  faqs.push({ question: `How do I choose the right ${shortName.toLowerCase()} option?`, answer: guidance });
  if (total > 0) {
    faqs.push({
      question: `How many ${shortName.toLowerCase()} listings are on TreatmentLane?`,
      answer: `TreatmentLane lists ${total.toLocaleString("en-US")} published ${categoryName.toLowerCase()} listings across the United States. Compare services, licensing, and insurance information, then confirm details directly with the provider.`,
    });
  }
  return faqs;
}
