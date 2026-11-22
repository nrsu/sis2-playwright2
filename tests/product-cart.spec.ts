import { test, expect } from '@playwright/test';
import { openFirstProduct, money } from './helpers';

test('product details page', async ({ page }) => {
  await openFirstProduct(page);
  await expect(page.locator('[data-test=unit-price]')).toBeVisible();
  await expect(page.locator('[data-test=add-to-cart]')).toBeEnabled();
});

test('add product to cart', async ({ page }) => {
  const name = await openFirstProduct(page);
  await page.locator('[data-test=add-to-cart]').click();
  await expect(page.locator('[data-test=cart-quantity]')).toHaveText('1');
  await page.locator('[data-test=nav-cart]').click();
  await expect(page.locator('[data-test=product-title]')).toContainText(name);
});

test('changing quantity updates the total', async ({ page }) => {
  await openFirstProduct(page);
  await page.locator('[data-test=add-to-cart]').click();
  await page.locator('[data-test=nav-cart]').click();
  const qty = page.locator('[data-test=product-quantity]');
  const updated = page.waitForResponse(
    (r) => r.url().includes('/carts/') && r.request().method() === 'PUT',
  );
  await qty.fill('3');
  await qty.press('Tab');
  await updated;
  const unit = money(await page.locator('[data-test=product-price]').first().innerText());
  const total = money(await page.locator('[data-test=cart-total]').innerText());
  expect(Math.abs(total - unit * 3)).toBeLessThan(0.01);
});

test('remove product from cart', async ({ page }) => {
  await openFirstProduct(page);
  await page.locator('[data-test=add-to-cart]').click();
  await page.locator('[data-test=nav-cart]').click();
  await page.locator('[data-test=delete]').first().click();
  await expect(page.getByText('The cart is empty')).toBeVisible();
});
