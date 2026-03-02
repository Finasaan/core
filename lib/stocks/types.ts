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

// ---- Company Financials ----

export interface ExtractedTable {
  id: string;
  company_name: string;
  company_id: string;
  table_name: string;
  table_type: string;
  fiscal_period: string | null;
  fiscal_period_end: string | null;
  currency: string;
  table_unit: string | null;
  comparative: boolean;
  headers: string[];
  rows: Record<string, string | number>[];
  source_type: string;
  created_at: string;
}

export interface FinancialReportLineItem {
  id: string;
  item_key: string;
  item_label: string;
  item_value: number;
}

export interface FinancialReport {
  id: string;
  report_type: string;
  period_type: string;
  period_end_date: string | null;
  fiscal_year: number | null;
  fiscal_quarter: number | null;
  currency: string | null;
  source_url: string | null;
  filed_date: string | null;
  financial_report_line_items: FinancialReportLineItem[];
}

export interface CompanyRatio {
  id: string;
  as_of_date: string | null;
  ratio_key: string;
  ratio_value: number;
  ratio_period: string | null;
}

export interface CompanyFinancialsData {
  company: { id: string; symbol: string; company_name: string };
  extracted_tables: ExtractedTable[];
  financial_reports: FinancialReport[];
  company_ratios: CompanyRatio[];
}
