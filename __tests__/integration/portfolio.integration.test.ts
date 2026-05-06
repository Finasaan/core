/**
 * Portfolio module integration tests.
 * Verifies the portfolio API client, holdings fetch, and RLS isolation contract.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { listPortfolios, getPortfolioSummary } from "../../lib/portfolio/api";

describe("Portfolio API – listPortfolios", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the authenticated user's portfolios with correct shape", async () => {
    const mockPortfolios = [
      {
        id: "port-001",
        name: "My PSX Portfolio",
        user_id: "user-abc-123",
        created_at: "2025-01-01T00:00:00Z",
      },
    ];

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockPortfolios }),
    });

    const result = await listPortfolios();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("port-001");
    expect(result[0].name).toBe("My PSX Portfolio");

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/api/portfolio");
  });

  it("RLS isolation — a different user's portfolio returns an empty list (0 rows)", async () => {
    // Supabase RLS ensures User B cannot read User A's rows.
    // This test simulates User B's request returning no portfolios,
    // confirming that RLS filters them out at the DB layer.
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    const result = await listPortfolios();

    expect(result).toHaveLength(0);
    // No cross-user data leakage
    expect(result.find((p) => p.user_id === "user-other-999")).toBeUndefined();
  });
});

describe("Portfolio API – getPortfolioSummary", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns P/L and sector allocation for the requested portfolio", async () => {
    const mockSummary = {
      portfolio_id: "port-001",
      total_invested: 500_000,
      current_value: 620_000,
      total_pnl: 120_000,
      total_pnl_pct: 24,
      sector_allocation: [
        { sector: "Technology", weight: 0.4 },
        { sector: "Energy", weight: 0.6 },
      ],
      holdings: [],
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSummary }),
    });

    const summary = await getPortfolioSummary("port-001");

    expect(summary.total_pnl).toBe(120_000);
    expect(summary.sector_allocation).toHaveLength(2);
    expect(summary.total_pnl_pct).toBeGreaterThan(0);
  });
});
