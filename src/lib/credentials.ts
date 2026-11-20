import type { Provider } from "@/lib/types";

type CredentialFields = Pick<Provider, "accreditation"> & Partial<Pick<Provider, "reportedAccreditation" | "reportedLicensing">>;

function unique(values: string[]) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

/**
 * Accreditation to show for a listing. Provider-confirmed values come first; facility-reported
 * SAMHSA values follow. `confirmed` is true only when the provider supplied the accreditation.
 * Reported fields are optional because cached provider records can predate them.
 */
export function listingAccreditation(provider: CredentialFields) {
  const reported = provider.reportedAccreditation || [];
  return {
    all: unique([...provider.accreditation, ...reported]),
    confirmed: provider.accreditation.length > 0,
    reported: reported.length > 0,
  };
}

export function listingLicensing(provider: CredentialFields) {
  return provider.reportedLicensing || [];
}

export const accreditationLookups: Record<string, { label: string; href: string }> = {
  "The Joint Commission": { label: "Joint Commission Quality Check", href: "https://www.qualitycheck.org/" },
  "CARF International": { label: "CARF Find a Provider", href: "https://carf.org/" },
};
