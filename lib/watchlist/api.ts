/**
 * Watchlist API client
 * All watchlist endpoints require authentication.
 * Auth is handled via the `sb-token` HttpOnly cookie set by spine — no manual
 * token extraction needed; credentials: "include" sends it automatically.
 */

import type {
  WatchlistItem,
  WatchlistCheckResult,
  AddToWatchlistRequest,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

/**
 * Authenticated fetch wrapper for watchlist API calls.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: string;
  };

  if (!result.success) {
    throw new Error(result.error || "API request failed");
  }

  return result.data as T;
}

// ---- Watchlist Operations ----

/**
 * Get all watchlisted items for the current user.
 * @param type - Filter by 'stock', 'fund', or 'all' (default: 'all')
 */
export async function getWatchlist(
  type: "stock" | "fund" | "all" = "all"
): Promise<WatchlistItem[]> {
  return apiFetch<WatchlistItem[]>(`/api/watchlist?type=${type}`);
}

/**
 * Add an asset to the watchlist.
 */
export async function addToWatchlist(
  body: AddToWatchlistRequest
): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/api/watchlist", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Remove an item from the watchlist by its watchlist entry ID.
 */
export async function removeFromWatchlist(
  watchlistId: string
): Promise<void> {
  await apiFetch(`/api/watchlist/${watchlistId}`, {
    method: "DELETE",
  });
}

/**
 * Remove an item from the watchlist by the asset ID.
 * Useful for toggle-style unstar from detail pages.
 */
export async function removeByAssetId(
  assetId: string,
  type: "stock" | "fund"
): Promise<void> {
  await apiFetch(`/api/watchlist/asset/${assetId}?type=${type}`, {
    method: "DELETE",
  });
}

/**
 * Check if a specific asset is in the user's watchlist.
 */
export async function checkWatchlisted(
  assetId: string,
  type: "stock" | "fund"
): Promise<WatchlistCheckResult> {
  return apiFetch<WatchlistCheckResult>(
    `/api/watchlist/check/${assetId}?type=${type}`
  );
}
