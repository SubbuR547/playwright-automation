import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Custom Error Messages — SauceDemo', () => {
  test.setTimeout(60000);

  test('custom messages — full flow', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // ── PAGE LEVEL ────────────────────────────────────
    await expect(
      page,
      ' Must land on Swag Labs login page'
    ).toHaveTitle(/Swag Labs/);
    console.log(' Title verified!');

    await expect(
      page,
      ' Must start on root URL'
    ).toHaveURL('https://www.saucedemo.com/');
    console.log(' URL verified!');

    // ── LOGIN ELEMENTS ────────────────────────────────
    await expect(
      page.getByPlaceholder('Username'),
      ' Username field must be on login page'
    ).toBeVisible();
    console.log(' Username visible!');

    await expect(
      page.getByPlaceholder('Password'),
      ' Password field must be on login page'
    ).toBeVisible();
    console.log(' Password visible!');

    await expect(
      page.locator('[data-test="login-button"]'),
      ' Login button must be on login page'
    ).toBeEnabled();
    console.log(' Login button enabled!');

    // ── LOGIN ─────────────────────────────────────────
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();

    await expect(
      page,
      ' Must navigate to inventory after successful login'
    ).toHaveURL(/inventory/);
    console.log(' Logged in!');

    // ── PRODUCTS PAGE ─────────────────────────────────
    await expect(
      page.locator('.title'),
      ' Page title must say Products after login'
    ).toHaveText('Products');
    console.log(' Products title verified!');

    await expect(
      page.locator('.inventory_item'),
      ' Must have exactly 6 products on inventory page'
    ).toHaveCount(6);
    console.log(' Product count verified!');

    await expect(
      page.locator('.shopping_cart_link'),
      ' Cart icon must be visible after login'
    ).toBeVisible();
    console.log(' Cart icon visible!');

    // ── ADD TO CART ───────────────────────────────────
    await page
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    await expect(
      page.locator('.shopping_cart_badge'),
      ' Cart badge must appear after adding item'
    ).toBeVisible();
    console.log(' Cart badge appeared!');

    // ── SEE INTENTIONAL FAILURE MESSAGE ───────────────
    // Comment this out after seeing the error message!
    await expect(
      page.locator('.shopping_cart_badge'),
      ' Cart must show 99 items — intentional failure to see custom message!'
    ).toHaveText('99');
  });

});