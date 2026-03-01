/**
 * Sectors API client
 * Public endpoints — no auth required.
 */

import type { Sector, SectorCompany } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// ---- Sectors ----

export async function getSectors(): Promise<Sector[]> {
  const res = await fetch(`${API_URL}/api/sectors`);
  const json = (await res.json()) as { success: boolean; data?: Sector[] };
  return json.success ? json.data ?? [] : [];
}

export async function getSectorById(id: string): Promise<Sector | null> {
  const res = await fetch(`${API_URL}/api/sectors/${id}`);
  const json = (await res.json()) as { success: boolean; data?: Sector };
  return json.success ? json.data ?? null : null;
}

// ---- Sector companies ----

interface SectorCompaniesParams {
  limit?: number;
  offset?: number;
  search?: string;
  withPrice?: boolean;
}

export async function getSectorCompanies(
  sectorId: string,
  params: SectorCompaniesParams = {}
): Promise<{ data: SectorCompany[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.offset) qs.set("offset", String(params.offset));
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.withPrice) qs.set("withPrice", "true");

  const res = await fetch(`${API_URL}/api/sectors/${sectorId}/companies?${qs}`);
  const json = (await res.json()) as {
    success: boolean;
    data?: SectorCompany[];
    pagination?: { limit: number; offset: number; total: number };
  };

  return {
    data: json.data || [],
    total: json.pagination?.total || 0,
  };
}
