import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('soft assertions', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);

  // Check multiple things without stopping
  await expect.soft(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'PIM' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Leave' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Time' })).toBeVisible();
  
  // This one will FAIL but test continues!
  await expect.soft(page.getByRole('link', { name: 'FakeLink' })).toBeVisible();
  
  // This still runs even though above failed!
  await expect.soft(page.getByRole('link', { name: 'Recruitment' })).toBeVisible();

  console.log('✅ All soft assertions checked!');
});