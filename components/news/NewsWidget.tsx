"use client";

import { useEffect, useState } from "react";
import { newsApi, type EconomicNews } from "@/lib/news";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";

interface Props {
  ticker?: string;
  limit?: number;
  title?: string;
}

export function NewsWidget({ ticker, limit = 3, title = "Latest News" }: Props) {
  const [news, setNews] = useState<EconomicNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await newsApi.getNews({ ticker, limit });
        setNews(res.data);
      } catch (err) {
        console.error("[NewsWidget] error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticker, limit]);

  if (!loading && news.length === 0 && !ticker) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Newspaper className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
        </div>
        <Link href="/dashboard/news">
          <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2 text-muted-foreground hover:text-primary">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: limit }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))
        ) : news.length === 0 ? (
          <div className="py-8 text-center bg-muted/20 rounded-lg border border-dashed">
            <p className="text-xs text-muted-foreground">No recent news for this symbol.</p>
          </div>
        ) : (
          news.map((item) => (
            <NewsCard key={item.id} article={item} />
          ))
        )}
      </div>
    </div>
  );
}
