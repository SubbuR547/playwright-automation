import { test, expect } from '@playwright/test';

test('checkbox test', async ({ page }) => {
  // Go to the checkboxes page
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  // Get the first checkbox and check it
  const checkbox1 = page.locator('input[type="checkbox"]').first();
  const checkbox2 = page.locator('input[type="checkbox"]').last();

  // Check checkbox 1
  await checkbox1.check();
  await expect(checkbox1).toBeChecked();

  // Uncheck checkbox 2
  await checkbox2.uncheck();
  await expect(checkbox2).not.toBeChecked();
});