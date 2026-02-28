/**
 * Market feature types
 * Matches the spine API response shape from GET /api/market/summary
 */

export interface MarketIndexData {
  index_name: string; // 'KSE100' or 'KSE30'
  trade_date: string; // 'YYYY-MM-DD'
  previous_close: number;
  current_close: number;
  net_change: number;
  change_pct: number;
  market_open_time: string | null;
  market_close_time: string | null;
}

export interface MarketSummary {
  kse100: MarketIndexData | null;
  kse30: MarketIndexData | null;
  trade_date: string;
  market_status: "open" | "closed" | "pre_market" | "post_market";
  is_stale: boolean;
}
