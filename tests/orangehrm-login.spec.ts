import { test, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Reusable login function
export async function login(page: Page) {
  await page.goto('https://opensource-demo.orangehrmlive.com/');
  await page.getByPlaceholder('Username').fill(process.env.TEST_USERNAME!);
  await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait for dashboard to load
  await expect(page).toHaveURL(/dashboard/);
}

test('login to OrangeHRM', async ({ page }) => {
    test.setTimeout(60000);
  await login(page);
  // Check dashboard heading is visible
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});