/**
 * Stock / PSX feature types
 * Matches the spine API response shapes from /api/psx endpoints.
 */

// ---- Company ----

export interface Company {
  id: string;
  symbol: string;
  company_name: string;
  description?: string;
  sector_id?: string;
  website_url?: string;
  logo_url?: string;
  founded_year?: number;
  ceo_name?: string;
  is_etf?: boolean;
  is_debt?: boolean;
}

// ---- Daily OHLCV data ----

export interface StockDayData {
  id: string;
  company_id: string;
  trade_date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  adjusted_close_price?: number;
  volume: number;
  value_traded: number;
}

// ---- Chart data point (after transform) ----

export interface StockChartPoint {
  date: string;
  displayDate: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

// ---- Time range for charts ----

export type StockTimeRange = "30D" | "90D" | "1Y" | "5Y" | "MAX";

export interface TimeRangeOption {
  key: StockTimeRange;
  label: string;
  limit: number;
}

export const STOCK_TIME_RANGES: TimeRangeOption[] = [
  { key: "30D", label: "30D", limit: 30 },
  { key: "90D", label: "90D", limit: 90 },
  { key: "1Y", label: "1Y", limit: 260 },
  { key: "5Y", label: "5Y", limit: 1300 },
  { key: "MAX", label: "MAX", limit: 10000 },
];
