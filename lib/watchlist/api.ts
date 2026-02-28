/**
 * Watchlist API client
 * All watchlist endpoints require authentication.
 */

import { createClient } from "@/lib/supabase/client";
import type {
  WatchlistItem,
  WatchlistCheckResult,
  AddToWatchlistRequest,
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
 * Authenticated fetch wrapper for watchlist API calls.
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
