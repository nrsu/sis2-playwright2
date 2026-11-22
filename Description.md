# SIS 2 — Test Automation with Playwright + CI pipeline

**Site under test:** https://practicesoftwaretesting.com/ (Toolshop demo)
**Stack:** Playwright Test, TypeScript. CI: GitHub Actions (4 shards + report merge).

## What is automated
Core user flows of the web shop in 5 suites (18 test cases), using stable `data-test` locators and Playwright auto-waiting / `waitForResponse` instead of fixed sleeps.

| Suite | File | Test cases |
|---|---|---|
| 1. Login | `tests/login.spec.ts` | valid login; wrong password; empty fields validation; logout |
| 2. Registration | `tests/registration.spec.ts` | empty form errors; weak password rejected; successful registration (unique email) |
| 3. Search | `tests/search.spec.ts` | existing product; no results; reset search |
| 4. Catalog sort/pagination | `tests/catalog-sort.spec.ts` | products shown; price asc; name A-Z; next page |
| 5. Product & Cart | `tests/product-cart.spec.ts` | product details; add to cart; change quantity -> total; remove from cart |

## CI pipeline (this assignment)
| Requirement | Where |
|---|---|
| 1. Runs on every push and PR | `on: push`, `on: pull_request` in `.github/workflows/playwright.yml` |
| 2. Cached deps, browsers, full suite | `setup-node` `cache: npm`, `npm ci`, `npx playwright install --with-deps chromium`, `npx playwright test --shard=…` (no filters) |
| 3. HTML report + traces as artefacts ≥ 7 days | `playwright-report`, `test-results-N` with `retention-days: 14`; `trace: 'on-first-retry'` |
| 4. CI-specific config | `playwright.config.ts`: `forbidOnly`, `retries: 2`, `junit` when `CI` is set |
| 5. Parallelism + before/after | 4-shard matrix + `merge-reports` job; table in README |
| 6. Status badge for main | README, top of the CI section |

## How to run
```
npm ci
npx playwright install --with-deps chromium
npx playwright test
```
