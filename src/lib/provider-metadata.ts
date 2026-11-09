import type { Provider } from "@/lib/types";

type ProviderMetadataCopy = {
  title: string;
  description: string;
};

export function getLifeStanceLocationMetadata(provider: Provider): ProviderMetadataCopy | null {
  const isLifeStance = provider.organizationSlug === "lifestance-health"
    || provider.organizationSlug.startsWith("lifestance-health-")
    || provider.name.toLowerCase().includes("lifestance");
  if (!isLifeStance) return null;
  const location = provider.organizationLocationCount > 1 && provider.address
    ? `${provider.address.split(",")[0]}, ${provider.city}`
    : provider.city;
  const careType = provider.treatmentTypes[0] || provider.levelsOfCare[0] || "mental health services";

  return {
    title: `LifeStance Health in ${location}, ${provider.state}: Services`,
    description: `Compare ${careType}, insurance information, source evidence, and contact details for ${provider.name} in ${provider.city}, ${provider.state}.`,
  };
}

export function getLifeStanceOrganizationMetadata(organizationSlug: string, locationCount: number): ProviderMetadataCopy | null {
  if (organizationSlug !== "lifestance-health") return null;

  return {
    title: `LifeStance Health: ${locationCount.toLocaleString("en-US")} Locations and Insurance`,
    description: `Compare ${locationCount.toLocaleString("en-US")} LifeStance Health locations, services, insurance information, source details, and contact options on TreatmentLane.`,
  };
}

// Click-led metadata for every provider location page. Generalizes the
// LifeStance CTR test pattern (PR #8) to the whole directory: the title
// pairs the service with insurance and contact intent, and the description
// leads with the concrete details a searcher compares before clicking.
// Only values present in the provider record are used; nothing is invented.
export function getProviderCtrMetadata(provider: Provider): ProviderMetadataCopy {
  const lifestance = getLifeStanceLocationMetadata(provider);
  if (lifestance) return lifestance;
  const location = provider.organizationLocationCount > 1 && provider.address
    ? `${provider.address.split(",")[0]}, ${provider.city}`
    : provider.city;
  const careType = provider.treatmentTypes[0] || provider.levelsOfCare[0] || provider.categories[0];
  const insurance = provider.insurance.slice(0, 2).join(" and ");
  const ratingCopy = provider.sourceRatingValue && provider.sourceRatingCount
    ? ` Rated ${provider.sourceRatingValue} from ${provider.sourceRatingCount.toLocaleString("en-US")} source reviews.`
    : "";
  const insuranceCopy = insurance ? ` Insurance information includes ${insurance}; verify your benefits directly.` : "";
  const careCopy = careType ? ` offers ${careType}` : " has a published TreatmentLane profile";
  return {
    title: `${provider.name} in ${location}, ${provider.state}: ${careType || "Services"}, Insurance & Contact`,
    description: `${provider.name} in ${provider.city}, ${provider.state}${careCopy}.${ratingCopy}${insuranceCopy} Compare services, verified contact details, and source evidence.`,
  };
}

// Click-led metadata for multi-location organization pages, generalizing
// the LifeStance organization test copy to every organization.
export function getOrganizationCtrMetadata(organizationSlug: string, name: string, locationCount: number): ProviderMetadataCopy {
  const lifestance = getLifeStanceOrganizationMetadata(organizationSlug, locationCount);
  if (lifestance) return lifestance;
  const count = locationCount.toLocaleString("en-US");
  return {
    title: `${name}: ${count} Locations, Insurance & Contact`,
    description: `Compare ${count} ${name} locations on TreatmentLane. View services, insurance information, verified contact details, and source evidence for each location before you call.`,
  };
}
