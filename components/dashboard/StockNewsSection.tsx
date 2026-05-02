"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  published_at: string;
  source_url: string;
  source_name: string;
}

const SENTIMENT_COLOR: Record<string, string> = {
  positive: "text-emerald-600",
  negative: "text-red-600",
  neutral: "text-slate-500",
};

const SENTIMENT_DOT: Record<string, string> = {
  positive: "bg-emerald-400",
  negative: "bg-red-400",
  neutral: "bg-zinc-500",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export function StockNewsSection({ ticker }: { ticker: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `${API_URL}/api/news?ticker=${encodeURIComponent(ticker)}&limit=5`
        );
        const data = await res.json();
        setNews(data.news ?? []);
      } catch {
        // silently fail — news is supplementary
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [ticker]);

  if (loading) {
    return (
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="h-4 w-32 rounded bg-zinc-100 animate-pulse mb-5" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 rounded bg-zinc-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-full rounded bg-zinc-100" />
                <div className="h-3 w-2/3 rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news.length) return null;

  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
        Recent News
      </h3>
      <div className="flex flex-col gap-1">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-xl p-3 -mx-2 hover:bg-zinc-50 transition-all duration-200"
          >
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full shadow-sm ${SENTIMENT_DOT[item.sentiment]}`} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-800 group-hover:text-violet-600 transition-colors line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">
                  {item.source_name}
                </span>
                <span className="text-[11px] text-zinc-300">•</span>
                <span className="text-[11px] text-zinc-400">
                  {formatDistanceToNow(new Date(item.published_at), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-[11px] text-zinc-300">•</span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${SENTIMENT_COLOR[item.sentiment]}`}>
                  {item.sentiment}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
