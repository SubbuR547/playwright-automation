import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('filter by text', async ({ page }) => {
  test.setTimeout(60000);

  await login(page);
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForLoadState('domcontentloaded');

  // Search for John TestUser first
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('John');
  await page.getByRole('option', { name: 'John TestUser' }).first().click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('domcontentloaded');

  // Now filter the row
  const employeeRow = page.getByRole('row').filter({ hasText: 'John TestUser' });
  await expect(employeeRow.first()).toBeVisible();
  console.log('✅ Found John TestUser row!');
});