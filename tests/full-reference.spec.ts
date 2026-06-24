import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Full Assertions Reference — SauceDemo', () => {
  test.setTimeout(10000);

  test('page assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Title
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page).toHaveTitle(/Swag/);
    await expect(page).not.toHaveTitle('Wrong');
    console.log('✅ Title assertions!');

    // URL
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).toHaveURL(/saucedemo/);
    await expect(page).not.toHaveURL(/inventory/);
    console.log('✅ URL assertions!');
  });

  test('visibility assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await expect(
      page.locator('[data-test="login-button"]')
    ).toBeVisible();

    await expect(
      page.locator('[data-test="error-button"]')
    ).toBeHidden();

    await expect(
      page.locator('[data-test="login-button"]')
    ).not.toBeHidden();

    console.log('✅ Visibility assertions!');
  });

  test('text assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Replace this block in text assertions test
await expect(
  page.locator('.login_credentials h4')
).toHaveText('Accepted usernames are:');

await expect(
  page.locator('.login_credentials h4')
).toContainText('usernames');

await expect(
  page.locator('.login_credentials h4')
).toHaveText(/usernames/i);

await expect(
  page.locator('.login_credentials h4')
).not.toHaveText('Wrong text');

    console.log('✅ Text assertions!');
  });

  test('input assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const username = page.getByPlaceholder('Username');

    // Empty
    await expect(username).toHaveValue('');

    // Editable
    await expect(username).toBeEditable();

    // After fill
    await username.fill('standard_user');
    await expect(username).toHaveValue('standard_user');
    await expect(username).not.toHaveValue('');

    // After clear
    await username.clear();
    await expect(username).toHaveValue('');

    console.log('✅ Input assertions!');
  });

  test('state assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Enabled / Disabled
    await expect(
      page.locator('[data-test="login-button"]')
    ).toBeEnabled();

    await expect(
      page.locator('[data-test="login-button"]')
    ).not.toBeDisabled();

    // Attached to DOM
    await expect(
      page.locator('[data-test="login-button"]')
    ).toBeAttached();

    console.log('✅ State assertions!');
  });

  test('attribute assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    // Has attribute
    await expect(
      page.getByPlaceholder('Username')
    ).toHaveAttribute('type', 'text');

    await expect(
      page.getByPlaceholder('Password')
    ).toHaveAttribute('type', 'password');

    // Not have attribute
    await expect(
      page.locator('[data-test="login-button"]')
    ).not.toHaveAttribute('disabled', '');

    console.log('✅ Attribute assertions!');
  });

  test('count assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory/);

    // toHaveCount
    await expect(
      page.locator('.inventory_item')
    ).toHaveCount(6);

    // count() + numeric
    const count = await page.locator('.inventory_item').count();
    expect(count).toBe(6);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(10);

    console.log('✅ Count assertions!');
  });

  test('soft assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await expect.soft(
      page.getByPlaceholder('Username'),
      'Username must be visible'
    ).toBeVisible();

    await expect.soft(
      page.getByPlaceholder('Password'),
      'Password must be visible'
    ).toBeVisible();

    // Intentional fail — but continues!
    // await expect.soft(
    //   page.getByText('Fake text'),
    //   'This will fail but test continues'
    // ).toBeVisible();

    await expect.soft(
      page.locator('[data-test="login-button"]'),
      'Login button must be visible'
    ).toBeVisible();

    console.log('✅ Soft assertions — all checked!');
  });

  test('polling assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]').click();

    await expect(async () => {
      const count = await page
        .locator('.inventory_item').count();
      expect(count).toBeGreaterThan(0);
    }).toPass({
      intervals: [500, 500, 1000],
      timeout: 10000
    });

    console.log('✅ Polling assertions!');
  });

});