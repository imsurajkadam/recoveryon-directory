"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

interface CompareProvider {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string | null;
  website: string | null;
  priceRange: string | null;
  insurance: string[];
  verificationStatus: string;
  accreditation: string[];
  avgRating: number | null;
  reviewCount: number;
}

const verificationLabels: Record<string, string> = {
  listed: "Directory listing",
  "data-verified": "Data verified",
  "provider-confirmed": "Provider confirmed",
  "independently-reviewed": "Independently reviewed",
};

export function CompareTool() {
  const [providers, setProviders] = useState<CompareProvider[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim() || providers.length >= 3) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/providers/search?q=${encodeURIComponent(search)}&limit=6`);
      const data = await res.json();
      setResults(data.providers || []);
    } catch { setResults([]); }
    setSearching(false);
  }

  async function addProvider(id: string) {
    if (providers.length >= 3 || providers.some((p) => p.id === id)) return;
    try {
      const res = await fetch(`/api/providers/${id}/compare`);
      const data = await res.json();
      if (data.provider) {
        setProviders([...providers, data.provider]);
        setResults([]);
        setSearch("");
      }
    } catch {}
  }

  function removeProvider(id: string) {
    setProviders(providers.filter((p) => p.id !== id));
  }

  const rows: Array<{ label: string; get: (p: CompareProvider) => React.ReactNode }> = [
    { label: "Location", get: (p) => `${p.city}, ${p.state}` },
    { label: "Verification", get: (p) => verificationLabels[p.verificationStatus] || p.verificationStatus },
    { label: "Estimated cost", get: (p) => p.priceRange || "Not listed" },
    { label: "Rating", get: (p) => p.avgRating ? `${p.avgRating.toFixed(1)} (${p.reviewCount} reviews)` : "No reviews yet" },
    { label: "Insurance", get: (p) => p.insurance.length ? p.insurance.slice(0, 5).join(", ") : "Not listed" },
    { label: "Accreditation", get: (p) => p.accreditation.length ? p.accreditation.join(", ") : "Not listed" },
    { label: "Phone", get: (p) => p.phone || "Not listed" },
    { label: "Website", get: (p) => p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer nofollow">Visit</a> : "Not listed" },
  ];

  return <div className="compare-tool">
    {providers.length < 3 && <form onSubmit={doSearch} className="compare-search">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for a treatment center to compare" />
      <button type="submit" className="button" disabled={searching}>{searching ? "..." : "Search"}</button>
    </form>}
    {results.length > 0 && <ul className="compare-results">
      {results.map((r: any) => <li key={r.id}><button onClick={() => addProvider(r.id)}><Plus size={14} /> {r.name} ({r.city}, {r.state})</button></li>)}
    </ul>}
    {providers.length === 0 && <p className="empty-state">Search above to add up to 3 centers for comparison.</p>}
    {providers.length > 0 && <div className="compare-table-wrap"><table className="compare-table">
      <thead><tr><th></th>{providers.map((p) => <th key={p.id}>{p.name}<button className="compare-remove" onClick={() => removeProvider(p.id)} aria-label={`Remove ${p.name}`}><X size={14} /></button></th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.label}><th>{row.label}</th>{providers.map((p) => <td key={p.id}>{row.get(p)}</td>)}</tr>)}</tbody>
    </table></div>}
    <p className="form-disclaimer">TreatmentLane does not recommend or guarantee any provider. Verify all details directly.</p>
  </div>;
}
