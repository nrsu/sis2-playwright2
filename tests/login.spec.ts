import { test, expect } from './fixtures';
import { login } from './helpers';

test('login with valid credentials', async ({ page, registeredUser }) => {
  await login(page, registeredUser.email, registeredUser.password);
  await expect(page.locator('[data-test=nav-menu]')).toBeVisible({ timeout: 30_000 }); 
  await expect(page.locator('[data-test=page-title]')).toHaveText('My account');
  await expect(page.locator('[data-test=nav-menu]')).toBeVisible(); // shown only when logged in
});

test('login with wrong password', async ({ page, registeredUser }) => {
  // our own throwaway account, so a failed login cannot lock a shared demo account
  await login(page, registeredUser.email, 'definitely-wrong-password');
  await expect(page.locator('[data-test=login-error]')).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login/);
});

test('login with empty fields shows validation', async ({ page }) => {
  await page.goto('/auth/login');
  await page.locator('[data-test=login-submit]').click();
  await expect(page.locator('[data-test=email-error]')).toBeVisible();
  await expect(page.locator('[data-test=password-error]')).toBeVisible();
});

test('logout', async ({ page, registeredUser }) => {
  await login(page, registeredUser.email, registeredUser.password);
  await expect(page).toHaveURL(/\/account$/);
  await page.locator('[data-test=nav-menu]').click();
  await page.locator('[data-test=nav-sign-out]').click();
  await expect(page).toHaveURL(/\/auth\/login/);
});
