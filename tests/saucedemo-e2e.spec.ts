import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import dotenv from 'dotenv';
dotenv.config();

test.describe('SauceDemo E2E Tests', () => {

  test('E2E - Login, Add to Cart, Checkout', async ({ page }) => {
    test.setTimeout(60000);

    // Create page objects
    const loginPage    = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage     = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1 - Login
    await loginPage.login(
      process.env.SAUCE_USERNAME!,
      process.env.SAUCE_PASSWORD!
    );
    console.log(' Step 1 - Logged in!');

    // Step 2 - Verify Products Page
    await productsPage.verifyPageLoaded();
    console.log(' Step 2 - Products page verified!');

    // Step 3 - Add products to cart
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.verifyCartCount('2');
    console.log(' Step 3 - Products added!');

    // Step 4 - Go to cart and verify
    await productsPage.goToCart();
    await cartPage.verifyProductInCart('Sauce Labs Backpack');
    await cartPage.verifyProductInCart('Sauce Labs Bike Light');
    await cartPage.verifyCartItemCount(2);
    console.log(' Step 4 - Cart verified!');

    // Step 5 - Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutDetails('John', 'Test', '12345');
    console.log(' Step 5 - Details filled!');

    // Step 6 - Verify order summary
    await checkoutPage.verifyOrderSummary('Sauce Labs Backpack');
    console.log(' Step 6 - Order summary verified!');

    // Step 7 - Complete order
    await checkoutPage.completeOrder();
    await checkoutPage.verifyOrderComplete();
    console.log(' Step 7 - Order complete!');
  });

  test('Invalid login shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('wrong_user', 'wrong_pass');
    await loginPage.verifyLoginError('Username and password do not match');
    console.log(' Error message verified!');
  });

});