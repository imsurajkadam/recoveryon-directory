import { NearMePage, nearMeMetadata } from "@/components/near-me-page";

export const revalidate = 3600;

export function generateMetadata() { return nearMeMetadata("detox"); }

export default function Page() { return <NearMePage careSlug="detox" />; }
