/**
 * Budget module integration tests.
 * Tests the budget API client functions end-to-end through the fetch layer.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchDashboard,
  createTransaction,
} from "../../lib/budget/api";

describe("Budget API – fetchDashboard", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches dashboard data for the given month and year", async () => {
    const mockDashboard = {
      month: 5,
      year: 2026,
      totalIncome: 150_000,
      totalExpenses: 90_000,
      savingsRate: 40,
      categories: [],
      transactions: [],
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockDashboard }),
    });

    const result = await fetchDashboard(5, 2026);

    expect(result.month).toBe(5);
    expect(result.year).toBe(2026);
    expect(result.totalIncome).toBe(150_000);

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/api/budget/dashboard");
    expect(calledUrl).toContain("month=5");
    expect(calledUrl).toContain("year=2026");
  });

  it("creates a transaction and returns the saved record", async () => {
    const payload = {
      type: "expense" as const,
      amount: 2_500,
      description: "Lunch at Kolachi",
      category_id: "cat-food-001",
      month: 5,
      year: 2026,
      day: 7,
    };

    const savedTransaction = {
      id: "txn-xyz-789",
      ...payload,
      created_at: new Date().toISOString(),
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: savedTransaction }),
    });

    const result = await createTransaction(payload);

    expect(result.id).toBe("txn-xyz-789");
    expect(result.amount).toBe(2_500);
    expect(result.description).toBe("Lunch at Kolachi");

    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const options = call[1] as RequestInit;
    expect(options.method).toBe("POST");
    expect(options.body).toContain("Lunch at Kolachi");
  });
});
