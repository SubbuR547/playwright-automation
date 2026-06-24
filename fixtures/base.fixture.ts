import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import dotenv from 'dotenv';
dotenv.config();

// Step 1 — Define what fixtures we want
type MyFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loggedInPage: Page;
};

// Step 2 — Create custom test with fixtures
export const test = base.extend<MyFixtures>({

  // Fixture 1 — LoginPage
  loginPage: async ({ page }, use) => {
    console.log('🔧 Setup: Creating LoginPage');
    const loginPage = new LoginPage(page);
    await use(loginPage);           // give to test
    console.log('🧹 Teardown: LoginPage done');
  },

  // Fixture 2 — ProductsPage
  productsPage: async ({ page }, use) => {
    console.log('🔧 Setup: Creating ProductsPage');
    const productsPage = new ProductsPage(page);
    await use(productsPage);        // give to test
    console.log('🧹 Teardown: ProductsPage done');
  },

  // Fixture 3 — CartPage
  cartPage: async ({ page }, use) => {
    console.log('🔧 Setup: Creating CartPage');
    const cartPage = new CartPage(page);
    await use(cartPage);            // give to test
    console.log('🧹 Teardown: CartPage done');
  },

  // Fixture 4 — CheckoutPage
  checkoutPage: async ({ page }, use) => {
    console.log('🔧 Setup: Creating CheckoutPage');
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);        // give to test
    console.log('🧹 Teardown: CheckoutPage done');
  },

  // Fixture 5 — Already logged in page!
  loggedInPage: async ({ page }, use) => {
    console.log('🔧 Setup: Logging in automatically');
    const loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.SAUCE_USERNAME!,
      process.env.SAUCE_PASSWORD!
    );
    console.log('✅ Logged in automatically!');
    await use(page);                // give logged in page to test
    console.log('🧹 Teardown: Logging out');
    await page.goto('https://www.saucedemo.com/');
  },

});

// Export expect too so tests can use it
export { expect } from '@playwright/test';