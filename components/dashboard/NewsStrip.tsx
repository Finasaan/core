"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  ai_summary: string;
  sentiment: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

const SENTIMENT_COLOR: Record<string, string> = {
  positive: "#159F63",
  negative: "#DC2626",
  neutral:  "#94A3B8",
};

export function NewsStrip() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/news?limit=10`)
      .then((r) => r.json() as Promise<{ success: boolean; data?: NewsArticle[] }>)
      .then((d) => { if (d.success && d.data) setArticles(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-7">
        <div className="news-strip-header">
          <span className="news-strip-label">Market News</span>
        </div>
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] w-[280px] flex-shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!articles.length) return null;

  return (
    <div className="mb-7">
      <div className="news-strip-header">
        <span className="news-strip-label">Market News</span>
        <span className="news-strip-count">{articles.length} articles</span>
      </div>

      <div className="overflow-hidden">
        <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {articles.map((a) => {
              const dot  = SENTIMENT_COLOR[a.sentiment] ?? SENTIMENT_COLOR.neutral;
              const date = new Date(a.published_at).toLocaleDateString("en-PK", {
                month: "short",
                day:   "numeric",
              });

              return (
                <CarouselItem key={a.id} className="pl-4 basis-[280px]">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-card"
                  >
                    <div className="news-card-meta">
                      <span className="news-card-dot" style={{ background: dot }} />
                      <span className="news-card-source">{a.source}</span>
                      <span className="news-card-date">{date}</span>
                    </div>
                    <p className="news-card-title">{a.title}</p>
                    {a.ai_summary && (
                      <p className="news-card-summary">{a.ai_summary}</p>
                    )}
                  </a>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
