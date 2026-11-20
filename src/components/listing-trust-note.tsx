import Link from "next/link";
import { VerifiedTick } from "@/components/verified-tick";

/** Compact disclosure shown above every results list, so the ordering rules never push listings down. */
export function ListingTrustNote() {
  return (
    <details className="listing-trust-note">
      <summary>How listings are ordered</summary>
      <ul>
        <li>Paid placements are always labeled Featured and appear first. Nothing else is paid.</li>
        <li><VerifiedTick size={15} /> TreatmentLane Verified means the provider claimed the listing and confirmed its details with us.</li>
        <li>All other listings are ordered by source evidence, profile completeness, and review confidence.</li>
        <li>TreatmentLane is a directory, not a referral service. Confirm licensing, insurance, and cost directly with the provider.</li>
      </ul>
      <Link href="/how-we-verify" prefetch={false}>Read how we verify listings</Link>
    </details>
  );
}
