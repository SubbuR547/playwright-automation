import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('navigate to employee list', async ({ page }) => {
  await login(page);
  await page.getByRole('link', { name: 'My Info' }).click();
  await expect(page).toHaveURL(/viewPersonalDetails/);
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
});

test('navigate to leave page', async ({ page }) => {
  await login(page);

  // Click Leave in the left menu
  await page.getByRole('link', { name: 'Leave' }).click();

  // Check Leave page loaded
  await expect(page).toHaveURL(/viewLeaveList/);
  await expect(page.getByRole('heading', { name: 'Leave List' })).toBeVisible();
});

test('navigate to recruitment page', async ({ page }) => {
  await login(page);

  // Click Recruitment in the left menu
  await page.getByRole('link', { name: 'Recruitment' }).click();

  // Check Recruitment page loaded
  await expect(page).toHaveURL(/recruitment/);
  await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible();
});