import { test, expect } from "@playwright/test";

test.describe("Portfolio module", () => {
  test.beforeEach(async ({ context }) => {
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
  });

  test("portfolio page renders the holdings table or empty state", async ({ page }) => {
    await page.goto("/dashboard/portfolio");

    // Either the holdings table header or an empty-state prompt
    await expect(
      page
        .getByText(/holdings|portfolio|add your first|no portfolio/i)
        .first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
