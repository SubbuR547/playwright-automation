import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('getByLabel example', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);

  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('button', { name: ' Add' }).click();
  await page.waitForLoadState('domcontentloaded');

  // ✅ OrangeHRM uses textbox role — use getByRole instead
  await page.getByRole('textbox', { name: 'First Name' }).fill('John');
  console.log('✅ Filled First Name!');

  await page.getByRole('textbox', { name: 'Last Name' }).fill('TestUser');
  console.log('✅ Filled Last Name!');

  await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('TestUser');
  console.log('✅ Values verified!');
});