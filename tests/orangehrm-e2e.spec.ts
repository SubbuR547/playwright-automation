import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('E2E - Add new employee and verify', async ({ page }) => {
  test.setTimeout(60000);

  // Step 1 - Login
  await login(page);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  console.log('✅ Step 1 - Logged in');

  // Step 2 - Go to PIM
  await page.getByRole('link', { name: 'PIM' }).click();
  await expect(page).toHaveURL(/pim/);
  console.log('✅ Step 2 - Navigated to PIM');

  // Step 3 - Click Add Employee
  await page.getByRole('button', { name: ' Add' }).click();
  await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
  console.log('✅ Step 3 - Add Employee page opened');

  // Wait for form to fully load
  await page.waitForLoadState('networkidle');

  // Step 4 - Fill employee details
  await page.getByRole('textbox', { name: 'First Name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('TestUser');
  console.log('✅ Step 4 - Filled employee details');

// Step 5 - Save employee
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForURL(/viewPersonalDetails/);
  console.log('✅ Step 5 - Employee saved!');

  // Step 6 - Verify employee details on Personal Details page
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('John');
  await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('TestUser');
  console.log('✅ Step 6 - Employee details verified!');

  // Step 7 - Go to Employee List and search
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('John');
  await page.getByRole('option', { name: 'John TestUser' }).first(); // pick first option
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForLoadState('networkidle');

  // Verify employee appears in search results
  await expect(page.getByRole('cell', { name: 'John' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'TestUser' }).first()).toBeVisible();
  console.log('✅ Step 7 - Employee found in search results!');

  // Step 8 - Logout
  await page.getByRole('banner').getByRole('img').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/login/);
  console.log('✅ Step 8 - Logged out');

});