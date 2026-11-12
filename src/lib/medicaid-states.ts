/** The 20 states with the most Medicaid-accepting listings (12 Nov 2026), with the program's public name. */
export const medicaidStates: Array<{ code: string; program: string }> = [
  { code: "CA", program: "Medi-Cal" },
  { code: "NY", program: "New York Medicaid" },
  { code: "OH", program: "Ohio Medicaid" },
  { code: "PA", program: "Medical Assistance (HealthChoices)" },
  { code: "MD", program: "Maryland Medicaid (HealthChoice)" },
  { code: "IL", program: "Illinois Medicaid (HealthChoice Illinois)" },
  { code: "KY", program: "Kentucky Medicaid" },
  { code: "TX", program: "Texas Medicaid" },
  { code: "FL", program: "Florida Medicaid" },
  { code: "MN", program: "Medical Assistance" },
  { code: "NC", program: "NC Medicaid" },
  { code: "IN", program: "Indiana Medicaid" },
  { code: "MI", program: "Michigan Medicaid" },
  { code: "AZ", program: "AHCCCS" },
  { code: "VA", program: "Cardinal Care" },
  { code: "MA", program: "MassHealth" },
  { code: "NJ", program: "NJ FamilyCare" },
  { code: "WI", program: "BadgerCare Plus" },
  { code: "TN", program: "TennCare" },
  { code: "WA", program: "Apple Health" },
];

export function medicaidState(code: string) {
  return medicaidStates.find((item) => item.code === code);
}
