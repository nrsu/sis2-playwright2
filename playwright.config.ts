import { defineConfig, devices } from '@playwright/test';

// GitHub Actions and GitLab set CI automatically; locally it is unset.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // shards split tests, not whole files
  forbidOnly: isCI, // a forgotten test.only fails CI
  retries: isCI ? 2 : 0, // a flaky test is marked flaky, not red
  workers: isCI ? 2 : undefined, // GitHub runners have 2-4 vCPUs
  timeout: 60_000, // the public demo site is slow (a login can take ~10 s)
  expect: { timeout: 15_000 },
  reporter: isCI
    ? [
        ['list'],
        ['blob'], // for merging shards
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    trace: 'on-first-retry', // trace recorded on the first retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
