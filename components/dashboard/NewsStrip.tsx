"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <Carousel
        opts={{ align: "start", dragFree: true }}
        className="w-full relative group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="news-strip-header mb-0">
            <span className="news-strip-label">Market News</span>
            <span className="news-strip-count">{articles.length} articles</span>
          </div>
          <div className="flex gap-2 mr-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>

        <CarouselContent>
          {articles.map((a) => {
            const dot  = SENTIMENT_COLOR[a.sentiment] ?? SENTIMENT_COLOR.neutral;
            const date = new Date(a.published_at).toLocaleDateString("en-PK", {
              month: "short",
              day:   "numeric",
            });

            return (
              <CarouselItem key={a.id} className="basis-[85%] sm:basis-[300px] select-none cursor-grab active:cursor-grabbing">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-card h-full"
                  draggable="false"
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
          
          <CarouselItem className="basis-[85%] sm:basis-[300px]">
            <Link 
              href="/dashboard/news" 
              className="news-card h-full flex flex-col items-center justify-center gap-3 border-dashed border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group/view-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover/view-all:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <span className="font-semibold text-primary">View All News</span>
            </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>

  );
}
