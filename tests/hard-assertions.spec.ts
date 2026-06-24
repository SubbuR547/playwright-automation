import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Hard Assertions Practice', () => {
  test.setTimeout(60000);

  test('understand hard assertion flow', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // ── ASSERTION 1 ─────────────────────────────────
    await expect(page).toHaveTitle(/Swag Labs/);
    console.log(' Step 1 — title correct!');

    // ── ASSERTION 2 ─────────────────────────────────
    await expect(
      page.locator('[data-test="login-button"]')
    ).toBeVisible();
    console.log(' Step 2 — login button visible!');

    // ── ASSERTION 3 ─────────────────────────────────
    await expect(
      page.getByPlaceholder('Username')
    ).toHaveValue('');
    console.log(' Step 3 — username empty!');

    // ── LOGIN using .env credentials ─────────────────
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();

    // ── ASSERTION 4 ─────────────────────────────────
    await expect(page).toHaveURL(/inventory/);
    console.log(' Step 4 — on products page!');

    // ── ASSERTION 5 ─────────────────────────────────
    await expect(
      page.locator('.title')
    ).toHaveText('Products');
    console.log(' Step 5 — products page verified!');
  });

  test('see what happens when hard assertion fails',
    async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    console.log('Before failing assertion');

    // Intentional failure!
    await expect(
      page,
      'Title should be wrong — intentional failure'
    ).toHaveTitle('Wrong Title That Does Not Exist');

    // These NEVER run!
    console.log('This line never prints!');
    console.log('This line never prints either!');
  });

});