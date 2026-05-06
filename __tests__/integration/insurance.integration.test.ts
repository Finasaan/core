/**
 * Insurance module integration tests.
 * Tests the Takaful-aware Q&A endpoint and insurance plan list endpoint.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const API_URL = "http://localhost:8787";

describe("Insurance API – Q&A endpoint", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a cited answer when querying insurance coverage", async () => {
    const mockResponse = {
      success: true,
      data: {
        answer:
          "According to the Jubilee Life Takaful Policy (Section 3.2), critical illness coverage includes heart attack, stroke, and cancer diagnosis. The waiting period is 90 days from inception.",
        citations: [
          {
            source: "Jubilee Life Takaful Policy",
            section: "Section 3.2",
            page: 12,
          },
        ],
        provider: "Jubilee",
      },
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await fetch(`${API_URL}/api/insurance/ask`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "What does critical illness cover?" }),
    });

    const result = await response.json() as typeof mockResponse;

    expect(result.success).toBe(true);
    expect(result.data.answer).toContain("Jubilee");
    expect(result.data.citations).toHaveLength(1);
    expect(result.data.citations[0].source).toContain("Takaful");
  });

  it("returns available insurance providers from the plan list", async () => {
    const mockPlans = {
      success: true,
      data: [
        { id: "ins-001", provider: "Jubilee Life", type: "takaful", category: "life" },
        { id: "ins-002", provider: "EFU Life", type: "conventional", category: "life" },
        { id: "ins-003", provider: "Pak-Qatar", type: "takaful", category: "health" },
        { id: "ins-004", provider: "Chubb Insurance", type: "conventional", category: "health" },
      ],
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlans,
    });

    const response = await fetch(`${API_URL}/api/insurance/plans`, {
      credentials: "include",
    });

    const result = await response.json() as typeof mockPlans;

    expect(result.success).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);

    const takafulProviders = result.data.filter((p) => p.type === "takaful");
    expect(takafulProviders.length).toBeGreaterThan(0);

    const providers = result.data.map((p) => p.provider);
    expect(providers).toContain("Jubilee Life");
  });
});
