import { test, expect } from "@playwright/test";

test.describe("Budget module", () => {
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

  test("budget page loads and shows current month label", async ({ page }) => {
    await page.goto("/dashboard/budget");

    // The current month name (e.g., "May 2026") should appear
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const currentMonth = months[new Date().getMonth()];

    await expect(
      page.getByText(new RegExp(currentMonth, "i")).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("bachatAI chat input is present on the budget page", async ({ page }) => {
    await page.goto("/dashboard/budget");

    // The AI chat input for natural-language spend queries
    const chatInput = page.getByRole("textbox", { name: /ask|type|bachat|budget/i });
    await expect(chatInput.first()).toBeVisible({ timeout: 10_000 });
  });
});
