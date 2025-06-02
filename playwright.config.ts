import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['html'], ['github']]
    : [['html', { outputFolder: 'playwright-report' }], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_DEV_SERVER
      ? 'http://localhost:5173'
      : 'http://localhost:4173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshots on failure */
    screenshot: 'only-on-failure',

    /* Timeout for each test */
    actionTimeout: 30 * 1000,

    /* Grant clipboard permissions globally for all tests */
    permissions: ['clipboard-read', 'clipboard-write']
  },

  /* Global timeout for the entire test run */
  globalTimeout: process.env.CI ? 30 * 60 * 1000 : undefined,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },

    /* Run tests on Firefox and Safari only on CI or when explicitly requested */
    ...(process.env.CI || process.env.ALL_BROWSERS
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
          },

          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
          }
        ]
      : []),

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },

    ...(process.env.CI || process.env.ALL_BROWSERS
      ? [
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] }
          }
        ]
      : [])
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.PLAYWRIGHT_DEV_SERVER
    ? {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 120 * 1000
      }
    : {
        command: 'npm run preview',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000
      }
})
