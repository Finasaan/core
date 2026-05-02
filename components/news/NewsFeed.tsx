"use client";

import { useState, useEffect, useCallback } from "react";
import { newsApi, type EconomicNews, type NewsFilters } from "@/lib/news";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { NewsFilterBar } from "./NewsFilterBar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, RefreshCw } from "lucide-react";

export function NewsFeed() {
  const [news, setNews] = useState<EconomicNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NewsFilters>({});
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const fetchNews = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true); else setLoading(true);
      setError(null);

      const offset = isLoadMore ? (page + 1) * limit : 0;
      const response = await newsApi.getNews({ ...filters, limit, offset });

      if (isLoadMore) {
        setNews(prev => [...prev, ...response.data]);
        setPage(p => p + 1);
      } else {
        setNews(response.data);
        setPage(0);
      }
      setTotal(response.pagination.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page]);

  // Initial load or filter change
  useEffect(() => {
    fetchNews(false);
  }, [filters]);

  const hasMore = news.length < total;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Economic News</h2>
          <p className="text-sm text-muted-foreground">
            Daily market insights and economic developments analyzed by AI.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchNews(false)}
          disabled={loading}
          className="h-9"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <NewsFilterBar filters={filters} onFilterChange={setFilters} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <InfoIcon className="h-10 w-10 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium">No results found.</p>
          <p className="text-xs text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} article={item} showPopover={true} />
            ))}
            {loadingMore && Array.from({ length: 3 }).map((_, i) => (
              <NewsCardSkeleton key={`more-${i}`} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8">
              <Button 
                variant="outline" 
                onClick={() => fetchNews(true)} 
                disabled={loadingMore}
                className="w-full max-w-xs shadow-sm bg-background hover:bg-muted"
              >
                {loadingMore ? "Loading..." : "Load More Articles"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
