"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProductBySlug, getProviderBySlug, getCategoryInfo } from "@/lib/insurance";

export default function PolicyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <>
        <header className="dashboard-header">
          <h1 className="dashboard-greeting">Policy Not Found</h1>
        </header>
        <div className="ins-empty">
          <p>The policy you are looking for does not exist.</p>
          <Link href="/dashboard/insurance/policies" className="ins-back-link">Browse all policies</Link>
        </div>
      </>
    );
  }

  const provider = getProviderBySlug(product.providerSlug);
  const catInfo = getCategoryInfo(product.category);

  return (
    <>
      <header className="dashboard-header">
        <div className="ins-breadcrumb">
          <Link href="/dashboard/insurance" className="ins-breadcrumb-link">Insurance</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <Link href="/dashboard/insurance/policies" className="ins-breadcrumb-link">Policies</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <span className="ins-breadcrumb-current">{product.name}</span>
        </div>
        <div className="ins-policy-header">
          <div>
            <div className="ins-policy-tags">
              <span className="ins-policy-cat-badge" style={{ background: catInfo.color + "18", color: catInfo.color }}>
                {catInfo.label}
              </span>
              {product.isTakaful && <span className="ins-takaful-tag">Takaful</span>}
              <span className="ins-segment-tag">{product.isIndividual ? "Individual" : "Corporate"}</span>
            </div>
            <h1 className="dashboard-greeting">{product.name}</h1>
            <p className="dashboard-date">{product.description}</p>
          </div>
        </div>
      </header>

      {/* Provider card */}
      {provider && (
        <Link href={`/dashboard/insurance/providers/${provider.slug}`} className="ins-policy-provider-card">
          <div className="ins-provider-avatar">{provider.logoPlaceholder}</div>
          <div>
            <span className="ins-policy-provider-label">Offered by</span>
            <span className="ins-policy-provider-name">{provider.name}</span>
          </div>
          <svg className="ins-provider-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </Link>
      )}

      {/* Coverage section */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">What&apos;s Covered</h2>
        </div>
        <div className="ins-coverage-list">
          {product.coverageHighlights.map((item, i) => (
            <div key={i} className="ins-coverage-item">
              <div className="ins-coverage-icon ins-coverage-icon-yes">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <span className="ins-coverage-text">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusions */}
      {product.exclusions && product.exclusions.length > 0 && (
        <section className="ins-section">
          <div className="ins-section-header">
            <h2 className="ins-section-title">What&apos;s Not Covered</h2>
          </div>
          <div className="ins-coverage-list">
            {product.exclusions.map((item, i) => (
              <div key={i} className="ins-coverage-item">
                <div className="ins-coverage-icon ins-coverage-icon-no">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
                <span className="ins-coverage-text">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Features */}
      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <section className="ins-section">
          <div className="ins-section-header">
            <h2 className="ins-section-title">Key Features</h2>
          </div>
          <div className="ins-features-grid">
            {product.keyFeatures.map((f, i) => (
              <div key={i} className="ins-feature-item">{f}</div>
            ))}
          </div>
        </section>
      )}

      {/* Source link */}
      {product.sourceUrl && (
        <section className="ins-section">
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ins-source-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            View on {provider?.shortName || "provider"} website
          </a>
        </section>
      )}

      {/* Disclaimer */}
      <div className="ins-disclaimer">
        This information is for educational purposes only. Policy terms, coverage, and premiums are subject to change. Always refer to the official policy document before purchasing.
      </div>
    </>
  );
}
