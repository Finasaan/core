/**
 * Portfolio feature types
 * Matches the spine API response shapes from /api/portfolio
 */

// ---- Portfolio CRUD ----

export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  holdings_count: number;
}

export interface PortfolioDetail {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  holdings: HoldingLot[];
}

export interface HoldingLot {
  id: string;
  company_id: string | null;
  mutual_fund_id: string | null;
  quantity: number;
  purchase_price: number;
  purchase_date: string | null;
  notes: string | null;
  added_at: string;
}

// ---- Portfolio Summary / Dashboard ----

export interface PortfolioSummary {
  portfolio: {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
  };
  total_value: number;
  total_cost: number;
  total_pl: number;
  total_pl_pct: number;
  daily_change: number;
  daily_change_pct: number;
  allocation: AllocationItem[];
  holdings: HoldingSummary[];
}

export interface AllocationItem {
  type: "stocks" | "mutual_funds";
  value: number;
  weight_pct: number;
}

export interface HoldingSummary {
  asset_id: string;
  type: "stock" | "fund";
  symbol: string | null;
  name: string | null;
  total_quantity: number;
  avg_cost: number;
  current_price: number;
  current_value: number;
  cost_basis: number;
  pl: number;
  pl_pct: number;
  daily_change: number;
  daily_change_pct: number;
  weight_pct: number;
  lots: HoldingLot[];
}

// ---- API request shapes ----

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
}

export interface AddHoldingRequest {
  company_id?: string;
  mutual_fund_id?: string;
  quantity: number;
  purchase_price: number;
  purchase_date?: string;
  notes?: string;
}

// ---- Search result for asset picker ----

export interface AssetSearchResult {
  id: string;
  symbol: string;
  name: string;
}
