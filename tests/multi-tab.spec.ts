import { test, expect } from '@playwright/test';

test.describe('Multi-Tab Testing', () => {
  test.setTimeout(60000);

  // ── TEST 1: Open new tab via click ────────────────
  test('open link in new tab', async ({ page, context }) => {

    await page.goto('https://www.saucedemo.com/');
    console.log('✅ Tab 1 open — SauceDemo');

    // Open new tab manually
    const newTab = await context.newPage();
    await newTab.goto('https://jsonplaceholder.typicode.com/');
    console.log('✅ Tab 2 open — JSONPlaceholder');

    // Both tabs open — assert each
    await expect(page).toHaveTitle(/Swag Labs/);
    console.log('✅ Tab 1 title: Swag Labs');

    await expect(newTab).toHaveTitle(/JSONPlaceholder/);
    console.log('✅ Tab 2 title: JSONPlaceholder');

    // Switch back to tab 1
    await page.bringToFront();
    console.log('✅ Switched back to Tab 1!');

    // Close tab 2
    await newTab.close();
    console.log('✅ Tab 2 closed!');
  });

  // ── TEST 2: Catch popup/new tab from click ────────
  test('catch new tab opened by link click', async ({ page, context }) => {

    await page.goto('https://www.saucedemo.com/');

    // Wait for new tab to open BEFORE clicking
    const [newTab] = await Promise.all([
      context.waitForEvent('page'), // wait for new tab
      page.evaluate(() => {
        // Simulate opening new tab
        window.open('https://jsonplaceholder.typicode.com/', '_blank');
      })
    ]);

    // Wait for new tab to load
    await newTab.waitForLoadState();
    console.log(`✅ New tab URL: ${newTab.url()}`);

    await expect(newTab).toHaveTitle(/JSONPlaceholder/);
    console.log('✅ New tab verified!');

    // Original tab still intact
    await expect(page).toHaveTitle(/Swag Labs/);
    console.log('✅ Original tab still open!');

    await newTab.close();
  });

  // ── TEST 3: Work across multiple tabs ─────────────
  test('work across 3 tabs', async ({ context }) => {

    // Open 3 tabs
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();
    const tab3 = await context.newPage();

    // Navigate each tab
    await tab1.goto('https://www.saucedemo.com/');
    await tab2.goto('https://jsonplaceholder.typicode.com/');
    await tab3.goto('https://jsonplaceholder.typicode.com/users');

    console.log('✅ 3 tabs opened!');

    // Assert all 3
    await expect(tab1).toHaveTitle(/Swag Labs/);
    console.log('✅ Tab 1: SauceDemo');

    await expect(tab2).toHaveTitle(/JSONPlaceholder/);
    console.log('✅ Tab 2: JSONPlaceholder');

    await expect(tab3).toHaveURL(/users/);
    console.log('✅ Tab 3: Users page');

    // Get all pages in context
    const allPages = context.pages();
    console.log(`✅ Total tabs open: ${allPages.length}`);
    expect(allPages.length).toBe(3);

    // Close all
    await tab1.close();
    await tab2.close();
    await tab3.close();
    console.log('✅ All tabs closed!');
  });

  // ── TEST 4: Share data between tabs ───────────────
  test('share localStorage between tabs', async ({ context }) => {

    const tab1 = await context.newPage();
    await tab1.goto('https://www.saucedemo.com/');

    // Set data in tab 1
    await tab1.evaluate(() => {
      localStorage.setItem('testKey', 'Hello from Tab 1!');
    });
    console.log('✅ Data set in Tab 1!');

    // Open tab 2 — same origin, shares localStorage
    const tab2 = await context.newPage();
    await tab2.goto('https://www.saucedemo.com/');

    // Read data in tab 2
    const value = await tab2.evaluate(() => {
      return localStorage.getItem('testKey');
    });

    expect(value).toBe('Hello from Tab 1!');
    console.log(`✅ Tab 2 read: "${value}"`);

    await tab1.close();
    await tab2.close();
  });

});