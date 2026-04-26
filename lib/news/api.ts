const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const BASE = "/api/news";

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
  });
  const result = await response.json() as { success: boolean; data?: T; error?: string; pagination?: any };
  if (!result.success) {
    throw new Error(result.error || "Request failed");
  }
  return result as T;
}

import type { NewsListResponse, EconomicNews, NewsFilters } from "./types";

export const newsApi = {
  getNews: async (
    filters: NewsFilters & { limit?: number; offset?: number } = {}
  ): Promise<NewsListResponse> => {
    const params = new URLSearchParams();
    if (filters.limit)     params.set("limit",     String(filters.limit));
    if (filters.offset)    params.set("offset",    String(filters.offset));
    if (filters.sentiment) params.set("sentiment", filters.sentiment);
    if (filters.sector)    params.set("sector",    filters.sector);
    if (filters.ticker)    params.set("ticker",    filters.ticker);
    const qs = params.toString();
    return apiFetch<NewsListResponse>(`${BASE}${qs ? "?" + qs : ""}`);
  },

  getNewsItem: async (id: string): Promise<EconomicNews> => {
    const result = await apiFetch<{ data: EconomicNews }>(`${BASE}/${id}`);
    return result.data;
  },
};
