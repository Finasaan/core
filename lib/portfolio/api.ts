import { createClient } from "@/lib/supabase/client";
import type {
  Portfolio,
  PortfolioSummary,
  CreatePortfolioRequest,
  AddHoldingRequest,
  AssetSearchResult,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

/**
 * Get the current session's access token.
 * Throws if no session is available.
 */
async function getAccessToken(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }
  return session.access_token;
}

/**
 * Authenticated fetch wrapper for portfolio API calls.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const result = await response.json() as { success: boolean; data?: T; error?: string };

  if (!result.success) {
    throw new Error(result.error || "API request failed");
  }

  return result.data as T;
}

// ---- Portfolio CRUD ----

export async function listPortfolios(): Promise<Portfolio[]> {
  return apiFetch<Portfolio[]>("/api/portfolio");
}

export async function createPortfolio(body: CreatePortfolioRequest): Promise<Portfolio> {
  return apiFetch<Portfolio>("/api/portfolio", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updatePortfolio(
  id: string,
  body: Partial<CreatePortfolioRequest>
): Promise<Portfolio> {
  return apiFetch<Portfolio>(`/api/portfolio/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deletePortfolio(id: string): Promise<void> {
  await apiFetch(`/api/portfolio/${id}`, { method: "DELETE" });
}

// ---- Portfolio Summary ----

export async function getPortfolioSummary(id: string): Promise<PortfolioSummary> {
  return apiFetch<PortfolioSummary>(`/api/portfolio/${id}/summary`);
}

// ---- Holdings ----

export async function addHolding(
  portfolioId: string,
  body: AddHoldingRequest
): Promise<void> {
  await apiFetch(`/api/portfolio/${portfolioId}/holdings`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteHolding(
  portfolioId: string,
  holdingId: string
): Promise<void> {
  await apiFetch(`/api/portfolio/${portfolioId}/holdings/${holdingId}`, {
    method: "DELETE",
  });
}

// ---- Asset search (for stock/fund picker) ----

export async function searchStocks(query: string): Promise<AssetSearchResult[]> {
  const response = await fetch(
    `${API_URL}/api/psx/companies?search=${encodeURIComponent(query)}&limit=10&withPrice=false`
  );
  const result = await response.json() as {
    success: boolean;
    data?: Array<{ id: string; symbol: string; company_name?: string }>;
  };

  if (!result.success || !result.data) return [];

  return result.data.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.company_name || c.symbol,
  }));
}

export async function searchFunds(query: string): Promise<AssetSearchResult[]> {
  const response = await fetch(
    `${API_URL}/api/mfs/funds?search=${encodeURIComponent(query)}&limit=10`
  );
  const result = await response.json() as {
    success: boolean;
    data?: Array<{ id: string; symbol: string; name: string }>;
  };

  if (!result.success || !result.data) return [];

  return result.data.map((f) => ({
    id: f.id,
    symbol: f.symbol || "",
    name: f.name,
  }));
}
