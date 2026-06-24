import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Hybrid Testing — API + UI', () => {
  test.setTimeout(60000);

  test('create post via API — verify via UI', async ({ request, page }) => {

    const response = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        data: {
          title: 'My Test Post',
          body: 'Created via API',
          userId: 1
        }
      }
    );

    expect(response.status()).toBe(201);
    const post = await response.json();
    console.log(`✅ API: Post created with ID: ${post.id}`);
    console.log(`✅ API: Title: ${post.title}`);

    expect(post.title).toBe('My Test Post');
    expect(post.userId).toBe(1);
    expect(post.id).toBeTruthy();
    console.log('✅ API assertions passed!');

    await page.goto('https://jsonplaceholder.typicode.com/');

    await expect(
      page,
      '🔴 Must be on JSONPlaceholder site'
    ).toHaveTitle(/JSONPlaceholder/);
    console.log('✅ UI: Page loaded!');

    await expect(
      page.getByRole('link', { name: 'JSONPlaceholder' }),
      '🔴 Site header must be visible'
    ).toBeVisible();
    console.log('✅ UI: Header visible!');
  });

  test('fetch user via API — use data in UI', async ({ request, page }) => {

    const response = await request.get(
      'https://jsonplaceholder.typicode.com/users/1'
    );

    expect(response.status()).toBe(200);
    const user = await response.json();
    console.log(`✅ API: Got user: ${user.name}`);
    console.log(`✅ API: Email: ${user.email}`);

    expect(user.name).toBeTruthy();
    expect(user.email).toContain('@');
    expect(user.id).toBe(1);
    console.log('✅ API assertions passed!');

    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]')
      .click({ force: true });

    await expect(page).toHaveURL(/inventory/);
    console.log('✅ UI: Logged in to SauceDemo!');

    const productCount = await page
      .locator('.inventory_item').count();
    console.log(`✅ UI: Found ${productCount} products!`);

    expect(user.id).toBeLessThan(productCount);
    console.log(`✅ Hybrid: API user ID (${user.id}) < UI products (${productCount})!`);
  });

  test('API setup — UI verification', async ({ request, page }) => {

    const createResponse = await request.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        data: {
          title: 'Playwright Hybrid Test',
          body: 'API + UI working together',
          userId: 1
        }
      }
    );

    const newPost = await createResponse.json();
    expect(createResponse.status()).toBe(201);
    console.log(`✅ API Setup: Created post ID ${newPost.id}`);

    // Fetch real existing post
    const getResponse = await request.get(
      'https://jsonplaceholder.typicode.com/posts/1'
    );

    expect(getResponse.status()).toBe(200);
    console.log('✅ API: Fetched post back!');

    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username')
      .fill(process.env.SAUCE_USERNAME!);
    await page.getByPlaceholder('Password')
      .fill(process.env.SAUCE_PASSWORD!);
    await page.locator('[data-test="login-button"]')
      .click({ force: true });

    await expect(page).toHaveURL(/inventory/);
    console.log('✅ UI: Logged in!');

    await page
      .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
      .click();

    const cartBadge = await page
      .locator('.shopping_cart_badge').innerText();

    expect(Number(cartBadge)).toBe(newPost.userId);
    console.log(`✅ Hybrid: Cart (${cartBadge}) matches API userId (${newPost.userId})!`);
  });

});