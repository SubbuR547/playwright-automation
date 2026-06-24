import { Page, expect } from '@playwright/test';

export class CheckoutPage {

  constructor(private page: Page) {}

  // Fill checkout form details
  async fillCheckoutDetails(
    firstName: string,
    lastName: string,
    zipCode: string
  ) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(zipCode);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    console.log('✅ Checkout details filled!');
  }

  // Verify order summary before finishing
  async verifyOrderSummary(productName: string) {
    await expect(
      this.page.locator('.cart_item')
        .filter({ hasText: productName })
    ).toBeVisible();
    console.log(`✅ "${productName}" in order summary!`);
  }

  // Click finish button to complete order
  async completeOrder() {
    await this.page
      .getByRole('button', { name: 'Finish' })
      .click();
    console.log('✅ Order finished!');
  }

  // Verify order completed successfully
  async verifyOrderComplete() {
    await expect(
      this.page.locator('.complete-header')
    ).toHaveText('Thank you for your order!');
    console.log('✅ Order completed successfully!');
  }

  // Verify total price shown
  async verifyTotalPrice(price: string) {
    await expect(
      this.page.locator('.summary_total_label')
    ).toContainText(price);
    console.log(`✅ Total price is ${price}!`);
  }
}