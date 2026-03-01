/**
 * Stock / PSX API client
 * Public endpoints — no auth required.
 */

import type { Company, StockDayData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// ---- Companies ----

interface CompaniesParams {
  limit?: number;
  offset?: number;
  search?: string;
  withPrice?: boolean;
  sector?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: { limit: number; offset: number; total: number };
}

export async function getCompanies(params: CompaniesParams = {}): Promise<{
  data: Company[];
  total: number;
}> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.offset) qs.set("offset", String(params.offset));
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.withPrice) qs.set("withPrice", "true");
  if (params.sector?.trim()) qs.set("sector", params.sector.trim());

  const res = await fetch(`${API_URL}/api/psx/companies?${qs}`);
  const json = (await res.json()) as PaginatedResponse<Company>;

  return {
    data: json.data || [],
    total: json.pagination?.total || 0,
  };
}

export async function getCompanyBySymbol(symbol: string): Promise<Company | null> {
  const res = await fetch(`${API_URL}/api/psx/companies/symbol/${symbol}`);
  const json = (await res.json()) as { success: boolean; data?: Company };
  return json.success ? json.data ?? null : null;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const res = await fetch(`${API_URL}/api/psx/companies/${id}`);
  const json = (await res.json()) as { success: boolean; data?: Company };
  return json.success ? json.data ?? null : null;
}

// ---- Stock Data (OHLCV) ----

export async function getStockData(
  companyId: string,
  limit = 30,
  offset = 0
): Promise<{ data: StockDayData[]; total: number }> {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  const res = await fetch(
    `${API_URL}/api/psx/companies/${companyId}/stock-data?${qs}`
  );
  const json = (await res.json()) as PaginatedResponse<StockDayData>;

  return {
    data: json.data || [],
    total: json.pagination?.total || 0,
  };
}
