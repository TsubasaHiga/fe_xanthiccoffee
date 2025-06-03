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
  /* Enable parallel tests on CI for better performance. Reduce workers per shard since we're using multiple shards */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['blob'], ['github']] // Use blob reporter for sharding support in CI
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

    /* Additional context options for better CI compatibility */
    ...(process.env.CI && {
      // Force headless mode in CI and ensure clipboard works
      headless: true
    })
  },

  /* Global timeout for the entire test run */
  globalTimeout: process.env.CI ? 30 * 60 * 1000 : undefined,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: ['clipboard-read', 'clipboard-write'],
        // Ensure clipboard permissions work in CI
        launchOptions: {
          args: process.env.CI
            ? [
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--allow-clipboard-access',
                '--enable-blink-features=UnsafeClipboardAPI'
              ]
            : []
        }
      }
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

    /* Test against mobile viewports - only Mobile Chrome in CI for faster execution */
    ...(process.env.CI
      ? [
          {
            name: 'Mobile Chrome',
            use: {
              ...devices['Pixel 5'],
              permissions: ['clipboard-read', 'clipboard-write'],
              // Ensure clipboard permissions work in CI for mobile tests too
              launchOptions: {
                args: process.env.CI
                  ? [
                      '--disable-web-security',
                      '--disable-features=VizDisplayCompositor',
                      '--allow-clipboard-access',
                      '--enable-blink-features=UnsafeClipboardAPI'
                    ]
                  : []
              }
            }
          }
        ]
      : [
          {
            name: 'Mobile Chrome',
            use: {
              ...devices['Pixel 5'],
              permissions: ['clipboard-read', 'clipboard-write'],
              // Ensure clipboard permissions work in CI for mobile tests too
              launchOptions: {
                args: process.env.CI
                  ? [
                      '--disable-web-security',
                      '--disable-features=VizDisplayCompositor',
                      '--allow-clipboard-access',
                      '--enable-blink-features=UnsafeClipboardAPI'
                    ]
                  : []
              }
            }
          }
        ])
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.PLAYWRIGHT_DEV_SERVER
    ? {
        command: 'pnpm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 120 * 1000
      }
    : {
        command: 'pnpm run preview',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000
      }
})
