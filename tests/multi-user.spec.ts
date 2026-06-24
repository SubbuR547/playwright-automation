import { test, expect, Browser } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Multi-User Testing', () => {
  test.setTimeout(60000);

  // ── TEST 1: Two users — separate contexts ─────────
  test('two users — isolated sessions', async ({ browser }) => {

    // User A context — completely isolated!
    const userAContext = await browser.newContext();
    const userAPage = await userAContext.newPage();

    // User B context — different session!
    const userBContext = await browser.newContext();
    const userBPage = await userBContext.newPage();

    // User A logs in
    await userAPage.goto('https://www.saucedemo.com/');
    await userAPage.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await userAPage.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await userAPage.locator('[data-test="login-button"]')
      .click({ force: true });
    await expect(userAPage).toHaveURL(/inventory/);
    console.log('✅ User A logged in!');

    // User B stays on login page — different session!
    await userBPage.goto('https://www.saucedemo.com/');
    await expect(userBPage).toHaveURL('https://www.saucedemo.com/');
    console.log('✅ User B on login page — different session!');

    // Prove isolation — User A is logged in
    await expect(
      userAPage.locator('.inventory_list')
    ).toBeVisible();
    console.log('✅ User A sees products!');

    // User B not logged in — no products
    await expect(
      userBPage.locator('.inventory_list')
    ).not.toBeVisible();
    console.log('✅ User B does NOT see products!');

    // Cleanup
    await userAContext.close();
    await userBContext.close();
  });

  // ── TEST 2: Admin + Regular User ──────────────────
  test('standard user vs locked user', async ({ browser }) => {

    // Standard user context
    const standardContext = await browser.newContext();
    const standardPage = await standardContext.newPage();

    // Locked user context
    const lockedContext = await browser.newContext();
    const lockedPage = await lockedContext.newPage();

    // Standard user logs in
    await standardPage.goto('https://www.saucedemo.com/');
    await standardPage.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await standardPage.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await standardPage.locator('[data-test="login-button"]')
      .click({ force: true });
    await expect(standardPage).toHaveURL(/inventory/);
    console.log('✅ Standard user logged in!');

    // Locked user tries to login
    await lockedPage.goto('https://www.saucedemo.com/');
    await lockedPage.getByPlaceholder('Username')
      .fill('locked_out_user');
    await lockedPage.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await lockedPage.locator('[data-test="login-button"]')
      .click({ force: true });

    // Locked user blocked!
    await expect(lockedPage).not.toHaveURL(/inventory/);
    await expect(
      lockedPage.locator('[data-test="error-button"]')
    ).toBeVisible();
    console.log('✅ Locked user blocked!');

    // Standard user can access products
    const productCount = await standardPage
      .locator('.inventory_item').count();
    expect(productCount).toBe(6);
    console.log(`✅ Standard user sees ${productCount} products!`);

    // Cleanup
    await standardContext.close();
    await lockedContext.close();
  });

  // ── TEST 3: Two users — same site different carts ─
  test('two users have separate carts', async ({ browser }) => {

    // User A
    const userACtx = await browser.newContext();
    const userAPage = await userACtx.newPage();

    // User B
    const userBCtx = await browser.newContext();
    const userBPage = await userBCtx.newPage();

    // Both login
    for (const page of [userAPage, userBPage]) {
      await page.goto('https://www.saucedemo.com/');
      await page.getByPlaceholder('Username')
        .fill(process.env.SAUCE_USERNAME!);
      await page.getByPlaceholder('Password')
        .fill(process.env.SAUCE_PASSWORD!);
      await page.locator('[data-test="login-button"]')
        .click({ force: true });
      await expect(page).toHaveURL(/inventory/);
    }
    console.log('✅ Both users logged in!');

    // User A adds 2 items
    await userAPage
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();
    await userAPage
      .locator('[data-test="add-to-cart-sauce-labs-bike-light"]')
      .click();

    // User B adds 1 item
    await userBPage
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    // Assert separate carts!
    const userACart = await userAPage
      .locator('.shopping_cart_badge').innerText();
    const userBCart = await userBPage
      .locator('.shopping_cart_badge').innerText();

    expect(Number(userACart)).toBe(2);
    expect(Number(userBCart)).toBe(1);

    console.log(`✅ User A cart: ${userACart} items!`);
    console.log(`✅ User B cart: ${userBCart} items!`);
    console.log('✅ Carts are completely separate!');

    await userACtx.close();
    await userBCtx.close();
  });

});