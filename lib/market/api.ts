/**
 * Market API client
 * Fetches market summary data from spine (public endpoint, no auth needed).
 */

import type { MarketSummary } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

/**
 * Get the latest market summary (KSE-100 + KSE-30 index data).
 * This is a public endpoint — no authentication required.
 */
export async function getMarketSummary(): Promise<MarketSummary | null> {
  try {
    const response = await fetch(`${API_URL}/api/market/summary`);
    const result = (await response.json()) as {
      success: boolean;
      data?: MarketSummary;
      error?: string;
    };

    if (!result.success || !result.data) {
      console.error("Market summary API error:", result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch market summary:", error);
    return null;
  }
}
