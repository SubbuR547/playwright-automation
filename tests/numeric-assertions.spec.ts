import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Numeric Assertions — SauceDemo', () => {
  test.setTimeout(60000);

  test('numeric assertions — full flow', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    console.log(' Logged in!');

    // ── toHaveCount — exact number ────────────────────
    await expect(
      page.locator('.inventory_item'),
      'Must have exactly 6 products'
    ).toHaveCount(6);
    console.log(' Exactly 6 products!');

    // ── count() + numeric matchers ────────────────────
    const productCount = await page
      .locator('.inventory_item').count();

    expect(productCount).toBe(6);
    console.log(` toBe: ${productCount} products!`);

    expect(productCount).toBeGreaterThan(0);
    console.log(' Has at least 1 product!');

    expect(productCount).toBeGreaterThanOrEqual(6);
    console.log(' Has 6 or more products!');

    expect(productCount).toBeLessThan(10);
    console.log(' Less than 10 products!');

    expect(productCount).toBeLessThanOrEqual(6);
    console.log(' Max 6 products!');

    // ── Add to cart — count cart badge ────────────────
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();

    // Cart badge should show 2
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart must show 2 items'
    ).toHaveCount(1); // badge element count = 1
    console.log(' Cart badge exists!');

    const cartCount = await page
      .locator('.shopping_cart_badge').innerText();
    expect(Number(cartCount)).toBe(2);
    console.log(` Cart has ${cartCount} items!`);

    expect(Number(cartCount)).toBeGreaterThan(0);
    expect(Number(cartCount)).toBeLessThan(10);
    console.log(' Cart count in valid range!');
  });

});