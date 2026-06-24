import { Page, expect } from '@playwright/test';

export class CartPage {

  constructor(private page: Page) {}

  // Verify specific product is in cart
  async verifyProductInCart(productName: string) {
    await expect(
      this.page.locator('.cart_item')
        .filter({ hasText: productName })
    ).toBeVisible();
    console.log(`✅ "${productName}" is in cart!`);
  }

  // Verify total number of items in cart
  async verifyCartItemCount(count: number) {
    await expect(
      this.page.locator('.cart_item')
    ).toHaveCount(count);
    console.log(`✅ Cart has ${count} items!`);
  }

  // Click checkout button
  async proceedToCheckout() {
    await this.page
      .getByRole('button', { name: 'Checkout' })
      .click();
    console.log('✅ Proceeded to checkout!');
  }

  // Remove product from cart
  async removeProductFromCart(productName: string) {
    await this.page
      .locator('.cart_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
    console.log(`✅ "${productName}" removed from cart!`);
  }

  // Continue shopping
  async continueShopping() {
    await this.page
      .getByRole('button', { name: 'Continue Shopping' })
      .click();
    console.log('✅ Continued shopping!');
  }
}