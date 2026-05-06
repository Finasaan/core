import { test, expect } from "@playwright/test";

test.describe("Authentication flows", () => {
  test("login page renders email and password fields", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in|log in/i })).toBeVisible();

    // Links to sign-up and forgot-password should be present
    await expect(page.getByRole("link", { name: /sign up|create account/i })).toBeVisible();
  });

  test("signup page has all required registration fields", async ({ page }) => {
    await page.goto("/signup");

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign up|create account|register/i })).toBeVisible();

    // After successful signup the app should redirect to onboarding
    // We just verify the form shape, not a live submission
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill("newuser@example.com");
    await expect(emailInput).toHaveValue("newuser@example.com");
  });

  test("invalid login shows an error message", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("badpassword");
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // An error message should appear — either inline or via a toast
    await expect(
      page.getByText(/invalid|incorrect|error|failed/i)
    ).toBeVisible({ timeout: 8_000 });
  });
});
