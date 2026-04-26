"use client";

import { useState, useEffect } from "react";

interface StockAIPulseProps {
  symbol: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export function StockAIPulse({ symbol }: StockAIPulseProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/psx/companies/symbol/${symbol}/ai-summary`);
        const result = await res.json() as { success: boolean; data?: { summary: string } };

        if (result.success && result.data) {
          setSummary(result.data.summary);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [symbol]);

  if (loading) {
    return (
      <div className="stock-ai-pulse loading">
        <div className="pulse-header">
          <span className="pulse-icon">✨</span>
          <h3>Finasaan AI Pulse</h3>
        </div>
        <div className="pulse-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="stock-ai-pulse error">
        <div className="pulse-header">
          <span className="pulse-icon">✨</span>
          <h3>Finasaan AI Pulse</h3>
        </div>
        <p className="pulse-error-text">AI summary temporarily unavailable for {symbol}.</p>
      </div>
    );
  }

  return (
    <div className="stock-ai-pulse animate-in">
      <div className="pulse-header">
        <span className="pulse-icon">✨</span>
        <div className="pulse-header-text">
          <h3>Finasaan AI Pulse</h3>
          <span className="pulse-badge">Live Insights</span>
        </div>
      </div>
      <div className="pulse-content">
        <div className="pulse-bullets">
          {summary.split("\n").filter(line => line.trim()).map((bullet, idx) => (
            <div key={idx} className="pulse-bullet-item">
              <span className="bullet-dot" />
              <p>{bullet.startsWith("- ") ? bullet.substring(2) : bullet}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pulse-footer">
        <p className="pulse-disclaimer">AI-generated for information only.</p>
      </div>
    </div>
  );
}
