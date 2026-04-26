export interface EconomicNews {
  id: string;
  url: string;
  title: string;
  source: string;
  published_at: string;
  raw_summary: string | null;
  ai_summary: string | null;
  sentiment: "positive" | "negative" | "neutral";
  affected_sectors: string[];
  affected_tickers: string[];
  impact_analysis: string | null;
  created_at: string;
}

export type NewsSentiment = "positive" | "negative" | "neutral";

export interface NewsFilters {
  sentiment?: NewsSentiment;
  sector?: string;
  ticker?: string;
}

export interface NewsListResponse {
  data: EconomicNews[];
  pagination: {
    limit: number;
    offset: number;
    total: number | null;
  };
}
