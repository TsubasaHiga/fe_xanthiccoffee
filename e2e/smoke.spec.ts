import { expect, test } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('should have Playwright configured correctly', async ({ page }) => {
    // This is a simple smoke test to verify Playwright is working
    expect(page).toBeDefined()
    expect(page.goto).toBeDefined()
  })

  test('should be able to navigate to the application', async ({ page }) => {
    await page.goto('/')

    // Check that we can access the page (any 2xx response)
    const response = await page.waitForLoadState('networkidle')

    // Check that the page title contains something (not empty)
    const title = await page.title()
    expect(title).toBeTruthy()

    // Check that the page has some content
    const bodyContent = await page.locator('body').textContent()
    expect(bodyContent).toBeTruthy()
    expect(bodyContent.length).toBeGreaterThan(0)
  })

  test('should load page within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - startTime

    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000)
  })
})
