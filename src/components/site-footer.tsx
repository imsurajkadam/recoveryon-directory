import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="TreatmentLane home" prefetch={false}><BrandMark light /></Link>
          <p>A transparent directory for finding and comparing addiction treatment and recovery resources.</p>
          <p className="footer-note">TreatmentLane is an informational directory, not a treatment provider or emergency service.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/directory" prefetch={false}>Find care</Link>
          <Link href="/care" prefetch={false}>Types of care</Link>
          <Link href="/locations" prefetch={false}>Browse locations</Link>
          <Link href="/guides" prefetch={false}>Guides</Link>
        </div>
        <div>
          <h2>Trust</h2>
          <Link href="/about/editorial-standards" prefetch={false}>Editorial standards</Link>
          <Link href="/how-we-verify" prefetch={false}>How we verify</Link>
          <Link href="/corrections" prefetch={false}>Request a correction</Link>
          <Link href="/about" prefetch={false}>About us</Link>
          <Link href="/contact" prefetch={false}>Contact</Link>
          <Link href="/advertise" prefetch={false}>Advertise</Link>
        </div>
        <div>
          <h2>Important</h2>
          <Link href="/emergency-help" prefetch={false}>Emergency help</Link>
          <Link href="/privacy" prefetch={false}>Privacy</Link>
          <Link href="/terms" prefetch={false}>Terms</Link>
          <Link href="/providers/apply" prefetch={false}>List your organization</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} TreatmentLane</span>
        <span>Information should be confirmed directly with providers.</span>
      </div>
    </footer>
  );
}
