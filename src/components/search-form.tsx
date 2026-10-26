"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("directory_search");
    const query = new URLSearchParams();
    if (keyword.trim()) query.set("keyword", keyword.trim());
    if (location.trim()) query.set("location", location.trim());
    router.push(`/directory${query.size ? `?${query.toString()}` : ""}`);
  }

  return (
    <form className={`search-panel${compact ? " search-panel-compact" : ""}`} onSubmit={submit}>
      <label>
        <span className="sr-only">Service or provider</span>
        <Search size={20} aria-hidden="true" />
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Service, program, or provider" />
      </label>
      <label>
        <span className="sr-only">City, state, or ZIP code</span>
        <MapPin size={20} aria-hidden="true" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, state, or ZIP" />
      </label>
      <button className="button" type="submit">Search <ArrowRight size={18} /></button>
    </form>
  );
}
