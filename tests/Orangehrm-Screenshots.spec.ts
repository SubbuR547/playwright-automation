import { test, expect } from '@playwright/test';
import { login } from './orangehrm-login.spec';

test('screenshots practice', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);

  // 1. Simple screenshot of visible area
  await page.screenshot({ path: 'screenshots/dashboard.png' });
  console.log('✅ 1. Dashboard screenshot taken!');

  // 2. Full page screenshot
  await page.screenshot({ 
    path: 'screenshots/dashboard-fullpage.png',
    fullPage: true 
  });
  console.log('✅ 2. Full page screenshot taken!');

  // 3. Screenshot of specific element only
  await page.getByRole('navigation', { name: 'Sidepanel' }).screenshot({ 
    path: 'screenshots/sidebar.png' 
  });
  console.log('✅ 3. Sidebar element screenshot taken!');

  // 4. Navigate to PIM and screenshot
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('table').waitFor({ state: 'visible' });

  // 5. Screenshot of table only
  await page.getByRole('table').screenshot({ 
    path: 'screenshots/employee-table.png' 
  });
  console.log('✅ 5. Table screenshot taken!');

  // 6. Screenshot with clip (specific area by coordinates)
  await page.screenshot({ 
    path: 'screenshots/clipped.png',
    clip: { x: 0, y: 0, width: 400, height: 300 }
  });
  console.log('✅ 6. Clipped screenshot taken!');
});