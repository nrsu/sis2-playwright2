import { test, expect } from '@playwright/test';
import { login, loginAsCustomer, USER, PASSWORD } from './helpers';

test('login with valid credentials', async ({ page }) => {
  await login(page, USER, PASSWORD);
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.locator('[data-test=page-title]')).toHaveText('My account');
  await expect(page.locator('[data-test=nav-menu]')).toBeVisible(); // shown only when logged in
});

test('login with wrong password', async ({ page }) => {
  await login(page, USER, 'wrong-password');
  await expect(page.locator('[data-test=login-error]')).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login/);
});

test('login with empty fields shows validation', async ({ page }) => {
  await page.goto('/auth/login');
  await page.locator('[data-test=login-submit]').click();
  await expect(page.locator('[data-test=email-error]')).toBeVisible();
  await expect(page.locator('[data-test=password-error]')).toBeVisible();
});

test('logout', async ({ page }) => {
  await loginAsCustomer(page);
  await page.locator('[data-test=nav-menu]').click();
  await page.locator('[data-test=nav-sign-out]').click();
  await expect(page).toHaveURL(/\/auth\/login/);
});
