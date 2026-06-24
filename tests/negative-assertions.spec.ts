import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Negative Assertions — SauceDemo', () => {
  test.setTimeout(60000);

  // ── TEST 1: Error NOT visible on load ─────────────
  test('error message not visible on page load',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Error must NOT be visible before any action
    await expect(
      page.locator('[data-test="error-button"]'),
      'Error must not be visible on fresh load'
    ).not.toBeVisible();
    console.log(' No error on page load!');

    // Must NOT be on inventory page yet
    await expect(
      page,
      'Must not be on inventory before login'
    ).not.toHaveURL(/inventory/);
    console.log(' Not on inventory yet!');

    // Username must NOT have value yet
    await expect(
      page.getByPlaceholder('Username'),
      'Username must be empty on load'
    ).not.toHaveValue('john');
    console.log(' Username is empty!');
  });

  // ── TEST 2: Wrong login shows error ───────────────
  test('wrong login — check negative states',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Wrong credentials
    await page.getByPlaceholder('Username').fill('wronguser');
    await page.getByPlaceholder('Password').fill('wrongpass');
    await page.locator('[data-test="login-button"]').click();

    // Must NOT go to inventory
    await expect(
      page,
      'Must not navigate to inventory on wrong login'
    ).not.toHaveURL(/inventory/);
    console.log(' Did not navigate to inventory!');

    // Error IS visible now
    await expect(
      page.locator('[data-test="error-button"]'),
      'Error must appear after wrong login'
    ).toBeVisible();
    console.log(' Error appeared!');

    // Title must NOT change
    await expect(
      page,
      'Title must still be Swag Labs'
    ).toHaveTitle(/Swag Labs/);
    console.log(' Still on login page!');
  });

  // ── TEST 3: Locked out user ───────────────────────
  test('locked out user cannot login',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // SauceDemo has a locked_out_user!
    await page.getByPlaceholder('Username')
      .fill('locked_out_user');
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();

    // Must NOT be logged in
    await expect(
      page,
      'Locked user must not reach inventory'
    ).not.toHaveURL(/inventory/);
    console.log(' Locked user blocked!');

    // Error must be visible
    await expect(
      page.locator('[data-test="error-button"]')
    ).toBeVisible();
    console.log(' Error shown for locked user!');
  });

  // ── TEST 4: After logout — not on inventory ───────
  test('after logout — cannot access inventory',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Login first
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);
    console.log(' Logged in!');

    // Logout
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // Must NOT be on inventory after logout
    await expect(
      page,
      'Must not be on inventory after logout'
    ).not.toHaveURL(/inventory/);
    console.log(' Not on inventory after logout!');

    // Login button must be visible again
    await expect(
      page.locator('[data-test="login-button"]'),
      'Login button must reappear after logout'
    ).toBeVisible();
    console.log(' Back on login page!');

    // Must NOT see product list
    await expect(
      page.locator('.inventory_list'),
      'Product list must not be visible after logout'
    ).not.toBeVisible();
    console.log(' Products hidden after logout!');
  });

});