"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TAKAFUL_COMPARISON, getTakafulProviders, getConventionalProviders } from "@/lib/insurance";

type ViewMode = "comparison" | "table";

export default function TakafulPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("comparison");
  const takafulProviders = getTakafulProviders();
  const conventionalProviders = getConventionalProviders();

  return (
    <>
      <header className="dashboard-header">
        <div className="ins-breadcrumb">
          <Link href="/dashboard/insurance" className="ins-breadcrumb-link">Insurance</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <span className="ins-breadcrumb-current">Takaful vs Conventional</span>
        </div>
        <h1 className="dashboard-greeting">Takaful vs Conventional Insurance</h1>
        <p className="dashboard-date">Understanding Shariah-compliant insurance in Pakistan</p>
      </header>

      {/* Intro */}
      <section className="ins-takaful-intro">
        <div className="ins-takaful-intro-card ins-takaful-intro-conv">
          <h3 className="ins-takaful-intro-title">Conventional Insurance</h3>
          <p className="ins-takaful-intro-text">
            A contract where the insured pays a premium to the insurer, transferring the financial risk.
            The insurer profits from the pooled premiums and bears the risk.
            Investments may include interest-bearing assets.
          </p>
          <span className="ins-takaful-intro-count">{conventionalProviders.length} providers in Pakistan</span>
        </div>
        <div className="ins-takaful-intro-vs">VS</div>
        <div className="ins-takaful-intro-card ins-takaful-intro-tak">
          <h3 className="ins-takaful-intro-title">Takaful (Islamic Insurance)</h3>
          <p className="ins-takaful-intro-text">
            A cooperative system where participants pool contributions into a common fund.
            The Takaful operator manages the fund as a Wakeel (agent).
            All investments must be Shariah-compliant — no Riba, Maysir, or Gharar.
          </p>
          <span className="ins-takaful-intro-count">{takafulProviders.length} providers in Pakistan</span>
        </div>
      </section>

      {/* View toggle */}
      <div className="ins-view-toggle">
        <button
          className={`ins-view-btn ${viewMode === "comparison" ? "ins-view-btn-active" : ""}`}
          onClick={() => setViewMode("comparison")}
        >
          Card View
        </button>
        <button
          className={`ins-view-btn ${viewMode === "table" ? "ins-view-btn-active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          Table View
        </button>
      </div>

      {/* Comparison content */}
      {viewMode === "comparison" ? (
        <div className="ins-comparison-cards">
          {TAKAFUL_COMPARISON.map((point, i) => (
            <div key={i} className="ins-comparison-card">
              <h3 className="ins-comparison-aspect">{point.aspect}</h3>
              <div className="ins-comparison-cols">
                <div className="ins-comparison-col ins-comparison-col-conv">
                  <span className="ins-comparison-col-label">Conventional</span>
                  <p className="ins-comparison-col-text">{point.conventional}</p>
                </div>
                <div className="ins-comparison-col ins-comparison-col-tak">
                  <span className="ins-comparison-col-label">Takaful</span>
                  <p className="ins-comparison-col-text">{point.takaful}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ins-comparison-table-wrap">
          <table className="ins-comparison-table">
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Conventional</th>
                <th>Takaful</th>
              </tr>
            </thead>
            <tbody>
              {TAKAFUL_COMPARISON.map((point, i) => (
                <tr key={i}>
                  <td className="ins-table-aspect">{point.aspect}</td>
                  <td>{point.conventional}</td>
                  <td>{point.takaful}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Key Terminology */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">Key Islamic Finance Terms</h2>
        </div>
        <div className="ins-terms-grid">
          <div className="ins-term-card">
            <h4 className="ins-term-name">Riba (Interest)</h4>
            <p className="ins-term-desc">Prohibited in Islam. Any guaranteed increase on a loan or debt. Takaful investments avoid interest-bearing instruments.</p>
          </div>
          <div className="ins-term-card">
            <h4 className="ins-term-name">Gharar (Uncertainty)</h4>
            <p className="ins-term-desc">Excessive uncertainty or ambiguity in contract terms. Takaful contracts aim to minimize Gharar through transparent risk-sharing.</p>
          </div>
          <div className="ins-term-card">
            <h4 className="ins-term-name">Maysir (Gambling)</h4>
            <p className="ins-term-desc">Earning money through chance. Takaful differs from conventional by using mutual cooperation instead of speculation.</p>
          </div>
          <div className="ins-term-card">
            <h4 className="ins-term-name">Ta&apos;awun (Mutual Help)</h4>
            <p className="ins-term-desc">The core principle of Takaful — participants help each other by pooling resources for collective benefit.</p>
          </div>
          <div className="ins-term-card">
            <h4 className="ins-term-name">Wakeel (Agent)</h4>
            <p className="ins-term-desc">The Takaful operator acts as an agent (Wakeel) managing the fund on behalf of participants, charging a fee (Wakala model).</p>
          </div>
          <div className="ins-term-card">
            <h4 className="ins-term-name">Surplus</h4>
            <p className="ins-term-desc">After claims and expenses, any remaining amount in the Takaful fund may be distributed back to participants or donated to charity.</p>
          </div>
        </div>
      </section>

      {/* Takaful Providers */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">Takaful Providers in Pakistan</h2>
        </div>
        <div className="ins-providers-grid">
          {takafulProviders.slice(0, 4).map((provider) => (
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
                    {provider.type === "takaful" ? "Dedicated Takaful" : "Conv + Takaful"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="ins-disclaimer">
        This comparison is for educational purposes only. For specific Shariah rulings, consult a qualified Islamic scholar.
        Always verify a company&apos;s Takaful certification with their Shariah Advisory Board.
      </div>
    </>
  );
}
