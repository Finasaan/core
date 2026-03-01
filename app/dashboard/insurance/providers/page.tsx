"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PROVIDERS } from "@/lib/insurance";
import type { InsuranceType, ProviderSegment } from "@/lib/insurance";

type FilterType = "all" | InsuranceType;
type FilterSegment = "all" | ProviderSegment;

export default function ProvidersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [segmentFilter, setSegmentFilter] = useState<FilterSegment>("all");

  const filtered = useMemo(() => {
    return PROVIDERS.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.shortName.toLowerCase().includes(search.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        p.type === typeFilter ||
        (typeFilter === "both" && p.type === "both");
      const matchesSegment =
        segmentFilter === "all" || p.segment === segmentFilter || p.segment === "both";
      return matchesSearch && matchesType && matchesSegment;
    });
  }, [search, typeFilter, segmentFilter]);

  return (
    <>
      <header className="dashboard-header">
        <div className="ins-breadcrumb">
          <Link href="/dashboard/insurance" className="ins-breadcrumb-link">Insurance</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <span className="ins-breadcrumb-current">Providers</span>
        </div>
        <h1 className="dashboard-greeting">Provider Directory</h1>
        <p className="dashboard-date">{PROVIDERS.length} insurance companies in Pakistan</p>
      </header>

      {/* Filters */}
      <div className="ins-filter-bar">
        <div className="ins-search-box">
          <svg className="ins-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="ins-search-input"
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ins-filter-chips">
          {(["all", "conventional", "takaful", "both"] as FilterType[]).map((t) => (
            <button
              key={t}
              className={`ins-chip ${typeFilter === t ? "ins-chip-active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === "all" ? "All Types" : t === "both" ? "Conv + Takaful" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="ins-filter-chips">
          {(["all", "non-life", "life"] as FilterSegment[]).map((s) => (
            <button
              key={s}
              className={`ins-chip ${segmentFilter === s ? "ins-chip-active" : ""}`}
              onClick={() => setSegmentFilter(s)}
            >
              {s === "all" ? "All Segments" : s === "non-life" ? "Non-Life / General" : "Life / Takaful"}
            </button>
          ))}
        </div>
      </div>

      {/* Provider List */}
      <div className="ins-providers-list">
        {filtered.length === 0 && (
          <div className="ins-empty">No providers match your filters.</div>
        )}
        {filtered.map((provider) => (
          <Link
            key={provider.slug}
            href={`/dashboard/insurance/providers/${provider.slug}`}
            className="ins-provider-card ins-provider-card-full"
          >
            <div className="ins-provider-avatar">{provider.logoPlaceholder}</div>
            <div className="ins-provider-info">
              <h3 className="ins-provider-name">{provider.shortName}</h3>
              <p className="ins-provider-desc">{provider.description}</p>
              <div className="ins-provider-meta">
                <span className="ins-provider-badge" data-type={provider.type}>
                  {provider.type === "both"
                    ? "Conventional + Takaful"
                    : provider.type === "takaful"
                    ? "Takaful"
                    : "Conventional"}
                </span>
                <span className="ins-provider-badge" data-segment={provider.segment}>
                  {provider.segment === "non-life" ? "General" : "Life"}
                </span>
                <span className="ins-provider-count">{provider.productCount} products</span>
                {provider.rating && (
                  <span className="ins-provider-rating">{provider.rating}</span>
                )}
              </div>
            </div>
            <svg className="ins-provider-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        ))}
      </div>
    </>
  );
}
