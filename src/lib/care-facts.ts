export type CareFacts = { setting: string; schedule: string; length: string; fits: string; next: string; ladder: number[] };

/** General, non-clinical descriptions of each care category. Hours follow common ASAM-based program definitions. */
export const careFacts: Record<string, CareFacts> = {
  "medical-detox": {
    setting: "Hospital, residential unit, or closely monitored clinic",
    schedule: "Round-the-clock monitoring during withdrawal, with medication when needed",
    length: "Usually several days to about a week, depending on the substance",
    fits: "People at risk of significant withdrawal, especially from alcohol, benzodiazepines, or opioids",
    next: "Detox is a first step, not treatment on its own. Plan the next level of care before discharge.",
    ladder: [0],
  },
  "treatment-centers": {
    setting: "Live on site with staff present 24 hours a day",
    schedule: "Full days of therapy, groups, and structured activities",
    length: "Often 30 to 90 days. Some programs run shorter or longer",
    fits: "People who need a stable, substance-free setting, or who have not done well in outpatient care",
    next: "Most people step down to outpatient care, sober living, or both.",
    ladder: [1],
  },
  "outpatient-programs": {
    setting: "Live at home and attend a clinic",
    schedule: "Partial hospitalization is about 20 or more hours a week, intensive outpatient about 9 or more, and standard outpatient fewer than 9",
    length: "Intensive programs often run 8 to 12 weeks, followed by less frequent visits",
    fits: "People with a safe, stable place to live who can get to appointments",
    next: "Hours usually step down over time. Many people continue with counseling or support groups.",
    ladder: [2, 3, 4],
  },
  "counseling-therapy": {
    setting: "Office visits or telehealth",
    schedule: "Usually one session a week, sometimes more",
    length: "From a few weeks to years, depending on goals",
    fits: "Early concerns, ongoing support, or continued care after a higher level",
    next: "Ask about a higher level of care if use is escalating or withdrawal is a risk.",
    ladder: [4],
  },
  "sober-living": {
    setting: "Shared, substance-free home with house rules",
    schedule: "Most homes provide no clinical treatment on site. Residents usually work, study, or attend outpatient care",
    length: "Often several months. Many homes have no fixed limit",
    fits: "People leaving residential care, or who need stable housing while in outpatient treatment",
    next: "Ask about certification, drug testing, medication policies, and cost. Most insurance does not pay rent.",
    ladder: [5],
  },
  "support-groups": {
    setting: "Community rooms and online meetings",
    schedule: "Peer-led meetings, with daily options in many cities",
    length: "Open-ended, for as long as it helps",
    fits: "Anyone who wants peer connection alongside or after professional care",
    next: "Support groups do not replace medical care, detox, or emergency services.",
    ladder: [5],
  },
  "mental-health-services": {
    setting: "Clinic, hospital, or telehealth",
    schedule: "Psychiatry visits, therapy, and medication management",
    length: "Varies with the condition and the plan of care",
    fits: "People with depression, anxiety, PTSD, or another condition alongside substance use",
    next: "Ask whether both conditions are treated by one coordinated team.",
    ladder: [3, 4],
  },
  "recovery-support": {
    setting: "Recovery community centers, phone, or online",
    schedule: "Case management, peer coaching, and help with work or housing",
    length: "Ongoing, as needed",
    fits: "People rebuilding daily life after or alongside treatment",
    next: "Combine with clinical care if symptoms or substance use return.",
    ladder: [5],
  },
};

export const careLadder = [
  { label: "Medical detox", detail: "24-hour withdrawal care", time: "Days", href: "/care/medical-detox" },
  { label: "Residential", detail: "Live-in treatment", time: "Weeks to months", href: "/care/treatment-centers" },
  { label: "Partial hospitalization", detail: "About 20+ hours a week", time: "Weeks", href: "/care/outpatient-programs" },
  { label: "Intensive outpatient", detail: "About 9+ hours a week", time: "Weeks to months", href: "/care/outpatient-programs" },
  { label: "Outpatient", detail: "Under 9 hours a week", time: "Months", href: "/care/counseling-therapy" },
  { label: "Ongoing support", detail: "Sober living, peers, coaching", time: "Open-ended", href: "/care/recovery-support" },
];

export const listingSteps = [
  { title: "Search", body: "Filter by place, type of care, and the insurance you have." },
  { title: "Check credentials", body: "Look for the verification label, accreditation, and licensing on each profile." },
  { title: "Call and confirm", body: "Ask about openings, your insurance, total cost, and what happens after discharge." },
  { title: "Decide with support", body: "A doctor or counselor can help judge which level of care fits." },
];

export const insuranceSteps = [
  { title: "Call your plan", body: "Use the member services number on the back of your insurance card." },
  { title: "Ask about the network", body: "Confirm that the provider and the level of care are in network for your plan." },
  { title: "Ask about approval", body: "Find out whether prior authorization is needed and who submits it." },
  { title: "Ask what you will pay", body: "Deductible, copay or coinsurance, and your out-of-pocket maximum." },
  { title: "Get it in writing", body: "Note the date, the representative's name, and a reference number." },
];

export const insuranceTerms = [
  { term: "Deductible", meaning: "What you pay each year before your plan starts sharing costs." },
  { term: "Copay", meaning: "A fixed amount you pay for a visit or service." },
  { term: "Coinsurance", meaning: "Your percentage share of a bill after the deductible is met." },
  { term: "Out-of-pocket maximum", meaning: "The most you pay for covered care in a plan year." },
  { term: "In-network", meaning: "A provider that has a contract with your plan, usually at lower cost to you." },
  { term: "Prior authorization", meaning: "Plan approval that some services need before treatment starts." },
];
