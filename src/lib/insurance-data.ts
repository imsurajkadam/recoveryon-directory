export interface Insurer {
  slug: string;
  name: string;
  description: string;
  /** Limit listings to one state (e.g. Medi-Cal is California-only). */
  state?: string;
}

export const insurers: Insurer[] = [
  { slug: "aetna", name: "Aetna", description: "Aetna covers substance use treatment including detox, residential, and outpatient care. Coverage varies by plan; verify in-network status before admission." },
  { slug: "cigna", name: "Cigna", description: "Cigna covers addiction treatment at multiple levels of care. Many plans require prior authorization for residential treatment." },
  { slug: "blue-cross-blue-shield", name: "Blue Cross Blue Shield", description: "BCBS plans cover substance use disorder treatment. Benefits differ by state plan; check your specific policy for detox and rehab coverage." },
  { slug: "unitedhealthcare", name: "UnitedHealthcare", description: "UnitedHealthcare covers medically necessary addiction treatment including MAT. Verify your plan covers the specific facility." },
  { slug: "humana", name: "Humana", description: "Humana covers substance use treatment. Coverage levels depend on your plan type and whether the provider is in-network." },
  { slug: "medicaid", name: "Medicaid", description: "Medicaid covers addiction treatment in all states, though covered services vary. Many facilities accept Medicaid; check state-specific benefits." },
  { slug: "medicare", name: "Medicare", description: "Medicare covers inpatient and outpatient substance use treatment when medically necessary. Part A covers inpatient, Part B covers outpatient." },
  { slug: "kaiser-permanente", name: "Kaiser Permanente", description: "Kaiser covers addiction treatment within its network. Referrals typically go through Kaiser's own behavioral health services." },
  { slug: "tricare", name: "TRICARE", description: "TRICARE is the health program for uniformed service members, retirees, and their families. It covers medically necessary substance use disorder care, including inpatient, residential, partial hospitalization, intensive outpatient, and outpatient treatment. Some levels of care need a referral or prior authorization." },
  { slug: "medi-cal", name: "Medi-Cal", state: "CA", description: "Medi-Cal is California's Medicaid program. It covers substance use disorder treatment, and in counties that run the Drug Medi-Cal Organized Delivery System, members can get a wider range of services, often through county behavioral health. Covered services and how to start care vary by county." },
  { slug: "va-community-care", name: "VA Community Care", description: "VA Community Care lets eligible veterans get treatment from community providers outside the VA when the VA authorizes it. Ask your VA care team about eligibility and get an authorization before starting treatment with a community provider." },
];
