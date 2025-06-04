import { expect, test } from '@playwright/test'

test.describe('Basic Page Load and Navigation', () => {
  test('should load the main page successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the main title is present
    await expect(page.locator('h1')).toContainText('MarkDays')
  })

  test('should display DateSettings', async ({ page }) => {
    await page.goto('/')

    // Check that the settings card is visible
    await expect(
      page
        .locator('[data-testid="date-list-settings-card"]')
        .or(page.locator('form'))
    ).toBeVisible()
  })

  test('should display footer', async ({ page }) => {
    await page.goto('/')

    // Check that footer is present
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that the main title is still visible
    await expect(page.locator('h1')).toContainText('MarkDays')

    // Check that the page content is still accessible
    await expect(page.locator('body')).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // Check that the main title is still visible
    await expect(page.locator('h1')).toContainText('MarkDays')
  })
})
