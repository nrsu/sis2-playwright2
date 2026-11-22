import { defineConfig, devices } from '@playwright/test';

// GitHub Actions and GitLab set CI automatically; locally it is unset.
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // shards split tests, not whole files
  forbidOnly: isCI, // a forgotten test.only fails CI
  retries: isCI ? 2 : 0, // a flaky test is marked flaky, not red
  workers: isCI ? 2 : undefined, // GitHub runners have 2-4 vCPUs
  expect: { timeout: 15_000 }, // the demo site is slow from CI runners
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
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
