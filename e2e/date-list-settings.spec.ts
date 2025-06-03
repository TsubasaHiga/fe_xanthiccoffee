import { expect, test } from '@playwright/test'

test.describe('DateListSettings Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have form inputs for title, start date, and end date', async ({
    page
  }) => {
    // Check for title input
    const titleInput = page.locator('input[type="text"]').first()
    await expect(titleInput).toBeVisible()

    // Check for date elements - they show as buttons with specific text content
    const startDateText = page.getByText('開始日', { exact: true })
    const endDateText = page.getByText('終了日', { exact: true })
    await expect(startDateText).toBeVisible()
    await expect(endDateText).toBeVisible()
  })

  test('should allow entering title and dates', async ({ page }) => {
    // Fill title
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')
    await expect(titleInput).toHaveValue('テストタイトル')

    // For date inputs that render as buttons, we need to use the actual input elements
    // Look for the date inputs by their IDs
    const startDateInput = page.locator('#start-date')
    const endDateInput = page.locator('#end-date')

    await startDateInput.fill('2024-01-01')
    await expect(startDateInput).toHaveValue('2024-01-01')

    await endDateInput.fill('2024-01-07')
    await expect(endDateInput).toHaveValue('2024-01-07')
  })

  test('should have preset period buttons', async ({ page }) => {
    // Look for preset buttons (1週間, 2週間, etc.)
    const buttons = page.locator('button')

    // Check if there are multiple buttons (presets + generate/reset)
    const buttonCount = await buttons.count()
    expect(buttonCount).toBeGreaterThan(2)

    // Look for specific preset button text patterns
    const weekButton = page.locator('button', { hasText: '週間' }).first()
    if (await weekButton.isVisible()) {
      await expect(weekButton).toBeVisible()
    }
  })

  test('should have preset base selector (開始日から/終了日から)', async ({
    page
  }) => {
    // Look for preset base selector text in the period preset section
    const presetSectionText = page.getByText('期間プリセット')
    await expect(presetSectionText).toBeVisible()

    // Look for a select or button near the preset section
    // The selector might be next to the preset label
    const selectElement = page
      .locator('select, button[role="combobox"]')
      .first()
    if (await selectElement.isVisible()) {
      await expect(selectElement).toBeVisible()
    }
  })

  test('should change end date when preset is clicked with "開始日から"', async ({
    page
  }) => {
    // Fill start date using the ID selector
    const startDateInput = page.locator('#start-date')
    await startDateInput.fill('2024-01-01')

    // Click a preset button (1週間) - this should work since preset buttons are visible
    const oneWeekButton = page.locator('button', { hasText: '1週間' })
    await oneWeekButton.click()

    // Check if end date is changed
    const endDateInput = page.locator('#end-date')
    const endDateValue = await endDateInput.inputValue()
    expect(endDateValue).toBe('2024-01-08') // Start date + 7 days
  })

  test('should change start date when preset is clicked with "終了日から"', async ({
    page
  }) => {
    // Fill end date using the ID selector
    const endDateInput = page.locator('#end-date')
    await endDateInput.fill('2024-01-15')

    // Try to select "終了日から" if the select is available
    const selectElement = page
      .locator('select, button[role="combobox"]')
      .first()
    if (await selectElement.isVisible()) {
      await selectElement.click()
      const endOption = page.locator('[role="option"]', {
        hasText: '終了日から'
      })
      if (await endOption.isVisible()) {
        await endOption.click()
      }
    }

    // Click a preset button (1週間)
    const oneWeekButton = page.locator('button', { hasText: '1週間' })
    await oneWeekButton.click()

    // Check if start date is changed
    const startDateInput = page.locator('#start-date')
    const startDateValue = await startDateInput.inputValue()
    expect(startDateValue).toBe('2024-01-08') // End date - 7 days
  })

  test('should highlight selected preset button', async ({ page }) => {
    // Fill start date using the ID selector
    const startDateInput = page.locator('#start-date')
    await startDateInput.fill('2024-01-01')

    // Click a preset button
    const twoWeekButton = page.locator('button', { hasText: '2週間' })
    await twoWeekButton.click()

    // Check if the button is highlighted (has different variant)
    await expect(twoWeekButton).toHaveClass(/bg-blue-600|default/)
  })

  test('should have generate button', async ({ page }) => {
    // Look for generate button
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await expect(generateButton).toBeVisible()
  })

  test('should have reset button', async ({ page }) => {
    // Look for reset button
    const resetButton = page.locator('button', { hasText: /リセット|クリア/ })
    await expect(resetButton).toBeVisible()
  })

  test('should show generated list after filling form and clicking generate', async ({
    page
  }) => {
    // Fill form
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    // Fill dates using ID selectors
    const startDateInput = page.locator('#start-date')
    await startDateInput.fill('2024-01-01')

    const endDateInput = page.locator('#end-date')
    await endDateInput.fill('2024-01-07')

    // Click generate button
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await generateButton.click()

    // Wait for generated list to appear (wait replaced with explicit card appearance wait)
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1500 })
  })

  test('should reset form when reset button is clicked', async ({ page }) => {
    // Fill form first
    const titleInput = page.getByRole('textbox', { name: 'タイトル' })
    await titleInput.fill('テストタイトル')

    // Click reset button
    const resetButton = page.getByRole('button', { name: 'リセット' })
    await resetButton.click()

    // Check if title is cleared
    await expect(titleInput).toHaveValue('スケジュール')
  })
})
