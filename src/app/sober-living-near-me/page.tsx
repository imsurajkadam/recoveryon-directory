import { NearMePage, nearMeMetadata } from "@/components/near-me-page";

export const revalidate = 3600;

export function generateMetadata() { return nearMeMetadata("sober-living"); }

export default function Page() { return <NearMePage careSlug="sober-living" />; }
