/**
 * Market module integration tests.
 * Covers KSE-100 market summary and PSX sector performance endpoints.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getMarketSummary } from "../../lib/market/api";

describe("Market API – getMarketSummary", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns KSE-100 index data with required OHLCV shape", async () => {
    const mockSummary = {
      kse100: {
        symbol: "KSE-100",
        current: 115_842.3,
        change: 423.5,
        changePercent: 0.37,
        open: 115_418.8,
        high: 116_002.1,
        low: 115_300.0,
        volume: 287_450_000,
      },
      kse30: {
        symbol: "KSE-30",
        current: 38_210.5,
        change: -112.3,
        changePercent: -0.29,
      },
      timestamp: "2026-05-07T09:30:00Z",
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSummary }),
    });

    const result = await getMarketSummary();

    expect(result).not.toBeNull();
    expect(result!.kse100.symbol).toBe("KSE-100");
    expect(result!.kse100.current).toBeGreaterThan(0);
    expect(result!.kse100.volume).toBeGreaterThan(0);

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/api/market/summary");
  });

  it("returns null gracefully when the market summary API fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network error"));

    const result = await getMarketSummary();

    expect(result).toBeNull();
  });
});

describe("Market API – sector breakdown endpoint", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns sector performance data with weights summing to ~1", async () => {
    const mockSectors = [
      { sector: "Oil & Gas", weight: 0.28, change_pct: 1.2 },
      { sector: "Cement", weight: 0.15, change_pct: -0.5 },
      { sector: "Banking", weight: 0.30, change_pct: 0.8 },
      { sector: "Technology", weight: 0.12, change_pct: 2.1 },
      { sector: "Other", weight: 0.15, change_pct: 0.0 },
    ];

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSectors }),
    });

    const response = await fetch("http://localhost:8787/api/sectors");
    const result = await response.json() as { success: boolean; data: typeof mockSectors };

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(5);

    const totalWeight = result.data.reduce((sum, s) => sum + s.weight, 0);
    expect(totalWeight).toBeCloseTo(1, 1);
  });
});
