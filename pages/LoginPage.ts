import { Page, expect } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
    // Wait for page to fully load before interacting
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string) {
    await this.goto();
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    // Use data-test attribute — more reliable than getByRole
    await this.page.locator('[data-test="login-button"]').click();
    // Wait for navigation after login attempt
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLoginError(errorText: string) {
    await expect(
      this.page.locator('[data-test="error"]')
    ).toContainText(errorText);
    console.log(' Error message verified!');
  }
} 