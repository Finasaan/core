import { test, expect } from "@playwright/test";

test.describe("FinasaanGPT chat", () => {
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

  test("chat interface loads with model picker and input field", async ({ page }) => {
    await page.goto("/chat");

    // Message input should be visible
    const chatInput = page.getByRole("textbox", { name: /message|ask|chat/i });
    await expect(chatInput).toBeVisible({ timeout: 10_000 });

    // Model picker (Llama selector) should be present
    await expect(page.getByText(/llama|model/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("sending a message displays a loading or response state", async ({ page }) => {
    await page.goto("/chat");

    const chatInput = page.getByRole("textbox", { name: /message|ask|chat/i });
    await expect(chatInput).toBeVisible({ timeout: 10_000 });

    await chatInput.fill("What is the KSE-100?");
    await page.keyboard.press("Enter");

    // Either a loading indicator or the response text should appear
    await expect(
      page.getByText(/thinking|loading|KSE|index/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });
});
