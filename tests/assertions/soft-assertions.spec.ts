import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Soft Assertions — SauceDemo', () => {
  test.setTimeout(60000);

  // ── TEST 1: Understand soft assertion flow ─────────
  test('soft assertions continue after failure',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    console.log('Starting soft assertions...');

    // ✅ Pass
    await expect.soft(
      page.getByPlaceholder('Username'),
      'Username input must be visible'
    ).toBeVisible();
    console.log('After assertion 1');

    // ✅ Pass
    await expect.soft(
      page.getByPlaceholder('Password'),
      'Password input must be visible'
    ).toBeVisible();
    console.log('After assertion 2');

    // ❌ Fail — but continues!
    // await expect.soft(
    //   page.getByText('This text does not exist'),
    //   'This will fail but test continues!'
    // ).toBeVisible();
    // console.log('After assertion 3 — I still run!');

    // ✅ Pass
    await expect.soft(
      page.locator('[data-test="login-button"]'),
      'Login button must be visible'
    ).toBeVisible();
    console.log('After assertion 4 — I still run too!');

    // ❌ Fail — but continues!
    // await expect.soft(
    //   page.getByText('Another fake text'),
    //   'This will also fail!'
    // ).toBeVisible();
    // console.log('After assertion 5 — still running!');

    // ✅ Pass
    await expect.soft(page).toHaveTitle(/Swag Labs/);
    console.log('After assertion 6 — completed!');

    console.log('ALL assertions checked!');
    // Test ends — shows ALL failures at once!
  });

  // ── TEST 2: Real world use — check all products ────
  test('verify all products on page',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login first — HARD assertion
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    console.log(' Logged in!');

    // Check ALL products with soft assertions
    // If one product missing — others still checked!
    await expect.soft(
      page.getByText('Sauce Labs Backpack'),
      'Backpack must be on page'
    ).toBeVisible();
    console.log('After checking Backpack');

    await expect.soft(
      page.getByText('Sauce Labs Bike Light'),
      'Bike Light must be on page'
    ).toBeVisible();
    console.log('After checking Bike Light');

    await expect.soft(
  page.locator('[data-test="inventory-item-name"]',
    { hasText: 'Sauce Labs Bolt T-Shirt' }),
  'Bolt T-Shirt must be on page'
).toBeVisible();
    console.log('After checking Bolt T-Shirt');

    await expect.soft(
      page.locator('[data-test="inventory-item-name"]',
        { hasText: 'Sauce Labs Fleece Jacket' }),
      'Fleece Jacket must be on page'
    ).toBeVisible();
    console.log('After checking Fleece Jacket');

    await expect.soft(
      page.locator('[data-test="inventory-item-name"]',
        { hasText: 'Sauce Labs Onesie' }),
      'Onesie must be on page'
    ).toBeVisible();
    console.log('After checking Onesie');

    // This product does NOT exist — fails but continues!
    // await expect.soft(
    //   page.getByText('Fake Product XYZ'),
    //   'Fake product — intentional failure!'
    // ).toBeVisible();
    // console.log('After checking fake product — still running!');

    await expect.soft(
      page.getByText('Test.allTheThings() T-Shirt (Red)'),
      'Red T-Shirt must be on page'
    ).toBeVisible();
    console.log('After checking Red T-Shirt');

    console.log(' ALL products checked!');
  });

  // ── TEST 3: Hard first then soft ──────────────────
  test('combine hard and soft correctly',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // HARD — critical steps
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();

    // HARD — must be on correct page
    await expect(page).toHaveURL(/inventory/);
    console.log(' Hard assertion passed — on products page!');

    // SOFT — check all page elements
    // If any fail we still see ALL failures
    await expect.soft(
      page.locator('.title'),
      'Title must say Products'
    ).toHaveText('Products');

    await expect.soft(
      page.locator('.shopping_cart_link'),
      'Cart icon must be visible'
    ).toBeVisible();

    await expect.soft(
      page.locator('.inventory_list'),
      'Product list must exist'
    ).toBeVisible();

    await expect.soft(
      page.locator('.inventory_item'),
      'Must have at least one product'
    ).toHaveCount(6);

    console.log(' All soft checks done!');
  });

});