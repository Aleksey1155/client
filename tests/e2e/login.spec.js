import { test, expect } from "@playwright/test";


test('Screenshot Сторінки Логін', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.screenshot({ path: `screenshots/login-${Date.now()}.png` });
  });