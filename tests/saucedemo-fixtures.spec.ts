import { test, expect } from '../fixtures/base.fixture';

test.describe('SauceDemo Fixture Tests', () => {
test.setTimeout(60000);
  // Test 1 — Uses loginPage fixture
  test('invalid login shows error', async ({ loginPage }) => {
    await loginPage.login('wrong_user', 'wrong_pass');
    await loginPage.verifyLoginError('Username and password do not match');
    console.log(' Error verified!');
  });

  // Test 2 — Uses loggedInPage fixture
  // Already logged in automatically!
  test('products page loaded', async ({ loggedInPage, productsPage }) => {
    await productsPage.verifyPageLoaded();
    console.log(' Products page verified!');
  });

  // Test 3 — Uses multiple fixtures
  test('add product to cart', async ({ loggedInPage, productsPage }) => {
    await productsPage.verifyPageLoaded();
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.verifyCartCount('1');
    console.log(' Product added to cart!');
  });

  // Test 4 — Full E2E using fixtures
  test('full checkout flow', async ({
    loggedInPage,
    productsPage,
    cartPage,
    checkoutPage
  }) => {
    // Already logged in!
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.goToCart();
    await cartPage.verifyProductInCart('Sauce Labs Backpack');
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutDetails('John', 'Test', '12345');
    await checkoutPage.completeOrder();
    await checkoutPage.verifyOrderComplete();
    console.log(' Checkout complete!');
  });

});