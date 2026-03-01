"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, getAllProducts, getProviderBySlug, getCategoryInfo } from "@/lib/insurance";
import type { PolicyCategory } from "@/lib/insurance";

export default function PoliciesPage() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as PolicyCategory) || "all";
  const [activeCategory, setActiveCategory] = useState<PolicyCategory | "all">(initialCategory);
  const [search, setSearch] = useState("");
  const [takafulOnly, setTakafulOnly] = useState(false);
  const [individualOnly, setIndividualOnly] = useState(false);

  const allProducts = useMemo(() => getAllProducts(), []);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesTakaful = !takafulOnly || p.isTakaful;
      const matchesIndividual = !individualOnly || p.isIndividual;
      return matchesCategory && matchesSearch && matchesTakaful && matchesIndividual;
    });
  }, [allProducts, activeCategory, search, takafulOnly, individualOnly]);

  return (
    <>
      <header className="dashboard-header">
        <div className="ins-breadcrumb">
          <Link href="/dashboard/insurance" className="ins-breadcrumb-link">Insurance</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <span className="ins-breadcrumb-current">Policies</span>
        </div>
        <h1 className="dashboard-greeting">Browse Policies</h1>
        <p className="dashboard-date">{allProducts.length} insurance products from {CATEGORIES.length} categories</p>
      </header>

      {/* Filters */}
      <div className="ins-filter-bar">
        <div className="ins-search-box">
          <svg className="ins-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            className="ins-search-input"
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ins-filter-chips">
          <button
            className={`ins-chip ${!takafulOnly && !individualOnly ? "" : ""}`}
            onClick={() => setTakafulOnly(!takafulOnly)}
          >
            <span className={`ins-chip-toggle ${takafulOnly ? "ins-chip-toggle-on" : ""}`} />
            Takaful Only
          </button>
          <button
            className={`ins-chip`}
            onClick={() => setIndividualOnly(!individualOnly)}
          >
            <span className={`ins-chip-toggle ${individualOnly ? "ins-chip-toggle-on" : ""}`} />
            Individual Only
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="ins-category-tabs">
        <button
          className={`ins-category-tab ${activeCategory === "all" ? "ins-category-tab-active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`ins-category-tab ${activeCategory === cat.key ? "ins-category-tab-active" : ""}`}
            onClick={() => setActiveCategory(cat.key)}
            style={activeCategory === cat.key ? { borderColor: cat.color, color: cat.color } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="ins-products-grid">
        {filtered.length === 0 && (
          <div className="ins-empty">No policies match your filters.</div>
        )}
        {filtered.map((product) => {
          const catInfo = getCategoryInfo(product.category);
          const provider = getProviderBySlug(product.providerSlug);
          return (
            <Link
              key={product.slug}
              href={`/dashboard/insurance/policies/${product.slug}`}
              className="ins-product-card"
            >
              <div className="ins-product-card-top">
                <div className="ins-category-dot" style={{ background: catInfo.color }} />
                <span className="ins-product-category">{catInfo.label}</span>
                {product.isTakaful && <span className="ins-takaful-tag">Takaful</span>}
                {product.isIndividual ? (
                  <span className="ins-segment-tag">Individual</span>
                ) : (
                  <span className="ins-segment-tag ins-segment-corp">Corporate</span>
                )}
              </div>
              <h3 className="ins-product-name">{product.name}</h3>
              {provider && (
                <span className="ins-product-provider">by {provider.shortName}</span>
              )}
              <p className="ins-product-desc">{product.description}</p>
              <div className="ins-product-highlights">
                {product.coverageHighlights.slice(0, 3).map((h, i) => (
                  <span key={i} className="ins-product-highlight">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#159F63" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    {h}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
