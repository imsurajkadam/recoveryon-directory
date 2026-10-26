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
