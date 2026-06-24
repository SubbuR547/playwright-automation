import { Page, expect } from '@playwright/test';

export class ProductsPage {

  constructor(private page: Page) {}

  // Verify products page loaded
  async verifyPageLoaded() {
    await expect(
      this.page.locator('.title')
    ).toHaveText('Products');
    console.log('✅ Products page loaded!');
  }

  // Add product to cart by name
  async addProductToCart(productName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
    console.log(`✅ "${productName}" added to cart!`);
  }

  // Verify cart badge shows correct count
  async verifyCartCount(count: string) {
    await expect(
      this.page.locator('.shopping_cart_badge')
    ).toHaveText(count);
    console.log(`✅ Cart count is ${count}!`);
  }

  // Click cart icon to go to cart
  async goToCart() {
    await this.page.locator('.shopping_cart_link').click();
    console.log('✅ Navigated to cart!');
  }
}