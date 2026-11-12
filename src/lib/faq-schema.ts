import type { Provider } from "@/lib/types";

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

function formatFaqList(values: string[], limit = 10): string {
  if (values.length <= limit) return values.join(", ");
  return `${values.slice(0, limit).join(", ")}, and more`;
}

// Build FAQs only from the provider's own stored data. A question is
// omitted entirely when the field it answers is empty.
export function getProviderFaqs(provider: Provider): FaqEntry[] {
  const faqs: FaqEntry[] = [];
  const careOptions = [...provider.levelsOfCare, ...provider.treatmentTypes].filter(
    (item, index, items) => items.indexOf(item) === index,
  );
  if (careOptions.length) {
    faqs.push({
      question: `What levels of care does ${provider.name} offer?`,
      answer: `${provider.name} lists ${formatFaqList(careOptions)} among its treatment types and levels of care. Confirm the recommended level of care and current availability directly with the provider.`,
    });
  }
  if (provider.insurance.length) {
    faqs.push({
      question: `What insurance does ${provider.name} accept?`,
      answer: `${provider.name} lists ${formatFaqList(provider.insurance)} as accepted insurance. Insurance participation changes. Verify network status, authorization requirements, and expected out-of-pocket cost with both the provider and your insurer before admission.`,
    });
  }
  const place = [provider.address, `${provider.city}, ${provider.state}${provider.postalCode ? ` ${provider.postalCode}` : ""}`]
    .filter(Boolean)
    .join(", ");
  faqs.push({
    question: `Where is ${provider.name} located?`,
    answer: `${provider.name} is located at ${place}. Use the map link on this page for directions.`,
  });
  if (provider.phone && provider.website) {
    faqs.push({
      question: `How do I contact ${provider.name}?`,
      answer: `You can call ${provider.name} at ${provider.phone}, or visit its official website using the link on this page.`,
    });
  } else if (provider.phone) {
    faqs.push({
      question: `How do I contact ${provider.name}?`,
      answer: `You can call ${provider.name} at ${provider.phone}.`,
    });
  } else if (provider.website) {
    faqs.push({
      question: `How do I contact ${provider.name}?`,
      answer: `You can reach ${provider.name} through its official website using the link on this page.`,
    });
  }
  return faqs;
}
