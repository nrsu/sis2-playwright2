import { test, expect, Page } from '@playwright/test';

async function search(page: Page, term: string) {
  await page.goto('/');
  await page.locator('[data-test=search-query]').fill(term);
  await page.locator('[data-test=search-submit]').click();
}

test('search finds an existing product', async ({ page }) => {
  await search(page, 'Pliers');
  await expect(page.locator('[data-test=search_completed]')).toBeVisible();
  await expect(page.locator('[data-test=product-name]').first()).toContainText('Pliers');
});

test('search with no results', async ({ page }) => {
  await search(page, 'zzzxxyyqq');
  await expect(page.locator('[data-test=no-results]')).toContainText('There are no products found');
});

test('reset clears the search query', async ({ page }) => {
  await search(page, 'Hammer');
  await expect(page.locator('[data-test=search_completed]')).toBeVisible();
  await page.locator('[data-test=search-reset]').click();
  await expect(page.locator('[data-test=search-query]')).toHaveValue('');
});
