"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { VerifiedTick } from "@/components/verified-tick";

type NearMeProvider = { id: string; name: string; city: string; state: string; url: string; verified: boolean; rating: number | null; reviews: number | null };
type NearMeResponse = { found: boolean; place?: string; total?: number; moreUrl?: string; providers?: NearMeProvider[] };

export function NearMeLocal({ care, label }: { care: string; label: string }) {
  const [data, setData] = useState<NearMeResponse | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/near-me?care=${encodeURIComponent(care)}`)
      .then((response) => (response.ok ? response.json() : { found: false }))
      .then((json: NearMeResponse) => { if (active) setData(json); })
      .catch(() => { if (active) setData({ found: false }); });
    return () => { active = false; };
  }, [care]);

  if (!data) return <div className="near-me-local is-loading"><p>Finding {label.toLowerCase()} near you…</p></div>;
  if (!data.found || !data.providers?.length) return <div className="near-me-local"><p>We could not detect your area. Choose a city below, or <Link href="/directory">search the directory</Link> by city or ZIP code.</p></div>;

  return <div className="near-me-local">
    <div className="results-heading"><div><h2>{label} near {data.place}</h2><p>Based on your approximate location. {data.total?.toLocaleString("en-US")} listings found.</p></div>{data.moreUrl ? <Link className="button button-secondary" href={data.moreUrl}>See all near {data.place}</Link> : null}</div>
    <div className="provider-location-grid">
      {data.providers.map((provider) => <Link className="provider-location-link" href={provider.url} key={provider.id}>
        {provider.verified ? <VerifiedTick size={18} /> : <MapPin size={18} />}
        <span><strong>{provider.name}</strong><small>{provider.city}, {provider.state}{provider.rating && provider.reviews ? <> · <Star size={12} /> {provider.rating.toFixed(1)} ({provider.reviews})</> : null}</small></span>
      </Link>)}
    </div>
  </div>;
}
