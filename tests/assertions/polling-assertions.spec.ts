import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Polling Assertions — SauceDemo', () => {
  test.setTimeout(60000);

  test('polling assertions — full flow', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();

    // ── POLL 1: Wait for products to load ─────────────
    await expect(async () => {
      const count = await page
        .locator('.inventory_item').count();
      expect(count).toBeGreaterThan(0);
    }).toPass({
      intervals: [500, 500, 1000],
      timeout: 10000
    });
    console.log(' Products loaded!');

    // ── POLL 2: Wait for specific element ─────────────
    await expect(async () => {
      await expect(
        page.locator('.inventory_list')
      ).toBeVisible();
    }).toPass({ timeout: 10000 });
    console.log(' Product list visible!');

    // ── POLL 3: Add to cart — wait for badge ──────────
    await page
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    // Poll until cart badge shows correct number
    await expect(async () => {
      const cartText = await page
        .locator('.shopping_cart_badge').innerText();
      expect(Number(cartText)).toBe(1);
    }).toPass({
      intervals: [200, 500, 1000],
      timeout: 5000
    });
    console.log(' Cart updated to 1!');

    // ── POLL 4: Add more — wait for badge update ───────
    await page
      .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();

    await expect(async () => {
      const cartText = await page
        .locator('.shopping_cart_badge').innerText();
      expect(Number(cartText)).toBe(2);
    }).toPass({
      intervals: [200, 500, 1000],
      timeout: 5000
    });
    console.log(' Cart updated to 2!');

    // ── POLL 5: Navigate and wait for page ────────────
    await page.locator('.shopping_cart_link').click();

    await expect(async () => {
      await expect(page).toHaveURL(/cart/);
      const items = await page
        .locator('.cart_item').count();
      expect(items).toBe(2);
    }).toPass({ timeout: 10000 });
    console.log(' Cart page loaded with 2 items!');
  });

});