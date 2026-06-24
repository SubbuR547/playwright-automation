import { test, expect, Locator } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('locators sample', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);

  // 1. getByRole - logo/brand image
  const brandLogo: Locator = page.getByRole('img', { name: 'client brand banner' });
  await expect(brandLogo).toBeVisible();
  console.log('✅ 1. Brand logo found by role!');

  // 2. getByRole - heading
  const dashboardHeading: Locator = page.getByRole('heading', { name: 'Dashboard' });
  await expect(dashboardHeading).toBeVisible();
  console.log('✅ 2. Dashboard heading found!');

  // 3. getByRole - navigation link
  const pimLink: Locator = page.getByRole('link', { name: 'PIM' });
  await expect(pimLink).toBeVisible();
  console.log('✅ 3. PIM link found!');

  // 4. getByText - visible text on page
  const timeAtWork: Locator = page.getByText('Time at Work');
  await expect(timeAtWork).toBeVisible();
  console.log('✅ 4. Time at Work text found!');

  // 5. getByRole - search textbox in sidebar
  const searchBox: Locator = page.getByRole('textbox', { name: 'Search' });
  await expect(searchBox).toBeVisible();
  console.log('✅ 5. Search box found!');

  // 6. getByRole - profile picture
  const profilePic: Locator = page.getByRole('img', { name: 'profile picture' }).first();
  await expect(profilePic).toBeVisible();
  console.log('✅ 6. Profile picture found!');

  // 7. getByRole - button
  const assignLeaveBtn: Locator = page.getByRole('button', { name: 'Assign Leave' });
  await expect(assignLeaveBtn).toBeVisible();
  console.log('✅ 7. Assign Leave button found!');

  // 8. Locator type - Locator variable with count
  const allLinks: Locator = page.getByRole('link');
  const linkCount = await allLinks.count();
  console.log(`✅ 8. Total links on page: ${linkCount}`);

  // 9. filter() - find specific link in sidebar
  const leaveLink: Locator = page
    .getByRole('list')
    .getByRole('link', { name: 'Leave' });
  await expect(leaveLink).toBeVisible();
  console.log('✅ 9. Leave link found using chaining!');

  // 10. soft assertions - check all menu items
  await expect.soft(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'PIM' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Leave' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Time' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Recruitment' })).toBeVisible();
  console.log('✅ 10. All menu items verified with soft assertions!');
});