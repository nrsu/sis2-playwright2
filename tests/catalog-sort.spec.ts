import { test, expect } from '@playwright/test';
import { money } from './helpers';

test('catalog shows products', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.card').first()).toBeVisible();
  expect(await page.locator('.card').count()).toBeGreaterThan(0);
});

test('sort by price low to high', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.card').first()).toBeVisible();
  await page.locator('[data-test=sort]').selectOption('price,asc');
  // poll until the list is re-rendered in ascending order
  await expect
    .poll(async () => {
      const prices = (await page.locator('[data-test=product-price]').allInnerTexts()).map(money);
      return prices.length > 1 && prices.every((p, i) => i === 0 || prices[i - 1] <= p);
    })
    .toBe(true);
});

test('sort by name A-Z', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.card').first()).toBeVisible();
  await page.locator('[data-test=sort]').selectOption('name,asc');
  await expect
    .poll(async () => {
      const names = (await page.locator('[data-test=product-name]').allInnerTexts()).map((n) =>
        n.trim().toLowerCase(),
      );
      return names.length > 1 && names.every((n, i) => i === 0 || names[i - 1] <= n);
    })
    .toBe(true);
});

test('pagination: next page', async ({ page }) => {
  await page.goto('/');
  const firstName = page.locator('[data-test=product-name]').first();
  await expect(firstName).toBeVisible();
  const before = (await firstName.innerText()).trim();
  // pagination links may be <a> without href (no "link" role), so use CSS + text
  await page
    .locator('[class*=pagination] a, [class*=pagination] button')
    .filter({ hasText: /^\s*(2|next|»|›)\s*$/i })
    .or(page.locator('a[aria-label*=next i], button[aria-label*=next i]'))
    .or(page.locator('a[aria-label*=page-2 i], a[aria-label*="page 2" i]'))
    .first()
    .click();
  await expect(firstName).not.toHaveText(before);
});
