import { test, expect } from "@playwright/test";

test.describe("FBR Tax Calculator", () => {
  test("calculates net monthly take-home after salary input", async ({ page }) => {
    await page.goto("/dashboard/calculators");

    // Find the salary input field
    const salaryInput = page
      .getByRole("spinbutton", { name: /salary|annual|gross/i })
      .or(page.locator('input[type="number"]').first());

    await expect(salaryInput).toBeVisible({ timeout: 10_000 });

    // Enter an annual salary of 1,800,000 PKR
    await salaryInput.fill("1800000");
    await salaryInput.press("Tab");

    // Net take-home or tax output should appear
    await expect(
      page
        .getByText(/take.home|net salary|monthly tax|tax payable/i)
        .first()
    ).toBeVisible({ timeout: 8_000 });
  });
});
