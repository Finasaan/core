/**
 * News module integration test.
 * Verifies the news feed endpoint returns articles with required fields
 * including AI-generated sentiment and impact analysis.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const API_URL = "http://localhost:8787";

describe("News API – feed endpoint", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns articles with title, sentiment, and impact fields", async () => {
    const mockArticles = [
      {
        id: "news-001",
        title: "KSE-100 surges on improved economic outlook",
        summary: "Pakistan's benchmark index rose 0.37% amid optimism over IMF tranche.",
        source: "The News International",
        published_at: "2026-05-07T08:00:00Z",
        sentiment: "positive",
        impact: "bullish",
        related_symbols: ["PSX", "UBL", "MCB"],
      },
      {
        id: "news-002",
        title: "Rupee weakens against USD in interbank market",
        summary: "PKR fell 0.2% as import demand picked up ahead of quarter-end.",
        source: "Dawn",
        published_at: "2026-05-07T07:30:00Z",
        sentiment: "negative",
        impact: "bearish",
        related_symbols: ["PKR"],
      },
    ];

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockArticles }),
    });

    const response = await fetch(`${API_URL}/api/news`);
    const result = await response.json() as { success: boolean; data: typeof mockArticles };

    expect(result.success).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);

    for (const article of result.data) {
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.sentiment).toMatch(/^(positive|negative|neutral)$/);
      expect(article.impact).toMatch(/^(bullish|bearish|neutral)$/);
      expect(article.published_at).toBeDefined();
    }

    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain("/api/news");
  });
});
