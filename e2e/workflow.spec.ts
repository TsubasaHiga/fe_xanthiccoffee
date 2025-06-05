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

    // Step 5: Replace wait with explicit card appearance wait
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1500 })

    // The generated content should contain the title and some date information
    const pageContent = await page.locator('body').textContent()
    expect(pageContent).toContain(testData.validForm.title)

    // Step 6: Test copy functionality if available
    const copyButton = page.locator(selectors.copyButton).first()
    if (await copyButton.isVisible()) {
      await copyButton.click()

      // Step 6: Replace toast wait with explicit appearance wait
      const toast = page
        .locator('[data-sonner-toast], div:has-text("コピー")')
        .first()
      await expect(toast).toBeVisible({ timeout: 1200 })
    }

    // Step 7: Test reset functionality
    const resetButton = page.locator(selectors.resetButton)
    if (await resetButton.isVisible()) {
      await resetButton.click()

      // Verify form is reset
      await expect(titleInput).toHaveValue('Schedule')
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

    // 1500ms wait replaced with explicit card appearance wait
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1200 })

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

    // 1500ms wait replaced with explicit card appearance wait
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1200 })

    // Verify it works on mobile
    const pageContent = await page.locator('body').textContent()
    expect(pageContent).toContain('モバイルテスト')

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()

    // Should still work on desktop
    await expect(page.locator('h1')).toContainText('MarkDays')
  })

  test('should complete workflow using preset functionality', async ({
    page
  }) => {
    await page.goto('/')

    // Step 1: Fill title
    const titleInput = page.locator(selectors.titleInput).first()
    await titleInput.fill('プリセットテスト')

    // Step 2: Fill start date
    const dateInputs = page.locator(selectors.dateInputs)
    await dateInputs.first().fill('2024-01-01')

    // Step 3: Use preset to set end date (default is "開始日から")
    const twoWeekButton = page.locator('button', { hasText: '2週間' })
    await twoWeekButton.click()

    // Step 4: Verify end date was set by preset
    const endDateValue = await dateInputs.last().inputValue()
    expect(endDateValue).toBe('2024-01-15') // 2 weeks from start date

    // Step 5: Verify preset button is highlighted
    await expect(twoWeekButton).toHaveClass(/bg-blue-600|default/)

    // Step 6: Generate list
    const generateButton = page.locator(selectors.generateButton)
    await generateButton.click()

    // Step 7: Verify generated content appears
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1500 })
  })

  test('should complete workflow using "終了日から" preset', async ({
    page
  }) => {
    await page.goto('/')

    // Step 1: Fill title
    const titleInput = page.locator(selectors.titleInput).first()
    await titleInput.fill('終了日からテスト')

    // Step 2: Fill end date
    const dateInputs = page.locator(selectors.dateInputs)
    await dateInputs.last().fill('2024-01-31')

    // Step 3: Change preset base to "終了日から"
    const presetBaseSelect = page.locator('button[role="combobox"]').first()
    await presetBaseSelect.click()
    await page.locator('[role="option"]', { hasText: '終了日から' }).click()

    // Step 4: Use preset to set start date
    const oneMonthButton = page.locator('button', { hasText: '1ヶ月' })
    await oneMonthButton.click()

    // Step 5: Verify start date was set by preset
    const startDateValue = await dateInputs.first().inputValue()
    expect(startDateValue).toBe('2023-12-31') // 1 month before end date

    // Step 6: Generate list
    const generateButton = page.locator(selectors.generateButton)
    await generateButton.click()

    // Step 7: Verify generated content appears
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1500 })
  })
})
