/**
 * Sector feature types
 * Matches the spine API response shapes from /api/sectors endpoints.
 */

export interface Sector {
  id: string;
  name: string;
  description: string | null;
  parent_sector_id: string | null;
  company_count: number;
}

export interface SectorPerformance extends Sector {
  avg_change_pct: number | null;
  total_volume: number;
  gainers: number;
  losers: number;
  top_gainer: { symbol: string; company_name: string; change_pct: number } | null;
  top_loser: { symbol: string; company_name: string; change_pct: number } | null;
}

export interface SectorCompany {
  id: string;
  symbol: string;
  company_name: string;
  sector_id: string;
  open_price?: number;
  close_price?: number;
  high_price?: number;
  low_price?: number;
  volume?: number;
}
