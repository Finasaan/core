/**
 * Watchlist feature types
 * Matches the spine API response shapes from /api/watchlist endpoints.
 */

// ---- Price data shapes (from enriched GET response) ----

export interface StockPriceData {
  close_price: number;
  open_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  change: number;
  change_pct: number;
}

export interface FundNavData {
  nav_price: number;
  nav_date: string;
  change: number;
  change_pct: number;
}

// ---- Watchlist item variants ----

export interface WatchlistStockItem {
  id: string;
  type: "stock";
  asset_id: string;
  notes: string | null;
  added_at: string;
  symbol: string | null;
  name: string | null;
  sector_id: string | null;
  price_data: StockPriceData | null;
}

export interface WatchlistFundItem {
  id: string;
  type: "fund";
  asset_id: string;
  notes: string | null;
  added_at: string;
  symbol: string | null;
  name: string | null;
  ytd: number | null;
  risk_profile: string | null;
  is_shariah_compliant: boolean | null;
  nav_data: FundNavData | null;
}

export type WatchlistItem = WatchlistStockItem | WatchlistFundItem;

// ---- Check response ----

export interface WatchlistCheckResult {
  in_watchlist: boolean;
  watchlist_id: string | null;
}

// ---- Add request ----

export interface AddToWatchlistRequest {
  company_id?: string;
  mutual_fund_id?: string;
  notes?: string;
}
