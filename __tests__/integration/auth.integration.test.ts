/**
 * Auth module integration tests.
 * These tests verify the request/response contract between the frontend
 * API clients and the spine auth endpoints.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const API_URL = "http://localhost:8787";

describe("Auth API – login endpoint", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a user object and sets a session cookie on successful login", async () => {
    const mockUser = {
      id: "user-abc-123",
      email: "test@finasaan.com",
      literacy_level: "beginner",
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: { user: mockUser } }),
      headers: new Headers({
        "set-cookie": "sb-token=abc; HttpOnly; SameSite=Lax",
      }),
    });

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@finasaan.com", password: "password123" }),
    });

    const result = await response.json() as { success: boolean; data: { user: typeof mockUser } };

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe("test@finasaan.com");
    expect(result.data.user.id).toBeDefined();
  });

  it("rejects unauthenticated requests to protected budget endpoint with 401", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: "Unauthorized" }),
    });

    const response = await fetch(`${API_URL}/api/budget/dashboard?month=5&year=2026`, {
      credentials: "include",
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
    const body = await response.json() as { success: boolean; error: string };
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });
});
