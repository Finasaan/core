"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES, PROVIDERS, INSURANCE_STATS, getAllProducts } from "@/lib/insurance";

export default function InsuranceOverviewPage() {
  const topCategories = CATEGORIES.slice(0, 6);
  const totalProducts = getAllProducts().length;

  return (
    <>
      <header className="dashboard-header">
        <h1 className="dashboard-greeting">Insurance</h1>
        <p className="dashboard-date">Learn about insurance in Pakistan</p>
      </header>

      {/* Stats Row */}
      <div className="ins-stats-row">
        <div className="ins-stat-card">
          <span className="ins-stat-value">{INSURANCE_STATS.totalCompanies}</span>
          <span className="ins-stat-label">SECP-Registered Companies</span>
        </div>
        <div className="ins-stat-card">
          <span className="ins-stat-value">{INSURANCE_STATS.activeCompanies}</span>
          <span className="ins-stat-label">Active Insurers</span>
        </div>
        <div className="ins-stat-card">
          <span className="ins-stat-value">{INSURANCE_STATS.takafulOperators}</span>
          <span className="ins-stat-label">Takaful Operators</span>
        </div>
        <div className="ins-stat-card">
          <span className="ins-stat-value">{totalProducts}</span>
          <span className="ins-stat-label">Products Documented</span>
        </div>
      </div>

      {/* Quick Links */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">Explore</h2>
        </div>
        <div className="ins-quick-links">
          <Link href="/dashboard/insurance/providers" className="ins-quick-link-card">
            <div className="ins-quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 18.86h-.76c-.8 0-1.56.31-2.12.87l-1.71 1.69c-.78.77-2.05.77-2.83 0l-1.71-1.69c-.56-.56-1.33-.87-2.12-.87H6c-1.66 0-3-1.33-3-2.97V4.98c0-1.64 1.34-2.97 3-2.97h12c1.66 0 3 1.33 3 2.97v10.91c0 1.63-1.34 2.97-3 2.97z"/><path d="M12 10a2.33 2.33 0 100-4.66A2.33 2.33 0 0012 10zM16 15.66c0-1.8-1.79-3.26-4-3.26s-4 1.46-4 3.26"/></svg>
            </div>
            <div>
              <h3 className="ins-quick-title">Provider Directory</h3>
              <p className="ins-quick-desc">{PROVIDERS.length} insurance companies profiled</p>
            </div>
          </Link>

          <Link href="/dashboard/insurance/policies" className="ins-quick-link-card">
            <div className="ins-quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"/><path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"/></svg>
            </div>
            <div>
              <h3 className="ins-quick-title">Browse Policies</h3>
              <p className="ins-quick-desc">{totalProducts} products across {CATEGORIES.length} categories</p>
            </div>
          </Link>

          <Link href="/dashboard/insurance/takaful" className="ins-quick-link-card">
            <div className="ins-quick-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8M12 8v8"/></svg>
            </div>
            <div>
              <h3 className="ins-quick-title">Takaful vs Conventional</h3>
              <p className="ins-quick-desc">Understand Islamic insurance</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">Categories</h2>
          <Link href="/dashboard/insurance/policies" className="ins-see-all">See all</Link>
        </div>
        <div className="ins-categories-grid">
          {topCategories.map((cat) => (
            <Link
              key={cat.key}
              href={`/dashboard/insurance/policies?category=${cat.key}`}
              className="ins-category-card"
            >
              <div className="ins-category-dot" style={{ background: cat.color }} />
              <div>
                <h3 className="ins-category-name">{cat.label}</h3>
                <p className="ins-category-desc">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Providers */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">Featured Providers</h2>
          <Link href="/dashboard/insurance/providers" className="ins-see-all">See all</Link>
        </div>
        <div className="ins-providers-grid">
          {PROVIDERS.slice(0, 4).map((provider) => (
            <Link
              key={provider.slug}
              href={`/dashboard/insurance/providers/${provider.slug}`}
              className="ins-provider-card"
            >
              <div className="ins-provider-avatar">{provider.logoPlaceholder}</div>
              <div className="ins-provider-info">
                <h3 className="ins-provider-name">{provider.shortName}</h3>
                <p className="ins-provider-desc">{provider.description}</p>
                <div className="ins-provider-meta">
                  <span className="ins-provider-badge" data-type={provider.type}>
                    {provider.type === "both" ? "Conventional + Takaful" : provider.type === "takaful" ? "Takaful" : "Conventional"}
                  </span>
                  <span className="ins-provider-count">{provider.productCount} products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning callout */}
      <section className="ins-callout">
        <div className="ins-callout-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/><path d="M12 8v5M12 16h.01"/></svg>
        </div>
        <div>
          <h3 className="ins-callout-title">Did you know?</h3>
          <p className="ins-callout-text">
            Pakistan has {INSURANCE_STATS.totalCompanies} SECP-registered insurance companies, including {INSURANCE_STATS.takafulOperators} dedicated Takaful operators.
            Insurance penetration in Pakistan is among the lowest in Asia at less than 1% of GDP, meaning most Pakistanis are uninsured.
            Understanding your options is the first step to financial protection.
          </p>
        </div>
      </section>
    </>
  );
}
