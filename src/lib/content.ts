import { guideBatch1 } from "@/lib/guide-content-batch-1";
import { guideBatch2 } from "@/lib/guide-content-batch-2";
import { guideBatch3 } from "@/lib/guide-content-batch-3";
import { guideBatch4 } from "@/lib/guide-content-batch-4";
export { states, type State } from "@/lib/us-states";

export type CareCategory = {
  name: string;
  slug: string;
  shortName: string;
  description: string;
  guidance: string;
};

export const careCategories: CareCategory[] = [
  {
    name: "Treatment Centers",
    shortName: "Treatment centers",
    slug: "treatment-centers",
    description: "Residential and inpatient programs offering structured support for substance use recovery.",
    guidance: "Compare the level of care, licensing, clinical services, admission criteria, and aftercare plan before choosing a program.",
  },
  {
    name: "Medical Detox",
    shortName: "Detox",
    slug: "medical-detox",
    description: "Clinically supervised withdrawal management and stabilization services.",
    guidance: "Withdrawal can be medically serious. Ask who provides clinical oversight, which substances are treated, and how care transitions after detox.",
  },
  {
    name: "Outpatient Programs",
    shortName: "Outpatient care",
    slug: "outpatient-programs",
    description: "Flexible outpatient, intensive outpatient, and partial hospitalization programs.",
    guidance: "Confirm weekly time requirements, clinical services, drug-testing policies, family involvement, and whether the program fits your daily responsibilities.",
  },
  {
    name: "Counseling & Therapy",
    shortName: "Therapy",
    slug: "counseling-therapy",
    description: "Individual, family, and group counseling for addiction, recovery, and co-occurring needs.",
    guidance: "Verify professional credentials, treatment approach, areas of experience, session format, and insurance participation directly with the clinician.",
  },
  {
    name: "Sober Living",
    shortName: "Sober living",
    slug: "sober-living",
    description: "Structured recovery residences that support the transition to independent living.",
    guidance: "Ask about house rules, staffing, drug testing, resident rights, fees, certifications, and the relationship with outside clinical care.",
  },
  {
    name: "Support Groups",
    shortName: "Support groups",
    slug: "support-groups",
    description: "Peer-led recovery meetings and family support communities.",
    guidance: "Support groups can complement professional care but do not replace medical advice, diagnosis, detoxification, or emergency services.",
  },
  {
    name: "Mental Health Services",
    shortName: "Mental health",
    slug: "mental-health-services",
    description: "Psychiatry, therapy, and integrated support for mental health and substance use needs.",
    guidance: "For co-occurring conditions, look for coordinated treatment that addresses mental health and substance use together.",
  },
  {
    name: "Recovery Support",
    shortName: "Recovery support",
    slug: "recovery-support",
    description: "Case management, peer coaching, employment help, and other practical recovery services.",
    guidance: "Check the provider's role, training, boundaries, privacy practices, fees, and how the service coordinates with licensed clinical care.",
  },
];

export const featuredStateCodes = ["CA", "FL", "TX", "NY", "PA", "OH", "IL", "WA"];

