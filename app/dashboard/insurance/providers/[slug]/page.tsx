"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProviderBySlug, getCategoryInfo } from "@/lib/insurance";

export default function ProviderDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    return (
      <>
        <header className="dashboard-header">
          <h1 className="dashboard-greeting">Provider Not Found</h1>
        </header>
        <div className="ins-empty">
          <p>The provider you are looking for does not exist.</p>
          <Link href="/dashboard/insurance/providers" className="ins-back-link">Back to Providers</Link>
        </div>
      </>
    );
  }

  const typeLabel =
    provider.type === "both"
      ? "Conventional + Takaful"
      : provider.type === "takaful"
      ? "Takaful"
      : "Conventional";

  const segmentLabel = provider.segment === "non-life" ? "General / Non-Life" : "Life Insurance";

  return (
    <>
      <header className="dashboard-header">
        <div className="ins-breadcrumb">
          <Link href="/dashboard/insurance" className="ins-breadcrumb-link">Insurance</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <Link href="/dashboard/insurance/providers" className="ins-breadcrumb-link">Providers</Link>
          <span className="ins-breadcrumb-sep">/</span>
          <span className="ins-breadcrumb-current">{provider.shortName}</span>
        </div>
        <div className="ins-provider-detail-header">
          <div className="ins-provider-avatar ins-provider-avatar-lg">{provider.logoPlaceholder}</div>
          <div>
            <h1 className="dashboard-greeting">{provider.name}</h1>
            <p className="dashboard-date">{provider.description}</p>
          </div>
        </div>
      </header>

      {/* Info Cards */}
      <div className="ins-detail-info-row">
        <div className="ins-detail-info-card">
          <span className="ins-detail-info-label">Type</span>
          <span className="ins-detail-info-value">{typeLabel}</span>
        </div>
        <div className="ins-detail-info-card">
          <span className="ins-detail-info-label">Segment</span>
          <span className="ins-detail-info-value">{segmentLabel}</span>
        </div>
        <div className="ins-detail-info-card">
          <span className="ins-detail-info-label">Products</span>
          <span className="ins-detail-info-value">{provider.productCount}</span>
        </div>
        {provider.established && (
          <div className="ins-detail-info-card">
            <span className="ins-detail-info-label">Established</span>
            <span className="ins-detail-info-value">{provider.established}</span>
          </div>
        )}
        {provider.rating && (
          <div className="ins-detail-info-card">
            <span className="ins-detail-info-label">Rating</span>
            <span className="ins-detail-info-value">{provider.rating}</span>
          </div>
        )}
        <div className="ins-detail-info-card">
          <span className="ins-detail-info-label">Website</span>
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ins-detail-info-link"
          >
            Visit
          </a>
        </div>
      </div>

      {/* Products */}
      <section className="ins-section">
        <div className="ins-section-header">
          <h2 className="ins-section-title">Products ({provider.products.length})</h2>
        </div>
        <div className="ins-product-list">
          {provider.products.map((product) => {
            const catInfo = getCategoryInfo(product.category);
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
                </div>
                <h3 className="ins-product-name">{product.name}</h3>
                <p className="ins-product-desc">{product.description}</p>
                <div className="ins-product-highlights">
                  {product.coverageHighlights.slice(0, 3).map((h, i) => (
                    <span key={i} className="ins-product-highlight">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#159F63" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      {h}
                    </span>
                  ))}
                  {product.coverageHighlights.length > 3 && (
                    <span className="ins-product-more">+{product.coverageHighlights.length - 3} more</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
