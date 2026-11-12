"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LocateFixed, MapPin, Search, Star } from "lucide-react";
import { VerifiedTick } from "@/components/verified-tick";

type NearMeProvider = { id: string; name: string; city: string; state: string; url: string; verified: boolean; rating: number | null; reviews: number | null; distanceMiles: number | null };
type NearMeResponse = { found: boolean; mode?: "gps" | "search" | "ip" | "national"; place?: string; total?: number; moreUrl?: string; notFoundQuery?: string; providers?: NearMeProvider[] };

export function NearMeLocal({ care, label }: { care: string; label: string }) {
  const [data, setData] = useState<NearMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  const load = useCallback(async (params: Record<string, string> = {}) => {
    setLoading(true);
    try {
      const search = new URLSearchParams({ care, ...params });
      const response = await fetch(`/api/near-me?${search.toString()}`);
      setData(response.ok ? await response.json() : { found: false });
    } catch {
      setData({ found: false });
    } finally {
      setLoading(false);
    }
  }, [care]);

  useEffect(() => {
    let active = true;
    fetch(`/api/near-me?care=${encodeURIComponent(care)}`)
      .then((response) => (response.ok ? response.json() : { found: false }))
      .then((json: NearMeResponse) => { if (active) { setData(json); setLoading(false); } })
      .catch(() => { if (active) { setData({ found: false }); setLoading(false); } });
    return () => { active = false; };
  }, [care]);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) void load({ q: query.trim() });
  }

  function useMyLocation() {
    setGeoError("");
    if (!navigator.geolocation) { setGeoError("Your browser does not share location. Enter a city or ZIP code instead."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => { setLocating(false); void load({ lat: position.coords.latitude.toFixed(4), lng: position.coords.longitude.toFixed(4) }); },
      () => { setLocating(false); setGeoError("Location access was blocked. Enter a city or ZIP code instead."); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  const heading = !data?.found ? `Find ${label.toLowerCase()} near you`
    : data.mode === "national" ? `Most-reviewed ${label.toLowerCase()}`
      : `${label} near ${data.place}`;
  const subheading = !data?.found ? "Enter a city or ZIP code, or share your location."
    : data.mode === "national" ? (data.notFoundQuery ? `No listings matched "${data.notFoundQuery}". Showing the most-reviewed listings in the US instead.` : "Search a US city or ZIP code, or share your location, to see listings closest to you.")
      : data.mode === "gps" ? "Closest listings to your current location."
        : data.mode === "ip" ? "Based on your approximate location. Search below to change the area."
          : `${data.total?.toLocaleString("en-US")} listings found.`;

  return <div className="near-me-local">
    <form className="near-me-controls" onSubmit={onSearch}>
      <label className="near-me-search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City, state, or ZIP code" aria-label="City, state, or ZIP code" /></label>
      <button className="button" type="submit" disabled={!query.trim() || loading}>Search</button>
      <button className="button button-secondary" type="button" onClick={useMyLocation} disabled={locating}><LocateFixed size={17} /> {locating ? "Locating…" : "Use my location"}</button>
    </form>
    {geoError ? <p className="near-me-note">{geoError}</p> : null}

    <div className="results-heading"><div><h2>{heading}</h2><p>{loading ? "Loading listings…" : subheading}</p></div>{data?.found && data.moreUrl && !loading ? <Link className="text-link" href={data.moreUrl}>See all</Link> : null}</div>
    {data?.found && data.providers?.length ? <div className={`provider-location-grid${loading ? " is-loading" : ""}`}>
      {data.providers.map((provider) => <Link className="provider-location-link" href={provider.url} key={provider.id}>
        {provider.verified ? <VerifiedTick size={18} /> : <MapPin size={18} />}
        <span><strong>{provider.name}</strong><small>{provider.city}, {provider.state}{provider.distanceMiles !== null ? ` · ${provider.distanceMiles} mi` : ""}{provider.rating && provider.reviews ? <> · <Star size={12} /> {provider.rating.toFixed(1)} ({provider.reviews})</> : null}</small></span>
      </Link>)}
    </div> : null}
  </div>;
}
