import type { Guide } from "@/lib/content";

// Phase 3 guides (SEO Master Plan, Nov 2026): low-difficulty informational searches.
// Listing counts are TreatmentLane figures from 12 Nov 2026.
const REVIEWED = "2026-11-12";
const disclaimer = " This guide is educational and does not replace advice from your health plan, a benefits counselor, or a qualified professional.";

export const guideBatch5: Guide[] = [
  {
    slug: "does-medicaid-cover-rehab",
    title: "Does Medicaid cover rehab? What's covered and how to use it",
    description: "Medicaid covers addiction treatment in every state, but each state decides which levels of care are covered and how to get approved. Here is what is usually covered, what often is not, and how to find a program that takes your plan." + disclaimer,
    reviewedOn: REVIEWED,
    sections: [
      { heading: "The short answer", body: "Yes. Every state Medicaid program covers some treatment for substance use disorders, and Medicaid is the largest single payer of addiction treatment in the US. What differs is the detail: each state chooses which levels of care it covers, which providers are in network, and when you need prior authorization. Most people with Medicaid are enrolled in a managed care plan, so that plan, not the state, usually approves services and keeps the provider network. Of the 33,317 listings on TreatmentLane, 16,076 report accepting Medicaid." },
      { heading: "What Medicaid usually covers", body: "Most programs cover an assessment, outpatient counseling, intensive outpatient programs, medically managed withdrawal (detox), and medications for opioid use disorder. Federal law requires state Medicaid programs to cover all FDA-approved medications for opioid use disorder, which are methadone, buprenorphine, and naltrexone, along with related counseling. Many states also cover partial hospitalization, residential treatment, peer recovery support, and case management. Adults covered through Medicaid expansion receive a benefit package that must include mental health and substance use disorder services." },
      { heading: "Residential treatment and the IMD exclusion", body: "A long-standing federal rule, the Institution for Mental Diseases (IMD) exclusion, limits federal Medicaid payment for adults aged 21 to 64 treated in facilities with more than 16 beds for mental health or substance use care. Most states now have a Section 1115 waiver that lets Medicaid pay for short-term residential and inpatient addiction treatment in those facilities; the Congressional Research Service counted 37 states and DC with approved waivers in January 2025. If you need residential care, ask the program whether it is approved for your state's Medicaid and how many days your plan typically authorizes." },
      { heading: "What Medicaid usually does not pay for", body: "Sober living homes and other recovery housing are generally not covered, because rent is housing rather than clinical treatment, although some states and counties fund recovery housing separately. Out-of-state programs are usually not covered unless your state approves them in advance. Luxury amenities, private rooms, and programs that are not enrolled with your state Medicaid agency are not covered, even if the treatment itself would be." },
      { heading: "How to get treatment approved", body: "Start by calling the member services number on your Medicaid or managed care card and asking for behavioral health or substance use services. Many plans let you self-refer to outpatient care, while residential treatment usually needs an assessment and prior authorization. A provider in your plan's network can often complete the assessment and submit the request for you. Ask how long approval takes and what happens if a request is denied; you have the right to appeal a denial." },
      { heading: "How to find a program that takes your Medicaid", body: "Filter for Medicaid on TreatmentLane, or open your state's page, such as the Medicaid pages for California (Medi-Cal), Arizona (AHCCCS), or Massachusetts (MassHealth). Then call the program and confirm three things: that it accepts your specific plan, that it offers the level of care you need, and whether it has a waitlist. FindTreatment.gov, run by SAMHSA, also lets you filter by Medicaid. If you are not enrolled yet, you can apply through your state Medicaid agency or HealthCare.gov at any time of year." },
    ],
    faq: [
      { question: "Does Medicaid pay for inpatient rehab?", answer: "Often, yes. Medicaid covers inpatient hospital care when it is medically necessary, and most states can now pay for short-term residential addiction treatment through Section 1115 waivers. Coverage length and approval rules depend on your state and plan." },
      { question: "Does Medicaid cover methadone and Suboxone?", answer: "Yes. Federal law requires state Medicaid programs to cover all FDA-approved medications for opioid use disorder, including methadone and buprenorphine products such as Suboxone, plus naltrexone." },
      { question: "Can I use Medicaid for rehab in another state?", answer: "Usually not. Medicaid is run by each state, so out-of-state treatment is generally covered only for emergencies or when your state approves it in advance." },
    ],
    related: [
      { label: "Rehabs that accept Medicaid", href: "/insurance/medicaid" },
      { label: "Medicaid rehab in California (Medi-Cal)", href: "/insurance/medicaid/california" },
      { label: "Medicaid rehab in New York", href: "/insurance/medicaid/new-york" },
    ],
    sources: [
      { label: "Medicaid.gov: Behavioral health services", href: "https://www.medicaid.gov/medicaid/benefits/behavioral-health-services/index.html" },
      { label: "Congressional Research Service: Medicaid's IMD exclusion", href: "https://www.everycrsreport.com/reports/IF10222.html" },
      { label: "HealthCare.gov: Mental health and substance abuse coverage", href: "https://www.healthcare.gov/coverage/mental-health-substance-abuse-coverage/" },
      { label: "FindTreatment.gov (SAMHSA)", href: "https://findtreatment.gov/" },
    ],
  },
  {
    slug: "does-medicare-cover-rehab",
    title: "Does Medicare cover rehab? Parts A, B, D and what's left out",
    description: "Medicare covers inpatient hospital treatment, outpatient counseling, partial hospitalization, intensive outpatient programs, opioid treatment programs, and addiction medications. It does not cover non-hospital residential rehab. Here is how each part works." + disclaimer,
    reviewedOn: REVIEWED,
    sections: [
      { heading: "The short answer", body: "Medicare covers most medically necessary addiction treatment except one important setting: residential rehab in a facility that is not a hospital. Inpatient hospital care falls under Part A, outpatient and day programs fall under Part B, and prescription medications fall under Part D. Medicare Advantage plans must cover everything Original Medicare covers but can require in-network providers and prior authorization. On TreatmentLane, 11,841 listings report accepting Medicare." },
      { heading: "Part A: inpatient hospital care", body: "Part A covers substance use treatment when you are admitted as an inpatient to a general hospital or a psychiatric hospital and the stay is medically necessary, for example for medically managed withdrawal or treatment of serious co-occurring conditions. The usual Part A deductible and daily coinsurance for long stays apply. Care in a freestanding psychiatric hospital is limited to 190 days over a lifetime; that limit does not apply to psychiatric units in general hospitals." },
      { heading: "Part B: outpatient, PHP and IOP", body: "Part B covers outpatient counseling and therapy, screening and brief intervention, and partial hospitalization programs. Since January 1, 2024, Part B also covers intensive outpatient program (IOP) services delivered by hospital outpatient departments, community mental health centers, federally qualified health centers, rural health clinics, and opioid treatment programs. After the yearly Part B deductible, you generally pay 20% of the Medicare-approved amount unless you have supplemental coverage." },
      { heading: "Opioid treatment programs and medications", body: "Part B covers services from Medicare-enrolled opioid treatment programs, including methadone and buprenorphine dispensed there, counseling, and drug testing, bundled into a weekly payment. Medications you fill at a pharmacy, such as buprenorphine or naltrexone tablets, are covered through your Part D plan or Medicare Advantage drug coverage, subject to the plan's formulary and cost sharing." },
      { heading: "What Medicare does not cover", body: "Original Medicare does not pay for residential addiction treatment in facilities that are not hospitals, which is how most 30-, 60- or 90-day rehab programs are licensed. It also does not pay for sober living, room and board outside a hospital, or programs that are not enrolled in Medicare. Some Medicare Advantage plans offer extra behavioral health benefits, so check your plan's evidence of coverage before assuming a program is excluded." },
      { heading: "How to use Medicare for treatment", body: "Ask any program you are considering whether it is enrolled in Medicare and which services it bills to Medicare, because some facilities accept Medicare for outpatient care but not for their residential program. If you have Medicare Advantage, call the plan first to check the network and any prior authorization. People with both Medicare and Medicaid should tell the program, since Medicare pays first and Medicaid may cover services Medicare does not, including residential treatment in many states." },
    ],
    faq: [
      { question: "Does Medicare cover a 30-day rehab program?", answer: "Usually not, if the program is residential treatment in a facility that is not a hospital. Medicare covers inpatient hospital stays when medically necessary, plus outpatient, partial hospitalization, and intensive outpatient care." },
      { question: "Does Medicare cover intensive outpatient programs?", answer: "Yes. Since January 1, 2024, Medicare Part B covers IOP services for mental health and substance use disorders in hospital outpatient departments, community mental health centers, federally qualified health centers, rural health clinics, and opioid treatment programs." },
      { question: "Does Medicare cover methadone?", answer: "Yes. Part B covers methadone and other opioid use disorder treatment provided by Medicare-enrolled opioid treatment programs." },
    ],
    related: [
      { label: "Insurance and rehab costs", href: "/insurance" },
      { label: "Intensive outpatient programs near me", href: "/iop-near-me" },
      { label: "What is an intensive outpatient program?", href: "/guides/what-is-an-intensive-outpatient-program" },
    ],
    sources: [
      { label: "Medicare.gov: Intensive outpatient program services", href: "https://www.medicare.gov/coverage/mental-health-care-intensive-outpatient-program-services" },
      { label: "Medicare.gov: Outpatient mental health care", href: "https://www.medicare.gov/coverage/mental-health-care-outpatient" },
      { label: "CMS: Opioid treatment programs", href: "https://www.cms.gov/medicare/payment/opioid-treatment-program" },
      { label: "Center for Health Care Strategies: Medicare IOP coverage", href: "https://www.chcs.org/resource/new-changes-to-intensive-outpatient-program-coverage/" },
    ],
  },
  {
    slug: "inpatient-vs-outpatient-rehab",
    title: "Inpatient vs outpatient rehab: how to choose the right level of care",
    description: "Inpatient and residential rehab provide 24-hour care, while outpatient treatment lets you live at home. Learn how standard outpatient, IOP, PHP, residential, and inpatient care differ and how clinicians decide which one fits." + disclaimer,
    reviewedOn: REVIEWED,
    sections: [
      { heading: "The core difference", body: "Inpatient and residential rehab mean you live at the facility and have staff available 24 hours a day. Outpatient treatment means you live at home and attend scheduled sessions. Between those two sit day programs that are intensive but still let you sleep at home. Most people do not choose just one: treatment often starts at a higher level and steps down as stability improves." },
      { heading: "The outpatient options", body: "Standard outpatient care is usually one or two counseling sessions a week. Intensive outpatient programs (IOPs) typically run about 9 to 19 hours a week for adults, often three hours a day on three to five days. Partial hospitalization programs (PHPs), sometimes called day treatment, usually run 20 or more hours a week, close to a full day, five days a week. On TreatmentLane, more than 24,000 listings offer outpatient treatment, about 6,300 offer IOP, and about 5,700 offer partial hospitalization or day treatment." },
      { heading: "The inpatient and residential options", body: "Residential treatment provides a structured, substance-free place to live with therapy, groups, and support throughout the day, for a few weeks to several months. Inpatient care in a hospital or medically managed unit adds round-the-clock nursing and physician care, and is used when withdrawal or medical or psychiatric conditions need close monitoring. Medically managed withdrawal (detox) can happen inpatient or, for lower-risk situations, as outpatient care." },
      { heading: "How clinicians decide", body: "Most programs use the ASAM Criteria, a framework from the American Society of Addiction Medicine that looks at several dimensions: risk of severe withdrawal, physical health, mental health, readiness to change, risk of relapse, and the safety and support of the home environment. Someone with a stable home, no dangerous withdrawal risk, and good support may do well in IOP. Someone with serious withdrawal risk, repeated relapses at lower levels, or an unsafe living situation is more likely to need residential or inpatient care." },
      { heading: "Trade-offs to weigh", body: "Outpatient care lets you keep working, studying, or caring for family, costs less, and lets you practice new skills in everyday life, but it also keeps you close to triggers. Residential care removes daily triggers and offers more structure, but it means time away and usually costs more, and the move back home needs a plan. Insurance often approves residential care for a limited number of days and expects a step down to PHP or IOP afterward." },
      { heading: "Questions to ask before you choose", body: "Ask who will complete the assessment and which level of care they recommend and why. Ask how the program decides when you are ready to step down, whether it offers medications for addiction, how it treats co-occurring mental health conditions, and what aftercare it arranges. Confirm that your insurance covers the recommended level and whether prior authorization is needed." },
    ],
    faq: [
      { question: "Is inpatient rehab more effective than outpatient?", answer: "Not for everyone. Research supports matching the level of care to a person's needs. Outpatient treatment can work well for people with stable homes and lower medical risk, while people with severe withdrawal risk or unsafe living situations usually need residential or inpatient care first." },
      { question: "What is the difference between IOP and PHP?", answer: "Both let you live at home. A partial hospitalization program usually runs most of the day, five days a week, while an intensive outpatient program takes fewer hours, typically 9 to 19 a week, so it is easier to combine with work or school." },
      { question: "Is residential treatment the same as inpatient?", answer: "Not exactly. Residential treatment is a live-in program focused on therapy and structure, while inpatient care usually means a hospital or medically managed unit with 24-hour nursing and physician care." },
    ],
    related: [
      { label: "Residential vs inpatient treatment", href: "/guides/residential-vs-inpatient-treatment" },
      { label: "What is a partial hospitalization program?", href: "/guides/what-is-a-partial-hospitalization-program" },
      { label: "IOP near me", href: "/iop-near-me" },
    ],
    sources: [
      { label: "ASAM: The ASAM Criteria", href: "https://www.asam.org/asam-criteria" },
      { label: "SAMHSA: Treatment options for substance use disorder", href: "https://www.samhsa.gov/substance-use/treatment/options" },
      { label: "FindTreatment.gov: What to expect from treatment", href: "https://findtreatment.gov/what-to-expect/treatment" },
    ],
  },
  {
    slug: "how-much-does-rehab-cost",
    title: "How much does rehab cost? What drives the price and how to pay less",
    description: "Rehab can cost anything from nothing to tens of thousands of dollars, depending on the level of care, length of stay, setting, and your insurance. Here is what drives the price, how insurance limits what you pay, and where to find low-cost care." + disclaimer,
    reviewedOn: REVIEWED,
    sections: [
      { heading: "Why there is no single price", body: "Treatment costs depend on the level of care, how long you stay, where the program is, whether it is a nonprofit, public, or private facility, and the amenities it offers. A weekly outpatient counseling session and a 30-day private residential program are both called rehab but differ in price by orders of magnitude. Treat any single national average with caution and get a written estimate from each program you are considering." },
      { heading: "What drives the cost up or down", body: "Residential and inpatient care cost the most because they include housing, meals, and 24-hour staff; IOP and standard outpatient cost far less per week. Medical detox, psychiatric care, and medications add cost but may be essential. Location matters, and so do private rooms and resort-style amenities, which add cost without adding clinical value. Whether a program is in your insurance network often matters more than its list price." },
      { heading: "How insurance limits what you pay", body: "Most health plans sold on HealthCare.gov must cover mental health and substance use disorder services as an essential health benefit, and federal parity law requires most group and individual plans to cover them no more restrictively than medical and surgical care. In-network costs count toward your plan's out-of-pocket maximum; for 2026 Marketplace plans, that maximum can be no more than $10,600 for an individual or $21,200 for a family. Out-of-network care can cost much more and may not count toward that limit." },
      { heading: "If you are uninsured or paying yourself", body: "Under the No Surprises Act, providers must give uninsured and self-pay patients a good faith estimate of expected charges when care is scheduled, and you can dispute a bill that is substantially higher. On TreatmentLane, 16,137 listings report accepting cash or self-pay. Ask about sliding-scale fees, payment plans, and what is included in the price, such as medication, lab tests, and aftercare." },
      { heading: "Low-cost and free options", body: "State-funded and county programs, many supported by federal block grants, offer treatment on a sliding scale or free to people who qualify, and Medicaid covers addiction treatment in every state. Opioid treatment programs and federally qualified health centers often accept Medicaid and offer reduced fees. Some private programs offer scholarships, and many recovery support services, such as mutual-help meetings, are free." },
      { heading: "How to compare costs between programs", body: "Ask each program for a written estimate that lists the daily or weekly rate, what is included, what is billed separately, and what your insurance is expected to pay. Call your insurer to confirm network status and prior authorization before admission. Be wary of programs that waive all costs, offer free travel, or pressure you to decide quickly; those can be signs of insurance fraud." },
    ],
    faq: [
      { question: "Does insurance pay for rehab?", answer: "Most health plans cover addiction treatment, including Marketplace plans, employer plans, Medicaid, and Medicare, but coverage depends on the level of care, the provider's network status, and medical necessity. Confirm benefits and prior authorization with your plan before admission." },
      { question: "What is the cheapest way to get addiction treatment?", answer: "Medicaid, state-funded programs, and sliding-scale clinics are usually the lowest-cost options. Outpatient and intensive outpatient care also cost far less than residential treatment when they are clinically appropriate." },
      { question: "Can a rehab give me a price upfront?", answer: "Yes. If you are uninsured or paying yourself, providers must give you a good faith estimate of expected charges when your care is scheduled." },
    ],
    related: [
      { label: "Questions to ask about treatment costs", href: "/guides/questions-to-ask-about-treatment-costs" },
      { label: "Rehab scholarships and grants", href: "/guides/rehab-scholarships-and-grants" },
      { label: "Rehabs that accept Medicaid", href: "/insurance/medicaid" },
    ],
    sources: [
      { label: "HealthCare.gov: Mental health and substance abuse coverage", href: "https://www.healthcare.gov/coverage/mental-health-substance-abuse-coverage/" },
      { label: "HealthCare.gov: Out-of-pocket maximum", href: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" },
      { label: "CMS: No Surprises Act and good faith estimates", href: "https://www.cms.gov/nosurprises" },
      { label: "U.S. Department of Labor: Mental health and substance use disorder parity", href: "https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/mental-health-and-substance-use-disorder-parity" },
    ],
  },
  {
    slug: "does-blue-cross-blue-shield-cover-rehab",
    title: "Does Blue Cross Blue Shield cover rehab? How to check your plan",
    description: "Blue Cross Blue Shield plans cover addiction treatment, but coverage depends on your local Blue company and your specific plan. Here is how BCBS coverage usually works, what to ask, and how to find programs in network." + disclaimer,
    reviewedOn: REVIEWED,
    sections: [
      { heading: "The short answer", body: "Most Blue Cross Blue Shield plans cover substance use disorder treatment, including detox, inpatient and residential care, partial hospitalization, intensive outpatient programs, outpatient counseling, and medications. But BCBS is not one insurer: it is a federation of more than 30 independent, locally operated companies, such as Anthem, Highmark, and Florida Blue, and each offers many plans. Your benefits depend on which company issued your card and which plan you have." },
      { heading: "Why your specific plan matters", body: "Blue companies sell employer plans, individual Marketplace plans, Medicare Advantage plans, and Medicaid managed care plans, and the rules differ for each. Employer and Marketplace plans generally must follow federal parity law, so they cannot cover addiction treatment more restrictively than comparable medical care. Medicare Advantage plans follow Medicare's coverage rules, and Medicaid plans follow your state's rules. Federal employees covered through the Federal Employee Program have their own benefit brochure." },
      { heading: "What to check before admission", body: "Call the behavioral health number on your BCBS card, or log in to your member portal, and ask: which levels of care are covered, whether prior authorization is needed, how many days are typically approved, your deductible and coinsurance, and how much of your out-of-pocket maximum is left. Ask the treatment program to verify your benefits too; most admissions teams do this for free and can start the authorization." },
      { heading: "In-network care, including out of state", body: "In-network programs cost far less than out-of-network ones. Through the BlueCard program, members can often use in-network providers of other Blue companies when they travel, which matters if you are considering treatment in another state. Confirm network status directly with both the program and your plan, because a facility may be in network for one Blue company's plans but not another's." },
      { heading: "Finding BCBS-friendly programs on TreatmentLane", body: "Most listings report insurance in general terms, so carrier names are not always shown. On TreatmentLane, 295 listings name Blue Cross Blue Shield specifically, 174 name Anthem, and 17,219 report accepting private insurance. Use the insurance filter to narrow your search, then call the programs on your shortlist to confirm they accept your exact BCBS plan." },
      { heading: "If coverage is denied", body: "Ask for the denial in writing, including the medical-necessity criteria used. You can request an internal appeal, and an urgent appeal when a delay could harm your health, followed by an external review by an independent reviewer if the denial stands. The treatment program's utilization review staff can often help with the appeal." },
    ],
    faq: [
      { question: "Does Blue Cross Blue Shield cover inpatient rehab?", answer: "Most BCBS plans cover inpatient and residential addiction treatment when it is medically necessary, usually with prior authorization. Check your plan's behavioral health benefits for limits and cost sharing." },
      { question: "Does BCBS cover Suboxone?", answer: "Most BCBS plans cover buprenorphine products for opioid use disorder through their pharmacy benefit, sometimes with prior authorization. Check your plan's drug formulary." },
      { question: "Can I use my BCBS plan for rehab in another state?", answer: "Often, yes. The BlueCard program lets many members use in-network providers of other Blue companies, but confirm with your plan and the program before admission." },
    ],
    related: [
      { label: "Rehabs that accept Blue Cross Blue Shield", href: "/insurance/blue-cross-blue-shield" },
      { label: "How much does rehab cost?", href: "/guides/how-much-does-rehab-cost" },
      { label: "All insurance options", href: "/insurance" },
    ],
    sources: [
      { label: "Becker's Payer Issues: Things to know about Blue Cross Blue Shield", href: "https://www.beckerspayer.com/payer/100-things-to-know-about-blue-cross-blue-shield.html" },
      { label: "HealthCare.gov: Mental health and substance abuse coverage", href: "https://www.healthcare.gov/coverage/mental-health-substance-abuse-coverage/" },
      { label: "U.S. Department of Labor: Mental health and substance use disorder parity", href: "https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/mental-health-and-substance-use-disorder-parity" },
      { label: "HealthCare.gov: Appealing a health plan decision", href: "https://www.healthcare.gov/appeal-insurance-company-decision/" },
    ],
  },
];
