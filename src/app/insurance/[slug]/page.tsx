import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { insurers } from "@/lib/insurance-data";
import { getDatabase } from "@/lib/db";
import { ProviderCard } from "@/components/provider-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const insurer = insurers.find((i) => i.slug === slug);
  if (!insurer) return {};
  return {
    title: `Rehab centers that accept ${insurer.name}`,
    description: `Find addiction treatment centers that accept ${insurer.name} insurance. Compare verified listings, check coverage details, and verify your benefits.`,
    alternates: { canonical: `/insurance/${slug}` },
  };
}

export default async function InsurancePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insurer = insurers.find((i) => i.slug === slug);
  if (!insurer) notFound();

  const sql = getDatabase();
  let providers: any[] = [];
  if (sql) {
    try {
      const rows = await sql`
        select id, name, slug, city, state, organization_slug, location_slug,
               organization_location_count, featured_image_url, is_sponsored,
               verification_status, source_rating_value, source_rating_count
        from providers
        where publication_status = 'published'
          and exists (select 1 from unnest(insurance) ins where lower(ins) like ${'%' + insurer.name.toLowerCase() + '%'})
        order by is_sponsored desc, source_rating_count desc nulls last
        limit 24
      `;
      providers = rows.map((r: any) => ({
        id: String(r.id), name: String(r.name), slug: String(r.slug),
        city: String(r.city), state: String(r.state),
        organizationSlug: r.organization_slug ? String(r.organization_slug) : null,
        locationSlug: r.location_slug ? String(r.location_slug) : null,
        organizationLocationCount: Number(r.organization_location_count || 1),
        featuredImageUrl: r.featured_image_url ? String(r.featured_image_url) : null,
        isSponsored: Boolean(r.is_sponsored),
        verificationStatus: String(r.verification_status),
        sourceRatingValue: r.source_rating_value ? Number(r.source_rating_value) : null,
        sourceRatingCount: r.source_rating_count ? Number(r.source_rating_count) : null,
      }));
    } catch {}
  }

  return <>
    <section className="page-hero"><div className="shell">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Insurance</span></div>
      <h1>Rehab centers that accept {insurer.name}</h1>
      <p>{insurer.description}</p>
      <div className="notice">Insurance participation changes frequently. Always verify in-network status, authorization requirements, and your expected out-of-pocket cost with both the provider and {insurer.name} before committing.</div>
    </div></section>
    <section className="section"><div className="shell">
      {providers.length ? <>
        <h2>{providers.length} listings accepting {insurer.name}</h2>
        <div className="provider-list">{providers.map((p) => <ProviderCard key={p.id} provider={p} />)}</div>
      </> : <div className="empty-state"><h2>No listings found</h2><p>We have not yet tagged providers accepting {insurer.name}. <Link href="/directory">Browse all listings</Link>.</p></div>}
    </div></section>
  </>;
}
