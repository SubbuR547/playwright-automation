import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';
import dotenv from 'dotenv';
dotenv.config();

// ── SMOKE TESTS ───────────────────────────────────────
test.describe('Smoke Tests @smoke', () => {
  test.setTimeout(60000);

  test('login works @smoke @login',
    async ({ page }) => {
    await login(page);
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    console.log('✅ Smoke: Login works!');
  });

  test('dashboard loads @smoke @dashboard',
    async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/dashboard/);
    console.log('✅ Smoke: Dashboard loads!');
  });

  test('PIM navigates @smoke @navigation',
    async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect(page).toHaveURL(/pim/);
    console.log('✅ Smoke: PIM navigates!');
  });
});

// ── REGRESSION TESTS ──────────────────────────────────
test.describe('Regression Tests @regression', () => {
  test.setTimeout(60000);

  test('add employee flow @regression @employee',
    async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: ' Add' }).click();
    await page.waitForLoadState('domcontentloaded');

    const timestamp = Date.now();
    await page.getByRole('textbox', { name: 'First Name' })
      .fill(`Test_${timestamp}`);
    await page.getByRole('textbox', { name: 'Last Name' })
      .fill(`User_${timestamp}`);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/viewPersonalDetails/);

    await expect(
      page.getByRole('textbox', { name: 'First Name' })
    ).toHaveValue(`Test_${timestamp}`);
    console.log('✅ Regression: Add employee works!');
  });

  test('search employee @regression @employee',
    async ({ page }) => {
    test.setTimeout(90000);

    await login(page);
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('domcontentloaded');

    // Click Search directly
    await page.getByRole('button', { name: 'Search' }).click();

    // Fix — use regex to match 'Records Found'
    await page.getByText(/Records Found/).waitFor({
      state: 'visible',
      timeout: 30000
    });

    // Now count rows
    const rows = page.getByRole('row');
    const count = await rows.count();
    console.log('Total rows including header:', count);
    expect(count).toBeGreaterThanOrEqual(2);
    console.log('✅ Regression: Search works!');
  });
});

// ── LOGIN TESTS ───────────────────────────────────────
test.describe('Login Tests @login', () => {
  test.setTimeout(60000);

  test('valid login @login @smoke',
    async ({ page }) => {
    await login(page);
    // Fix — check heading instead of URL
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    console.log('✅ Login: Valid login works!');
  });

  test('invalid login shows error @login',
    async ({ page }) => {
    await page.goto(
      'https://opensource-demo.orangehrmlive.com/'
    );
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('textbox').nth(0).fill('wronguser');
    await page.getByRole('textbox').nth(1).fill('wrongpass');
    await page.getByRole('button').first().click();

    // Fix — wait for error message
    await page.waitForLoadState('domcontentloaded');
    await expect(
      page.getByText('Invalid credentials')
    ).toBeVisible({ timeout: 15000 });
    console.log('✅ Login: Invalid credentials shows error!');
  });
});

// ── API TESTS ─────────────────────────────────────────
test.describe('API Tests @api', () => {
  test.setTimeout(30000);

  test('GET users returns 200 @api',
    async ({ request }) => {
    const response = await request.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    expect(response.status()).toBe(200);
    console.log('✅ API: GET users works!');
  });

  test('POST creates resource @api',
    async ({ request }) => {
    const response = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      { data: { title: 'Test', body: 'Body', userId: 1 } }
    );
    expect(response.status()).toBe(201);
    console.log('✅ API: POST works!');
  });
});