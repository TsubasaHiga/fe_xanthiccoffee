import { expect, test } from '@playwright/test'
import { selectors, testData } from './test-data'

test.describe('Complete User Flow', () => {
  test('should complete a full date list generation workflow', async ({
    page
  }) => {
    await page.goto('/')

    // Step 1: Verify page loaded
    await expect(page.locator('h1')).toContainText('MarkDays')

    // Step 2: Fill the form with valid data
    const titleInput = page.locator(selectors.titleInput).first()
    await titleInput.fill(testData.validForm.title)

    const dateInputs = page.locator(selectors.dateInputs)
    await dateInputs.first().fill(testData.validForm.startDate)
    await dateInputs.last().fill(testData.validForm.endDate)

    // Step 3: Verify form is filled correctly
    await expect(titleInput).toHaveValue(testData.validForm.title)
    await expect(dateInputs.first()).toHaveValue(testData.validForm.startDate)
    await expect(dateInputs.last()).toHaveValue(testData.validForm.endDate)

    // Step 4: Generate the list
    const generateButton = page.locator(selectors.generateButton)
    await expect(generateButton).toBeEnabled()
    await generateButton.click()

    // Step 5: Wait for list generation and verify content
    await page.waitForTimeout(2000)

    // The generated content should contain the title and some date information
    const pageContent = await page.locator('body').textContent()
    expect(pageContent).toContain(testData.validForm.title)

    // Step 6: Test copy functionality if available
    const copyButton = page.locator(selectors.copyButton).first()
    if (await copyButton.isVisible()) {
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write'])
      await copyButton.click()

      // Wait for potential toast notification
      await page.waitForTimeout(1000)
    }

    // Step 7: Test reset functionality
    const resetButton = page.locator(selectors.resetButton)
    if (await resetButton.isVisible()) {
      await resetButton.click()

      // Verify form is reset
      await expect(titleInput).toHaveValue('')
    }
  })

  test('should handle different form configurations', async ({ page }) => {
    await page.goto('/')

    // Test with short period
    const titleInput = page.locator(selectors.titleInput).first()
    await titleInput.fill(testData.shortPeriodForm.title)

    const dateInputs = page.locator(selectors.dateInputs)
    await dateInputs.first().fill(testData.shortPeriodForm.startDate)
    await dateInputs.last().fill(testData.shortPeriodForm.endDate)

    const generateButton = page.locator(selectors.generateButton)
    await generateButton.click()

    await page.waitForTimeout(1500)

    // Verify content was generated
    const pageContent = await page.locator('body').textContent()
    expect(pageContent).toContain(testData.shortPeriodForm.title)
  })

  test('should work across different viewports', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const titleInput = page.locator(selectors.titleInput).first()
    await titleInput.fill('モバイルテスト')

    const dateInputs = page.locator(selectors.dateInputs)
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-03')

    const generateButton = page.locator(selectors.generateButton)
    await generateButton.click()

    await page.waitForTimeout(1500)

    // Verify it works on mobile
    const pageContent = await page.locator('body').textContent()
    expect(pageContent).toContain('モバイルテスト')

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()

    // Should still work on desktop
    await expect(page.locator('h1')).toContainText('MarkDays')
  })
})
