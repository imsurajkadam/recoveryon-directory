const AUX = "is|are|was|were|do|does|did|can|could|should|would|will|has|have|am|must|might|may";
const STARTS_WITH_AUX = new RegExp(`^(?:is|are|was|were|does|did|can|could|should|would|will|am)\\s+(?!not\\b)\\S`, "i");
const STARTS_WITH_DO = /^do\s+(?:i|you|we|they|all|most|some|any|both|people|rehabs|providers|programs|centers|insurance|insurers|plans|employers|doctors|listings|sober|detox|outpatient|treatment|medicaid|medicare)\b/i;
const WH_WITH_AUX = new RegExp(`^(?:what|why|when|where|who|how)\\s+(?:${AUX})\\b`, "i");
const HOW_QUANTITY = new RegExp(`^how\\s+(?:long|much|many|often|soon|far|quickly|common|effective|safe)\\b(?:\\s+\\S+){0,3}?\\s+(?:${AUX})\\b`, "i");
const WHAT_KIND = new RegExp(`^what\\s+(?:kind|kinds|type|types|level|levels)\\s+of\\b(?:\\s+\\S+){0,3}?\\s+(?:${AUX})\\b`, "i");
const WH_SUBJECT = /^(?:what|who)\s+(?:happens|if|about|comes|counts|qualifies|causes|makes|pays|needs|else|works|helps|covers|decides|regulates|runs|provides|offers)\b/i;
const WHICH = /^which\s+(?!to\b)\S/i;
const NOT_A_QUESTION = /^(?:how|what|when|where|who|why|which)\s+(?:to|we|our|this|these|that|those|the page|it works|you(?:'ll| will| can| should| need))\b/i;

/** True when a heading reads as a direct question but has no closing punctuation. */
export function isUnmarkedQuestion(text: string) {
  const value = text.trim();
  if (!value || /[?.!:;]$/.test(value) || /[?,]/.test(value) || value.length > 160) return false;
  if (NOT_A_QUESTION.test(value)) return false;
  return STARTS_WITH_AUX.test(value) || STARTS_WITH_DO.test(value) || WH_WITH_AUX.test(value) || HOW_QUANTITY.test(value) || WHAT_KIND.test(value) || WH_SUBJECT.test(value) || WHICH.test(value);
}

/** Adds a question mark to a title or heading that is phrased as a question and lacks one. */
export function withQuestionMark(text: string) {
  return isUnmarkedQuestion(text) ? `${text.trim()}?` : text;
}
