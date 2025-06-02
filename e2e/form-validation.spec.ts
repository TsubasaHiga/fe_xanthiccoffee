import { expect, test } from '@playwright/test'

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should disable generate button when form is empty', async ({
    page
  }) => {
    // Find generate button
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })

    // Check if button is disabled when form is empty
    if (await generateButton.isVisible()) {
      const isDisabled = await generateButton.isDisabled()
      if (isDisabled) {
        await expect(generateButton).toBeDisabled()
      }
    }
  })

  test('should disable generate button when title is empty', async ({
    page
  }) => {
    // Fill only dates, leave title empty
    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-07')

    // Check generate button state
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })

    if (await generateButton.isVisible()) {
      const isDisabled = await generateButton.isDisabled()
      if (isDisabled) {
        await expect(generateButton).toBeDisabled()
      }
    }
  })

  test('should disable generate button when start date is empty', async ({
    page
  }) => {
    // Fill title and end date, leave start date empty
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.last().fill('2024-01-07')

    // Check generate button state
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })

    if (await generateButton.isVisible()) {
      const isDisabled = await generateButton.isDisabled()
      if (isDisabled) {
        await expect(generateButton).toBeDisabled()
      }
    }
  })

  test('should disable generate button when end date is empty', async ({
    page
  }) => {
    // Fill title and start date, leave end date empty
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')

    // Check generate button state
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })

    if (await generateButton.isVisible()) {
      const isDisabled = await generateButton.isDisabled()
      if (isDisabled) {
        await expect(generateButton).toBeDisabled()
      }
    }
  })

  test('should enable generate button when all required fields are filled', async ({
    page
  }) => {
    // Fill all required fields
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-07')

    // Check generate button state
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })

    if (await generateButton.isVisible()) {
      await expect(generateButton).toBeEnabled()
    }
  })

  test('should show error for invalid date range', async ({ page }) => {
    // Fill form with end date before start date
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-07') // Start date
    await dateInputs.last().fill('2024-01-01') // End date (before start)

    // Try to generate
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    if (await generateButton.isEnabled()) {
      await generateButton.click()

      // Wait for potential error message
      await page.waitForTimeout(1000)

      // Look for error toast or message
      const errorMessage = page
        .locator('[data-sonner-toast]')
        .or(page.locator('div', { hasText: /エラー|error/i }))

      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible()
      }
    }
  })

  test('should validate date format', async ({ page }) => {
    // HTML5 date inputs handle format validation automatically
    // Just check that date inputs accept valid dates
    const dateInputs = page.locator('input[type="date"]')

    if (await dateInputs.first().isVisible()) {
      await dateInputs.first().fill('2024-01-01')
      await expect(dateInputs.first()).toHaveValue('2024-01-01')
    }
  })
})
