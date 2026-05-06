import { test, expect } from "@playwright/test";

/**
 * These tests run against a preview environment where auth cookies
 * are pre-seeded via storageState, or they verify that unauthenticated
 * users are redirected to /login.
 */

test.describe("Dashboard", () => {
  test("unauthenticated users are redirected to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard shows KSE-100 ticker strip", async ({ page, context }) => {
    // Inject a minimal auth cookie so middleware lets us through
    await context.addCookies([
      {
        name: "sb-token",
        value: process.env.E2E_AUTH_TOKEN || "e2e-test-token",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
      },
    ]);

    await page.goto("/dashboard");

    // The KSE-100 ticker strip or index card should be present
    await expect(
      page.getByText(/KSE-100|KSE 100/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("watchlist section appears on the dashboard", async ({ page, context }) => {
    await context.addCookies([
      {
        name: "sb-token",
        value: process.env.E2E_AUTH_TOKEN || "e2e-test-token",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
      },
    ]);

    await page.goto("/dashboard");

    await expect(
      page.getByText(/watchlist/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
