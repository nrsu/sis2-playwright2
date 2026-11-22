import { test, expect } from '@playwright/test';

test('empty registration form shows errors', async ({ page }) => {
  await page.goto('/auth/register');
  await page.locator('[data-test=register-submit]').click();
  await expect(page.locator('[data-test=first-name-error]')).toBeVisible();
  await expect(page.locator('[data-test=email-error]')).toBeVisible();
  await expect(page.locator('[data-test=password-error]')).toBeVisible();
});

test('weak password is rejected', async ({ page }) => {
  await page.goto('/auth/register');
  await page.locator('[data-test=password]').fill('123');
  await page.locator('[data-test=register-submit]').click();
  await expect(page.locator('[data-test=password-error]')).toBeVisible();
});

test('new user can register', async ({ page }) => {
  const email = `sis2.${Date.now()}@example.com`; // unique, so the test is repeatable
  await page.goto('/auth/register');
  await page.locator('[data-test=first-name]').fill('Test');
  await page.locator('[data-test=last-name]').fill('User');
  await page.locator('[data-test=dob]').fill('1995-05-20');
  await page.locator('[data-test=street]').fill('1 Main St');
  await page.locator('[data-test=postal_code]').fill('12345');
  await page.locator('[data-test=city]').fill('Almaty');
  await page.locator('[data-test=state]').fill('Almaty');
  await page.locator('[data-test=country]').selectOption('KZ');
  await page.locator('[data-test=phone]').fill('0123456789');
  await page.locator('[data-test=email]').fill(email);
  await page.locator('[data-test=password]').fill('Str0ng!Passw0rd#2026');
  await page.locator('[data-test=register-submit]').click();
  await expect(page).toHaveURL(/\/auth\/login/);
});
