import { Page, expect } from '@playwright/test';

export const USER = 'customer@practicesoftwaretesting.com';
export const PASSWORD = 'welcome01';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.locator('[data-test=email]').fill(email);
  await page.locator('[data-test=password]').fill(password);
  await page.locator('[data-test=login-submit]').click();
}

export async function loginAsCustomer(page: Page) {
  await login(page, USER, PASSWORD);
  await expect(page).toHaveURL(/\/account$/);
}

export async function openFirstProduct(page: Page): Promise<string> {
  await page.goto('/');
  const first = page.locator('[data-test=product-name]').first();
  const name = (await first.innerText()).trim();
  await first.click();
  await expect(page.locator('[data-test=product-name]')).toHaveText(name);
  return name;
}

export const money = (s: string) => parseFloat(s.replace(/[$,\s]/g, ''));