export type Guide = {
  slug: string;
  title: string;
  description: string;
  reviewedOn: string;
  sections: Array<{ heading: string; body: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const guides: Guide[] = [
  {
    slug: "how-to-verify-a-treatment-provider",
    title: "How to verify a treatment provider",
    description: "A practical checklist for reviewing licensing, accreditation, services, costs, and fit before making a decision.",
    reviewedOn: "2026-09-28",
    sections: [
      { heading: "Start with the official identity", body: "Confirm the program's legal name, physical address, phone number, and website. Make sure the person you speak with represents the facility you intend to contact." },
      { heading: "Check licensing and accreditation", body: "Ask which state agency licenses the program and verify the license with that agency. Accreditation can add useful information, but it does not replace state licensing or your own review." },
      { heading: "Match the level of care", body: "A professional assessment can help determine whether detox, residential, partial hospitalization, intensive outpatient, outpatient, or another level of support is appropriate." },
      { heading: "Verify costs and insurance", body: "Ask for written information about network status, estimated patient responsibility, deposits, refunds, transportation, and any services billed separately. Confirm benefits with the insurer directly." },
      { heading: "Watch for pressure", body: "Be cautious when someone guarantees results, discourages questions, refuses to explain fees, or pressures you to travel immediately without a clear clinical reason." },
    ],
    sources: [
      { label: "SAMHSA FindTreatment.gov", href: "https://findtreatment.gov/" },
      { label: "SAMHSA National Helpline", href: "https://www.samhsa.gov/find-help/helplines/national-helpline" },
    ],
  },
  {
    slug: "understanding-levels-of-care",
    title: "Understanding levels of addiction care",
    description: "A plain-language overview of detox, residential, PHP, IOP, outpatient, and recovery support services.",
    reviewedOn: "2026-09-28",
    sections: [
      { heading: "Withdrawal management", body: "Medical detox or withdrawal management focuses on safely stabilizing a person as substances leave the body. It is not a complete treatment plan by itself." },
      { heading: "Residential treatment", body: "Residential programs provide a structured living environment with scheduled clinical and recovery activities. Program intensity, staffing, and duration vary." },
      { heading: "PHP and IOP", body: "Partial hospitalization and intensive outpatient programs provide multiple hours of care while allowing a person to live outside the facility. Requirements vary by program." },
      { heading: "Standard outpatient care", body: "Outpatient services may include individual therapy, group counseling, medication management, and recovery planning at a lower weekly intensity." },
      { heading: "Ongoing recovery support", body: "Peer groups, recovery coaching, sober living, primary care, employment support, and family services can help sustain progress after or alongside clinical care." },
    ],
    sources: [
      { label: "SAMHSA Find Help", href: "https://www.samhsa.gov/find-help" },
      { label: "FindTreatment.gov", href: "https://findtreatment.gov/" },
    ],
  },
  {
    slug: "questions-to-ask-about-treatment-costs",
    title: "Questions to ask about treatment costs",
    description: "Use this checklist to understand insurance, private-pay charges, deposits, refunds, and possible additional fees.",
    reviewedOn: "2026-09-28",
    sections: [
      { heading: "Ask what is included", body: "Request a written estimate and ask whether assessments, medications, laboratory work, physician services, transportation, and aftercare are included." },
      { heading: "Confirm insurance independently", body: "Ask the provider for its network status, then contact the insurer using the number on the insurance card. Verify deductibles, coinsurance, prior authorization, and out-of-network rules." },
      { heading: "Understand deposits and refunds", body: "Ask when deposits become non-refundable, what happens if the recommended level of care changes, and how unused funds are returned." },
      { heading: "Avoid financial pressure", body: "Take time to understand written terms. A legitimate provider should be able to explain charges without guaranteeing insurance payment or demanding an immediate decision." },
    ],
    sources: [
      { label: "CMS consumer resources", href: "https://www.cms.gov/medical-bill-rights" },
      { label: "SAMHSA National Helpline", href: "https://www.samhsa.gov/find-help/helplines/national-helpline" },
    ],
  },

  {
    slug: "how-much-does-rehab-cost",
    title: "How much does rehab cost?",
    description:
      "Rehab costs range from free community programs to tens of thousands of dollars for residential care. This guide explains typical price ranges, what drives them, and how to get a clear written estimate before you commit. This is educational information only, not medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "There is no single price for rehab",
        body: "The cost of addiction treatment varies enormously, from no-cost community programs to luxury residential centers charging tens of thousands of dollars per month. The price depends on the level of care you need, the length of stay, the location, and whether you use insurance. Because of that range, published averages are only a starting point for planning, so always ask a specific program for a personalized written estimate. This guide is educational only and is not medical advice; a qualified clinician can help you determine which level of care is appropriate.",
      },
      {
        heading: "Typical cost ranges by level of care",
        body: "A 2026 nationwide pricing study that contacted more than 1,000 residential facilities found a 30-day residential stay averaged about $27,500 before insurance. The same study estimated medical detox at about $6,500 for an average six-day stay, partial hospitalization at about $15,000 for 30 days, and intensive outpatient care at about $10,400 for 30 sessions. People using in-network insurance paid roughly one-fifth of those list prices on average, though actual out-of-pocket costs depend on the plan's deductible, coinsurance, and covered services. These are estimates, not guarantees: detox is often bundled into residential pricing, and your cost will depend on your plan, your location, and the facility you choose.",
      },
      {
        heading: "What makes one program cost more than another",
        body: "Length of stay is the biggest cost driver, since a 90-day residential program costs far more than a 30-day one. Location matters too, as programs in high-cost metro areas charge more than comparable programs elsewhere, and medical staffing levels, hours of one-on-one therapy, and amenities like private rooms also push prices up. A higher price does not automatically mean better clinical care, so compare the treatment itself, such as staff credentials and therapy hours, rather than the amenities. When two programs offer similar clinical care, the less expensive one is usually the smarter choice.",
      },
      {
        heading: "Insurance usually lowers the bill substantially",
        body: "Most private insurance plans cover addiction treatment, and in-network care is dramatically cheaper than paying the list price. Before you commit to any program, call the number on your insurance card and ask whether that specific facility and level of care are covered, and whether prior authorization is required. Also ask about your deductible and out-of-pocket maximum, since you may owe little or nothing once those are met. If a program is out-of-network, get the expected total in writing first, because balance bills can be large.",
      },
      {
        heading: "Free and low-cost options exist",
        body: "If you have no insurance or cannot afford private care, SAMHSA's National Helpline at 1-800-662-4357 is free, confidential, and open 24 hours a day, and its specialists can refer you to state-funded programs and facilities with sliding fee scales. Many states fund treatment programs directly, and nonprofit centers often reduce fees based on income, so ask about financial assistance on your first call. You can also dial 211 to reach local United Way services that connect people with treatment, food, and housing resources. Twelve-step programs like Alcoholics Anonymous and Narcotics Anonymous are always free and available in nearly every community.",
      },
      {
        heading: "Get the cost in writing before you commit",
        body: "Ask the admissions team for an itemized written estimate showing the daily or bundled rate, the expected length of stay, and exactly what is included. Then ask what is not included, since drug testing, medications, outside medical visits, and aftercare planning are common surprise charges. Ask how billing works if you leave early or if your insurer stops authorizing care mid-stay, and get the name of the person who gave you the estimate. If a program will not put its prices in writing, treat that as a warning sign and consider other options.",
      },
    ],
    sources: [
      {
        label: "Recovery.com: How much does rehab cost (2026 pricing study)",
        href: "https://Recovery.com/resources/how-much-does-rehab-cost/",
      },
      {
        label: "SAMHSA National Helpline",
        href: "https://www.samhsa.gov/find-help/helplines/national-helpline",
      },
    ],
  },
  {
    slug: "does-insurance-cover-addiction-treatment",
    title: "Does insurance cover addiction treatment?",
    description:
      "In most cases, yes. Federal law requires most health plans to cover addiction treatment comparably to other medical care. This guide explains your rights, how to check your benefits in minutes, and what to do if a claim is denied. This is educational information only, not legal or medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "The short answer: usually yes",
        body: "Most health insurance plans in the United States cover treatment for substance use disorders, including detox, residential care, outpatient programs, and addiction medications. Coverage does not mean care is free: you will typically still owe deductibles, copays, or coinsurance, just as with other medical care. The exact amount depends on your plan's cost-sharing rules and whether the provider is in your plan's network. Because details vary so much between plans, verifying your specific benefits before starting treatment is essential.",
      },
      {
        heading: "Two federal laws protect your coverage",
        body: "The Affordable Care Act lists mental health and substance use disorder services as essential health benefits, which individual and small-group plans must cover. The Mental Health Parity and Addiction Equity Act of 2008 requires most large employer plans to cover addiction treatment on equal terms with medical and surgical care. In practice, that means your plan cannot impose higher copays, stricter visit limits, or tougher authorization rules on addiction treatment than on comparable physical health care. A few plan types, such as some grandfathered and short-term plans, have more limited obligations, so the protections that apply depend on your plan type.",
      },
      {
        heading: "In-network vs out-of-network: the price gap",
        body: "Staying in-network is the single biggest lever on your out-of-pocket cost: a 2026 pricing study found in-network patients paid roughly one-fifth of the list price for residential treatment. Before admission, confirm the facility is in-network for your specific plan and for the specific level of care you need, since a facility can be in-network for outpatient care but not for residential. Do not rely on the admissions team alone; call your insurer directly using the number on your card and get the answer yourself. If you consider out-of-network care, ask for the full expected cost in writing first, because the gap can be enormous.",
      },
      {
        heading: "Medicaid and Medicare cover treatment too",
        body: "Medicaid covers substance use disorder treatment, and federal rules require Medicaid managed care plans to meet the same parity standards as private plans. The exact services covered, such as residential stays or specific medications, vary from state to state, so call your plan or your state's Medicaid office to confirm. Medicare also covers substance use treatment, including inpatient and outpatient care, subject to its own cost-sharing and coverage rules. If you are uninsured, SAMHSA's National Helpline at 1-800-662-4357 can connect you with state-funded programs at no cost.",
      },
      {
        heading: "How to verify your benefits in 15 minutes",
        body: "Call the member services number on your insurance card and ask whether the facility is in-network, whether the level of care is covered, whether prior authorization is required, and what your deductible, copay, and out-of-pocket maximum are. Also ask what clinical criteria the plan uses to decide medical necessity, since that determines whether your stay gets authorized. Write down the answers with the date, the representative's name, and any reference number, and ask the treatment center to confirm the same details in writing. Keep these records until every bill is resolved, because they are your evidence if a dispute arises.",
      },
      {
        heading: "If your claim is denied, appeal it",
        body: "Your insurer must send you a written explanation of any denial, including the specific reason and the policy language behind it. You have the right to an internal appeal, and if that fails, to an external review by an independent organization that does not work for your insurer. If your health is at risk, request an expedited review, which must be decided within 72 hours. Many states offer free consumer assistance programs to help with appeals, and you can file a complaint with your state insurance department if you believe the denial violates parity law.",
      },
    ],
    sources: [
      {
        label: "WA Office of the Insurance Commissioner: appealing a behavioral health denial",
        href: "https://www.insurance.wa.gov/insurance-resources/health-insurance/mental-health-and-substance-use-disorders/appealing-behavioral-health-treatment-or-service-denial",
      },
      {
        label: "WebMD: appealing rejected health insurance claims",
        href: "https://www.webmd.com/health-insurance/how-and-when-to-appeal-insurance-claims",
      },
      {
        label: "SAMHSA National Helpline",
        href: "https://www.samhsa.gov/find-help/helplines/national-helpline",
      },
    ],
  },
  {
    slug: "questions-to-ask-a-treatment-center",
    title: "Questions to ask a treatment center",
    description:
      "Choosing a treatment center is a high-stakes decision. These are the questions that separate quality programs from risky ones, plus the red flags that mean you should walk away. This is educational information only, not medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "Start with licensing, not marketing",
        body: "Ask whether the program is licensed by the state, at its actual address, for the level of care you need, and verify the answer through your state's licensing board or SAMHSA's treatment locator at FindTreatment.gov. Then ask about voluntary accreditation from the Joint Commission or CARF, which signals independent quality standards; both organizations publish directories where you can confirm a program's status. Marketing routinely blurs licensing, accreditation, and insurance network status, so check each one yourself rather than trusting a badge on a website. If a program cannot clearly state its license number and accrediting body, move on.",
      },
      {
        heading: "Ask who will actually treat you",
        body: "Ask whether doctors, psychiatrists, and psychologists are on staff or only outside consultants, and what the staff-to-patient ratio is during treatment hours. Full-time counseling staff should hold professional addiction credentials, which you can verify through state licensing boards, rather than relying on personal recovery experience alone. If you have a co-occurring mental health condition such as depression, anxiety, or trauma, ask how the program integrates that care instead of treating addiction in isolation. Also ask whether the program offers medication-assisted treatment where clinically appropriate and whether its staff can prescribe and manage those medications.",
      },
      {
        heading: "Ask how they measure success",
        body: "Ask what therapies the program uses, whether they are evidence-based, and how the program uses clinical criteria to match you to the right level of care on admission. Then ask the harder question: do you track patient outcomes after discharge, and can you share the results. Programs that follow up with former patients and publish outcomes are demonstrating real accountability. Be skeptical of any advertised success rate that comes without an explanation of how it was measured and over what time period.",
      },
      {
        heading: "Get costs and insurance terms in writing",
        body: "Ask for an itemized written estimate and written confirmation of your insurance coverage, including whether prior authorization has been obtained for your stay. Ask what happens financially if your insurer stops authorizing care mid-stay: will you be billed for the balance, stepped down to a lower level of care, or discharged. Confirm the program is in-network for your specific plan, and verify that answer with your insurer directly rather than relying on admissions staff. Vague or evasive answers about money are a serious warning sign in an industry where surprise bills are common.",
      },
      {
        heading: "Ask what happens after discharge",
        body: "Treatment does not end at discharge, so ask what aftercare planning looks like and when it begins. Quality programs start discharge planning early and help you line up outpatient care, support groups, or sober living before you leave, rather than handing you a list on your last day. Ask whether the program offers an alumni program, follow-up check-ins, or continued counseling after discharge. Also ask whether family can participate in treatment, since family involvement is associated with better outcomes, and beware any program with no structured discharge plan at all.",
      },
      {
        heading: "Red flags: when to walk away",
        body: "Walk away from any program that guarantees a cure or advertises a near-perfect success rate, since no ethical provider promises outcomes. Be wary of high-pressure admissions tactics, demands for large upfront cash payments, or anyone offering gifts, free travel, or cash to choose their program: federal law prohibits kickbacks for patient referrals. Avoid programs that will not disclose their physical address, dodge questions about staff credentials, or advertise amenities far more than clinical care. Check reviews with a critical eye, looking for patterns rather than single complaints, and if it feels like a sales pitch rather than healthcare, trust that instinct.",
      },
    ],
    sources: [
      {
        label: "U.S. House hearing: examining patient brokering and treatment fraud",
        href: "https://www.congress.gov/event/115th-congress/house-event/106716/text",
      },
      {
        label: "PsychReg: how to tell if a treatment programme is properly licensed",
        href: "https://www.psychreg.org/how-tell-mental-health-addiction-treatment-programme-is-properly-licensed/",
      },
      {
        label: "SAMHSA National Helpline",
        href: "https://www.samhsa.gov/find-help/helplines/national-helpline",
      },
    ],
  },
  {
    slug: "what-is-medical-detox-like",
    title: "What is medical detox like?",
    description:
      "Medical detox helps manage withdrawal safely while alcohol or drugs leave the body. Learn what happens during intake, monitoring, medication, and the transition into ongoing treatment. This is educational information only, not medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "Detox is withdrawal management, not a complete treatment plan",
        body: "Medical detox, also called withdrawal management, focuses on keeping a person safe and as comfortable as possible while the body adjusts to stopping or reducing a substance. It can be an important first step, especially when withdrawal may cause serious medical problems, but detox alone does not address the longer-term patterns, health needs, and recovery supports involved in addiction. The safest setting depends on the substance, amount and duration of use, previous withdrawal history, current medications, physical health, mental health, and home environment. A clinician should assess those factors before recommending inpatient or outpatient detox.",
      },
      {
        heading: "The first step is a detailed assessment",
        body: "At intake, expect questions about every substance you use, when you last used it, how much you typically use, and whether you have had seizures, hallucinations, delirium, overdose, or severe withdrawal before. Staff may check vital signs, review medications and allergies, ask about pregnancy and medical conditions, and screen for depression, anxiety, trauma, or suicide risk. Blood or urine testing may be used when clinically necessary. Honest answers help the team predict complications and choose the safest plan. Bring prescription bottles or an accurate medication list, identification, insurance information if available, and emergency contact details.",
      },
      {
        heading: "Monitoring and medication depend on the substance",
        body: "During detox, nurses or other clinicians monitor symptoms, blood pressure, pulse, temperature, hydration, sleep, and mental status. Medications may be used to reduce symptoms or prevent complications, but the approach is different for alcohol, opioids, benzodiazepines, stimulants, and other substances. Alcohol withdrawal can include seizures or delirium and may be life threatening, so a person who has been drinking heavily should not suddenly stop without medical guidance. Opioid withdrawal is usually not life threatening by itself, but it can be intensely uncomfortable and raises overdose risk if tolerance falls and opioid use resumes. Ask which medications are available and who provides medical coverage overnight.",
      },
      {
        heading: "Detox may be inpatient or outpatient",
        body: "Some people can complete withdrawal management through scheduled outpatient visits while living at home. Others need 24-hour monitoring in a residential or hospital setting. Inpatient care is more likely when there is a history of severe withdrawal, serious medical or psychiatric illness, pregnancy, use of several substances, an unsafe home environment, or limited support. Hospital-level care may be appropriate when complex medical needs require continuous nursing and physician availability. A reputable program should explain why it recommends a setting and how it will respond if symptoms become more severe than expected.",
      },
      {
        heading: "Length varies, and the plan can change",
        body: "There is no universal detox timeline. Symptoms may begin within hours for some substances and later for others, and the most intense period may last several days. The team should reassess you throughout the stay and adjust medication, monitoring, and discharge timing to your response rather than promising an exact schedule in advance. Ask how often a clinician will review the plan, what would trigger transfer to a hospital, and how the program handles an unexpected positive test or a return to use. You should also receive clear information about what symptoms require urgent help after discharge.",
      },
      {
        heading: "Plan the next treatment step before discharge",
        body: "The period after detox can carry high risk because tolerance may be lower and cravings may continue. Before discharge, the team should connect you with ongoing treatment, which may include medication for opioid or alcohol use disorder, residential care, partial hospitalization, intensive outpatient treatment, standard outpatient care, primary care, and recovery support. Ask for appointments, medication instructions, and contact names in writing. If possible, the next appointment should already be scheduled. If a detox program offers no assessment, no treatment referral, or no plan for continuing medication, compare other options.",
      },
    ],
    sources: [
      {
        label: "NIAAA: Alcohol use disorder, withdrawal, and recovery",
        href: "https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-use-disorder-risk-diagnosis-recovery",
      },
      {
        label: "SAMHSA: Detoxification and substance use treatment",
        href: "https://library.samhsa.gov/sites/default/files/sma15-4131.pdf",
      },
      {
        label: "SAMHSA: What to expect from treatment",
        href: "https://www.samhsa.gov/find-support/learn-about-treatment/what-to-expect-from-treatment",
      },
    ],
  },
  {
    slug: "php-vs-iop-vs-outpatient",
    title: "How to choose between PHP, IOP, and outpatient care",
    description:
      "PHP, IOP, and standard outpatient treatment let you live outside a facility while receiving different levels of structure. Learn how assessments, safety, support, and daily responsibilities affect the choice. This is educational information only, not medical advice.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "The main difference is treatment intensity",
        body: "Partial hospitalization programs, intensive outpatient programs, and standard outpatient care are all delivered without an overnight stay, but they require different amounts of time and support. PHP is usually the most structured and may run for much of the day on several days each week. IOP commonly provides several hours of treatment on multiple days while leaving more time for work, school, or family. Standard outpatient care may involve one or a few appointments each week for therapy, medication, or recovery planning. Exact schedules and names vary by state, insurer, and program, so compare the actual hours and services rather than relying on the label alone.",
      },
      {
        heading: "Start with a complete clinical assessment",
        body: "The choice should begin with an assessment of substance use, withdrawal risk, physical health, mental health, overdose history, safety, housing, transportation, family support, and previous treatment. A person who needs withdrawal management, continuous nursing, or a protected living environment may need a higher level of care before outpatient treatment is safe. Someone with stable housing, reliable transportation, supportive people, and manageable medical needs may be able to begin with outpatient care. Ask who performed the assessment, which placement criteria were used, and what findings support the recommendation.",
      },
      {
        heading: "PHP fits people who need near-daily structure",
        body: "PHP may be a good fit when symptoms and relapse risk require frequent clinical contact but 24-hour residential care is not necessary. Programs may include group therapy, individual sessions, medication management, psychiatric care, skills practice, and regular monitoring. The person still returns home outside program hours, so the living environment must be reasonably safe and supportive. Ask how many days and hours are required, whether medical and psychiatric clinicians are on site, how missed sessions are handled, and whether transportation is available. Confirm that the program treats both substance use and any co-occurring mental health condition.",
      },
      {
        heading: "IOP balances structured care with daily life",
        body: "IOP can provide a strong treatment schedule while allowing more time for employment, school, caregiving, or other responsibilities. It may work well as a step down from residential care or PHP, or as a starting level when the assessment shows that residential treatment is not needed. Look beyond convenience: evening sessions are useful only if the program has the clinical services you need. Ask about weekly hours, individual therapy, medication access, drug-testing policies, family involvement, telehealth, and how the team responds to worsening symptoms or repeated return to use.",
      },
      {
        heading: "Standard outpatient care offers the most flexibility",
        body: "Standard outpatient treatment can include individual therapy, group counseling, medical visits, medication management, and recovery support at a lower weekly intensity. It may fit someone with lower clinical risk, strong support, and the ability to use recovery skills between appointments. It is also a common continuing-care option after more intensive treatment. Less time in a program does not mean less responsibility: the person needs a realistic schedule, a safe place to live, and a plan for cravings and high-risk situations. Ask how quickly appointments are available if needs change.",
      },
      {
        heading: "Expect to move between levels as needs change",
        body: "Treatment intensity is not a permanent label. A person may step down from PHP to IOP and then outpatient care as stability improves, or step up when symptoms, substance use, safety, or housing worsen. Ask how often the team reviews progress and what specific signs would trigger a change. Confirm insurance authorization for the recommended level, but do not let coverage language replace a clinical discussion. The best plan is the least restrictive setting that can safely meet current needs, with a clear route to more or less support when the situation changes.",
      },
    ],
    sources: [
      {
        label: "NIAAA: Types and levels of alcohol treatment",
        href: "https://alcoholtreatment.niaaa.nih.gov/what-to-know/types-of-alcohol-treatment",
      },
      {
        label: "NIAAA: Matching treatment to a person's needs",
        href: "https://alcoholtreatment.niaaa.nih.gov/what-to-know/different-people-different-options",
      },
      {
        label: "SAMHSA: What to expect from treatment",
        href: "https://www.samhsa.gov/find-support/learn-about-treatment/what-to-expect-from-treatment",
      },
    ],
  },
  {
    slug: "paying-for-rehab-without-insurance",
    title: "Paying for rehab without insurance",
    description:
      "No insurance does not mean no treatment. Learn how to find state-funded care, sliding fees, Medicaid, health centers, grants, and safer payment arrangements without accepting unclear debt.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "Start with free referral services",
        body: "SAMHSA's National Helpline at 1-800-662-4357 is free, confidential, and available every day. It can refer people without insurance to state-funded programs and facilities that offer sliding fees or accept Medicaid. FindTreatment.gov also lets you search for substance use treatment and review payment options. Your state substance use agency or county behavioral health office can explain local assessment and funding rules. Publicly funded programs may have waitlists or require a referral, so call more than one source and ask what documents are needed. If withdrawal may be medically dangerous or there is an emergency, seek urgent care instead of waiting for a funding decision.",
      },
      {
        heading: "Check Medicaid eligibility before paying privately",
        body: "Medicaid covers substance use disorder services, but eligibility, covered levels of care, and provider networks differ by state. Apply even if you were not eligible in the past, especially after a change in income, household, disability status, pregnancy, or other circumstances. Ask the treatment program whether it can help with an application and whether coverage can apply to care received before approval under your state's rules. If you are already enrolled, call the number on the Medicaid card and request an assessment or a list of contracted providers. Confirm the exact program, address, and level of care before admission.",
      },
      {
        heading: "Ask directly about sliding fees and public funding",
        body: "Many providers adjust fees according to income and family size, offer payment assistance, or reserve beds supported by state or federal funds. Use direct language when calling: ask whether the program has a sliding-fee scale, charity care, block-grant funding, county funding, or a reduced self-pay rate. Find out whether an income statement, tax return, benefits letter, or proof of residence is required. If a grant or scholarship is offered, ask how much it covers, how long it lasts, whether funds are available now, and whether you become responsible for the balance if you leave early.",
      },
      {
        heading: "Use community health centers for affordable outpatient care",
        body: "HRSA-funded health centers serve people whether or not they can pay and adjust fees based on income and family size. Many provide mental health and substance use services, primary care, case management, and discounted pharmacy access. A health center may not offer residential treatment, but it can be a practical starting point for assessment, medication, counseling, and referrals. Use HRSA's Find a Health Center tool, then ask whether the location provides addiction treatment, medication for opioid or alcohol use disorder, and behavioral health appointments. Also ask about transportation help and pharmacy discounts.",
      },
      {
        heading: "Compare the full cost, not the advertised deposit",
        body: "A low deposit can hide a much larger obligation. Request an itemized written estimate that separates assessment, room and board, therapy, physician services, medications, laboratory testing, transportation, and aftercare. Ask whether the price changes if the level of care changes or if you leave early. If a payment plan is offered, get the interest rate, fees, due dates, and total repayment amount in writing. Be cautious with high-interest medical credit, personal loans, or pressure to borrow immediately. A reputable admissions team should explain lower-cost alternatives and give you time to review the terms.",
      },
      {
        heading: "Build a realistic plan for continuing care",
        body: "The most expensive program is not automatically the best, and one short stay is not a complete recovery plan. Compare whether a lower-cost outpatient program can safely meet your needs, and budget for medication, therapy, transportation, housing, and follow-up care. Ask each provider what services continue after discharge and which of them have separate charges. Free peer-support groups can add community support but do not replace medical care or clinically necessary treatment. Keep copies of every estimate, financial-assistance decision, receipt, and payment agreement until billing is finished.",
      },
    ],
    sources: [
      {
        label: "SAMHSA: Free and low-cost treatment options",
        href: "https://www.samhsa.gov/find-support/how-to-pay-for-treatment/free-or-low-cost-treatment",
      },
      {
        label: "FindTreatment.gov: Payment and treatment costs",
        href: "https://findtreatment.gov/what-to-expect/payment",
      },
      {
        label: "HRSA: What is a health center?",
        href: "https://bphc.hrsa.gov/about-health-center-program/what-health-center",
      },
    ],
  },
  {
    slug: "what-happens-in-residential-treatment",
    title: "What happens in residential treatment day to day?",
    description:
      "Residential treatment provides a structured place to live while receiving addiction care. Learn what intake, a typical schedule, therapy, medication, rules, family contact, and discharge planning may look like.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "The first days focus on assessment and a treatment plan",
        body: "Residential treatment begins with an intake that should cover substance use, withdrawal risk, physical and mental health, medications, housing, family support, work, legal issues, and recovery goals. The program uses this information to create a written plan with a diagnosis, goals, services, and next steps. You may complete medical screening, meet members of the clinical team, review program rules, and receive a room assignment. If withdrawal management is needed, it may occur before residential care or in a program licensed to provide both services. Ask which assessments happen on site and which require an outside provider.",
      },
      {
        heading: "Most days follow a structured schedule",
        body: "A typical day may include a set wake-up time, meals, group therapy, educational sessions, individual counseling, recovery activities, medication times, exercise or recreation, and an evening check-in. Some programs include mutual-help meetings, mindfulness, family sessions, or practical skills such as planning, communication, and relapse prevention. The exact schedule varies widely. Ask for a sample weekday and weekend schedule before admission, including the amount of individual therapy, unstructured time, and access to outdoor space. A full calendar of activities is not the same as clinically appropriate care, so also ask who leads each service and how it connects to your treatment plan.",
      },
      {
        heading: "Medical and mental health support varies by facility",
        body: "Residential care is a 24-hour living setting, but it is not always a hospital. A non-hospital program may have a physician on certain days or on call rather than on site at all times. Nursing coverage, psychiatric care, medication management, and emergency procedures differ between facilities. Ask who is physically present overnight, how often you meet a prescriber, and which hospital receives transfers. If you have depression, anxiety, trauma, bipolar disorder, psychosis, chronic pain, pregnancy, or another medical condition, confirm that the program can treat or coordinate that need instead of assuming it is included.",
      },
      {
        heading: "Rules create structure but should be explained clearly",
        body: "Programs often have rules about phones, visitors, leaving the grounds, personal belongings, smoking, medication storage, drug testing, and contact with other residents after discharge. These rules can support safety and focus, but they should be available before admission and applied consistently. Ask when you can contact family, whether devices are stored or restricted, how work or legal obligations are handled, and what happens after a rule violation or a return to use. You should also receive information about privacy, complaints, patient rights, and how to request an accommodation for disability, language, religion, diet, or family responsibilities.",
      },
      {
        heading: "Family involvement requires the patient's permission",
        body: "Many programs offer family education, counseling, or scheduled visits because substance use affects the whole household. The patient should be involved in deciding what information can be shared and with whom. Ask how releases of information work, when family sessions begin, and whether relatives can receive support even if the patient does not authorize clinical updates. A family program should help people understand recovery, communication, boundaries, and planning for home, not turn relatives into monitors. If family contact is unsafe or unwanted, discuss that during intake so the treatment plan protects privacy and safety.",
      },
      {
        heading: "Discharge planning should start early",
        body: "Residential treatment lasts for a limited time, while recovery support continues afterward. A quality program begins planning early for the next level of care, medication, therapy, recovery housing if needed, primary care, transportation, and peer support. Ask how progress is measured, how often the plan is reviewed, and what could lead to a longer stay, earlier discharge, or a step down to PHP, IOP, or outpatient care. Before leaving, you should have written medication instructions, scheduled follow-up appointments, emergency contacts, and a practical plan for the first days at home.",
      },
    ],
    sources: [
      {
        label: "SAMHSA: What to expect from treatment",
        href: "https://www.samhsa.gov/find-support/learn-about-treatment/what-to-expect-from-treatment",
      },
      {
        label: "NIAAA: Questions for alcohol treatment programs",
        href: "https://alcoholtreatment.niaaa.nih.gov/how-to-find-alcohol-treatment/10-questions-for-alcohol-treatment-programs",
      },
      {
        label: "NIAAA: Signs of quality treatment",
        href: "https://alcoholtreatment.niaaa.nih.gov/how-to-find-alcohol-treatment/step-3-choose-quality-care",
      },
    ],
  },
  {
    slug: "help-a-loved-one-who-refuses-treatment",
    title: "How to help a loved one who refuses treatment",
    description:
      "You cannot force a lasting recovery conversation, but you can improve safety, reduce barriers, set clear boundaries, and keep the door open. Learn practical steps for supporting a loved one and yourself.",
    reviewedOn: "2026-10-17",
    sections: [
      {
        heading: "Handle immediate danger first",
        body: "If the person is unconscious, cannot be awakened, has slow or stopped breathing, is having a seizure, is severely confused, or may harm themselves or someone else, call 911. If opioids may be involved, give naloxone if it is available and stay until emergency help arrives. Naloxone can reverse an opioid overdose when given in time and is available over the counter in the United States. Do not wait for the person to agree to treatment during an emergency. For a mental health or suicide crisis, call or text 988. When the situation is stable, you can return to a calmer conversation about longer-term help.",
      },
      {
        heading: "Choose a calm time and speak without judgment",
        body: "Do not start the conversation while the person is intoxicated, in withdrawal, or in the middle of an argument. Choose a private time with few distractions. Describe specific things you have noticed and how they affect safety, health, work, or family, rather than using labels or listing every past mistake. Use a calm tone and listen for what the person fears about treatment. SAMHSA recommends open-ended questions, such as what they like and do not like about their current situation or how they would want life to be different. Reflect back what you heard before offering solutions.",
      },
      {
        heading: "Offer choices and remove practical barriers",
        body: "A refusal may be about a specific option rather than all help. Ask what they might consider: a primary care visit, medication, individual therapy, telehealth, an outpatient program, a support group, or a confidential assessment. Offer to research licensed providers, sit with them during calls, arrange transportation, care for children, or help verify insurance. Present two or three credible choices instead of one ultimatum. If every option is rejected, leave written information and ask permission to check in later. It may take many conversations before someone accepts help.",
      },
      {
        heading: "Set boundaries around what you will and will not do",
        body: "Support does not require protecting someone from every consequence or accepting unsafe behavior. Decide which boundaries are necessary for safety and your own wellbeing, such as not providing cash, not allowing substance use in your home, not lying to an employer, or not driving with someone who is impaired. State the boundary clearly, explain what you will do if it is crossed, and follow through consistently. Avoid threats you cannot keep. You can say that you will help arrange treatment, transportation, or meals while also declining requests that increase risk or take over your life.",
      },
      {
        heading: "Prepare for the moment they become willing",
        body: "Motivation can change quickly, so do the research in advance. Keep contact information for a licensed treatment provider, the person's insurer, the state substance use agency, and SAMHSA's National Helpline. Ask programs how quickly they can complete an assessment, what identification is needed, whether withdrawal requires medical care, and which payment options are available. Do not promise that one program will cure the problem. Offer a first step that can happen soon, such as calling a clinician together or attending an appointment, and let the person participate in choosing the plan whenever it is safe to do so.",
      },
      {
        heading: "Get support for yourself",
        body: "Living with another person's substance use can be exhausting and isolating. Family therapy, a licensed counselor, and peer groups for relatives can help you make decisions, practice conversations, and maintain boundaries. Support for yourself is useful even if your loved one refuses treatment. Protect your sleep, finances, medical care, and connections with other people. If children or vulnerable adults are affected, seek professional guidance about safety and legal responsibilities in your area. Your support can matter, but the other person remains responsible for their choices and recovery.",
      },
    ],
    sources: [
      {
        label: "SAMHSA: How to talk to someone about getting help",
        href: "https://www.samhsa.gov/find-support/helping-someone/how-to-talk-to-someone-about-help",
      },
      {
        label: "NIAAA: Starting the conversation",
        href: "https://alcoholtreatment.niaaa.nih.gov/support-through-the-process/starting-the-conversation",
      },
      {
        label: "SAMHSA: Taking care of yourself",
        href: "https://www.samhsa.gov/find-support/helping-someone/caring-for-yourself",
      },
      {
        label: "CDC: Lifesaving naloxone",
        href: "https://www.cdc.gov/stop-overdose/caring/naloxone.html",
      },
    ],
  },
  ...guideBatch1,
  ...guideBatch2,
  ...guideBatch3,
  ...guideBatch4,
];
