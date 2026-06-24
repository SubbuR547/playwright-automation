import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('login test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  await page.getByLabel('Username').fill(process.env.TEST_USERNAME!);
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('You logged into a secure area!')).toBeVisible();
});