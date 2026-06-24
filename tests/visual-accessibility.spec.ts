import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login } from './orangehrm-login.spec';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Visual & Accessibility — OrangeHRM', () => {
  test.setTimeout(60000);

  // ── VISUAL TESTS ──────────────────────────────────

  test('1. Login page visual snapshot', async ({ page }) => {
    await page.goto(
      'https://opensource-demo.orangehrmlive.com/'
    );
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveScreenshot(
      'orangehrm-login.png',
      { maxDiffPixels: 300, threshold: 0.3 }
    );
    console.log('✅ Login page snapshot verified!');
  });

  test('2. Save manual screenshots', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('domcontentloaded');

    await page.screenshot({
      path: 'screenshots/orangehrm-dashboard-full.png',
      fullPage: true
    });
    console.log('✅ Full page screenshot saved!');

    await page.locator('.oxd-sidepanel').screenshot({
      path: 'screenshots/orangehrm-sidebar.png'
    });
    console.log('✅ Sidebar screenshot saved!');
  });

  // ── ACCESSIBILITY TESTS ───────────────────────────

  test('3. Login page accessibility scan',
    async ({ page }) => {

    await page.goto(
      'https://opensource-demo.orangehrmlive.com/'
    );
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page }).analyze();

    console.log('Total violations:', results.violations.length);
    results.violations.forEach(v => {
      console.log(`❌ ${v.id} (${v.impact}): ${v.description}`);
    });
    console.log('Total passes:', results.passes.length);
    console.log('✅ Login accessibility scanned!');
  });

  test('4. Check specific rules', async ({ page }) => {
    await page.goto(
      'https://opensource-demo.orangehrmlive.com/'
    );
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withRules([
        'color-contrast',
        'image-alt',
        'label',
        'html-has-lang',
        'button-name',
      ])
      .analyze();

    console.log('─── VIOLATIONS ───');
    results.violations.forEach(v => {
      console.log(`❌ ${v.id} (${v.impact})`);
      console.log(`   ${v.description}`);
    });

    console.log('─── PASSES ───');
    results.passes.forEach(p => {
      console.log(`✅ ${p.id}`);
    });
    console.log('✅ Specific rules checked!');
  });

  test('5. Keyboard navigation', async ({ page }) => {
    await page.goto(
      'https://opensource-demo.orangehrmlive.com/'
    );
    await page.waitForLoadState('domcontentloaded');

    await page.keyboard.press('Tab');
    const usernameInput = page.getByRole('textbox').nth(0);
    await expect(usernameInput).toBeFocused();
    console.log('✅ Tab 1 — Username focused!');

    await page.keyboard.press('Tab');
    const passwordInput = page.getByRole('textbox').nth(1);
    await expect(passwordInput).toBeFocused();
    console.log('✅ Tab 2 — Password focused!');

    await page.keyboard.press('Tab');
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeFocused();
    console.log('✅ Tab 3 — Login button focused!');

    console.log('✅ Keyboard navigation works!');
  });

  test('6. Color contrast check', async ({ page }) => {
    await page.goto(
      'https://opensource-demo.orangehrmlive.com/'
    );
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    console.log(
      'Color contrast violations:',
      results.violations.length
    );
    if (results.violations.length === 0) {
      console.log('✅ Color contrast is good!');
    } else {
      results.violations.forEach(v => {
        console.log(`❌ ${v.id}: ${v.description}`);
      });
    }
  });

  test('7. Images have alt text', async ({ page }) => {
    await login(page);
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze();

    if (results.violations.length === 0) {
      console.log('✅ All images have alt text!');
    } else {
      results.violations.forEach(v => {
        console.log('❌ Image missing alt:', v.nodes[0].html);
      });
    }
  });

  test('8. Dashboard accessibility scan',
    async ({ page }) => {

    await login(page);
    await page.waitForLoadState('domcontentloaded');

    const results = await new AxeBuilder({ page })
      .exclude('.oxd-sidepanel')
      .analyze();

    console.log(
      'Dashboard violations:',
      results.violations.length
    );
    results.violations.forEach(v => {
      console.log(`❌ ${v.id} (${v.impact}): ${v.description}`);
    });
    console.log('✅ Dashboard accessibility scanned!');
  });

});