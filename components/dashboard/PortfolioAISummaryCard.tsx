"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface PortfolioSummary {
  summary: string;
  tickers: string[];
  generated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export function PortfolioAISummaryCard() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchSummary(force = false) {
    try {
      const url = force
        ? `${API_URL}/api/portfolio/ai-summary?refresh=true`
        : `${API_URL}/api/portfolio/ai-summary`;
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const json = await res.json() as { success: boolean; data: PortfolioSummary };
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch AI summary:", err);
    }
  }

  useEffect(() => {
    fetchSummary().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-violet-100 bg-violet-50/30 p-5 mb-6 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-4 rounded-full bg-violet-200" />
          <div className="h-4 w-32 rounded bg-violet-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-violet-100" />
          <div className="h-3 w-4/5 rounded bg-violet-100" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="relative group rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 mb-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-violet-100">
            <Sparkles className="h-4 w-4 text-violet-600" />
          </div>
          <span className="text-sm font-semibold text-violet-900 tracking-tight">AI Portfolio Summary</span>
        </div>
        <button
          onClick={async () => {
            setRefreshing(true);
            await fetchSummary(true);
            setRefreshing(false);
          }}
          className="p-1.5 rounded-full hover:bg-violet-100 text-violet-400 hover:text-violet-600 transition-colors"
          title="Regenerate summary"
          disabled={refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      
      <p className="text-sm text-slate-700 leading-relaxed font-medium">
        {data.summary}
      </p>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-violet-100/60">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          Updated {new Date(data.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        {data.tickers.length > 0 && (
          <div className="flex gap-1.5">
            {data.tickers.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-white border border-violet-100 text-[10px] text-violet-600 font-bold shadow-sm">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Subtle accent glow */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2 h-16 w-16 bg-violet-400/5 blur-2xl rounded-full pointer-events-none" />
    </div>
  );
}
