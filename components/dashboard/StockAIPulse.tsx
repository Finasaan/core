"use client";

import { useState, useEffect } from "react";

interface DocumentInsights {
  insights: string[];
  keyFigures: Array<{ label: string; value: string; period: string | null }>;
  trendNarrative: string | null;
  sources: Array<{ filename: string; period: string | null }>;
}

interface StockAIPulseProps {
  symbol: string;
  /**
   * Optional insights extracted from ingested company reports.
   * When present, an extra section is appended to the pulse card.
   * Pass `null` while loading so the section is skipped silently.
   */
  documentInsights?: DocumentInsights | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export function StockAIPulse({ symbol, documentInsights }: StockAIPulseProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Summary and News in parallel
        const [summaryRes, newsRes] = await Promise.all([
          fetch(`${API_URL}/api/psx/companies/symbol/${symbol}/ai-summary`),
          fetch(`${API_URL}/api/news?ticker=${symbol}&limit=3`)
        ]);

        const summaryResult = await summaryRes.json() as { success: boolean; data?: { summary: string } };
        const newsResult = await newsRes.json() as { success: boolean; data?: any[] };

        if (summaryResult.success && summaryResult.data) {
          setSummary(summaryResult.data.summary);
        } else {
          setError(true);
        }

        if (newsResult.success && newsResult.data) {
          setNews(newsResult.data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  // If everything's empty, show error
  if (!summary && news.length === 0 && (!documentInsights || documentInsights.insights.length === 0)) {
    return (
      <div className="stock-ai-pulse error">
        <div className="pulse-header">
          <span className="pulse-icon">✨</span>
          <h3>Finasaan AI Pulse</h3>
        </div>
        <p className="pulse-error-text">Insights temporarily unavailable for {symbol}.</p>
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
        {summary && (
          <div className="pulse-bullets">
            {summary.split("\n").filter(line => line.trim()).map((bullet, idx) => (
              <div key={idx} className="pulse-bullet-item">
                <span className="bullet-dot" />
                <p>{bullet.startsWith("- ") ? bullet.substring(2) : bullet}</p>
              </div>
            ))}
          </div>
        )}

        {documentInsights && documentInsights.insights.length > 0 && (
          <div className="pulse-news-section mt-6 pt-5 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              From the latest filed report
            </h4>
            <div className="pulse-bullets">
              {documentInsights.insights.map((bullet, idx) => (
                <div key={idx} className="pulse-bullet-item">
                  <span className="bullet-dot" />
                  <p>{bullet}</p>
                </div>
              ))}
            </div>
            {documentInsights.sources.length > 0 && (
              <p className="text-[10px] text-slate-400 font-medium mt-2">
                Source{documentInsights.sources.length > 1 ? "s" : ""}:{" "}
                {documentInsights.sources
                  .map((s) => (s.period ? `${s.filename} (${s.period})` : s.filename))
                  .join(" · ")}
              </p>
            )}
          </div>
        )}

        {news.length > 0 && (
          <div className="pulse-news-section mt-6 pt-5 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Market Context
            </h4>
            <div className="flex flex-col gap-3">
              {news.map((item) => (
                <a
                  key={item.id}
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col"
                >
                  <p className="text-[13px] font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.source_name} · {new Date(item.published_at).toLocaleDateString()}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="pulse-footer">
        <p className="pulse-disclaimer">AI-generated for information only.</p>
      </div>
    </div>
  );
}
