import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero tagline and call-to-action", async ({ page }) => {
    await page.goto("/");

    // The landing page should carry the Finasaan tagline
    await expect(page).toHaveTitle(/finasaan/i);
    await expect(page.getByText(/Learn\. Invest\. Grow/i)).toBeVisible();

    // CTA buttons to sign up or log in should be present
    const ctaLinks = page.getByRole("link", { name: /get started|sign up|log in/i });
    await expect(ctaLinks.first()).toBeVisible();
  });
});
