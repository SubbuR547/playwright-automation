import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// ── These run in PARALLEL ─────────────────────────────
test.describe.parallel('Parallel Tests — SauceDemo', () => {
  test.setTimeout(60000);

  test('worker 1 — check title', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle(/Swag Labs/);
    console.log('✅ Worker 1 — title checked!');
  });

  test('worker 2 — check login button', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(
      page.locator('[data-test="login-button"]')
    ).toBeVisible();
    console.log('✅ Worker 2 — login button checked!');
  });

  test('worker 3 — check URL', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    console.log('✅ Worker 3 — URL checked!');
  });

  test('worker 4 — check username field', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(
      page.getByPlaceholder('Username')
    ).toBeVisible();
    console.log('✅ Worker 4 — username field checked!');
  });

});

// ── These run SEQUENTIALLY (depend on each other) ─────
test.describe.serial('Serial Tests — login flow', () => {
  test.setTimeout(60000);

  test('step 1 — go to login page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    console.log('✅ Step 1 — on login page!');
  });

  test('step 2 — login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]')
      .click({ force: true });
    await expect(page).toHaveURL(/inventory/);
    console.log('✅ Step 2 — logged in!');
  });

  test('step 3 — verify products', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]')
      .click({ force: true });
    await expect(page).toHaveURL(/inventory/);
    await expect(
      page.locator('.inventory_item')
    ).toHaveCount(6);
    console.log('✅ Step 3 — products verified!');
  });

});