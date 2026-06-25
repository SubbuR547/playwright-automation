import { Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// ── Login helper ──────────────────────────────────
export async function loginToSauceDemo(page: Page) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username')
    .fill(process.env.SAUCE_USERNAME!);
  await page.getByPlaceholder('Password')
    .fill(process.env.SAUCE_PASSWORD!);
  await page.locator('[data-test="login-button"]')
    .click({ force: true });
}

// ── Cart helper ───────────────────────────────────
export async function addProductToCart(
  page: Page,
  productId: string
) {
  await page.locator(`[data-test="add-to-cart-${productId}"]`)
    .click();
}

export async function getCartCount(page: Page): Promise<number> {
  const badge = page.locator('.shopping_cart_badge');
  const visible = await badge.isVisible();
  if (!visible) return 0;
  return Number(await badge.innerText());
}

// ── API helper ────────────────────────────────────
export function buildApiUrl(path: string): string {
  return `https://jsonplaceholder.typicode.com${path}`;
}

// ── Random data helper ────────────────────────────
export function randomString(length: number = 8): string {
  return Math.random().toString(36).substring(2, length + 2);
}

export function randomEmail(): string {
  return `test.${randomString()}@example.com`;
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}