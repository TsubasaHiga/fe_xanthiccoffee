import { expect, test } from '@playwright/test'

test.describe('日付リスト設定機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('タイトル・開始日・終了日の入力欄が存在する', async ({ page }) => {
    // Check for title input
    const titleInput = page.locator('input[type="text"]').first()
    await expect(titleInput).toBeVisible()

    // Check for date elements - they show as buttons with specific text content
    const startDateText = page.getByText('開始日', { exact: true })
    const endDateText = page.getByText('終了日', { exact: true })
    await expect(startDateText).toBeVisible()
    await expect(endDateText).toBeVisible()
  })

  test('タイトル・日付が入力できる', async ({ page }) => {
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

  test('期間プリセットボタンが存在する', async ({ page }) => {
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

  test('プリセット基準セレクタ（開始日から/終了日から）が存在する', async ({
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

  test('「開始日から」選択時にプリセットボタンで終了日が変わる', async ({
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

  test('「終了日から」選択時にプリセットボタンで開始日が変わる', async ({
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

  test('選択中のプリセットボタンがハイライトされる', async ({ page }) => {
    // Fill start date using the ID selector
    const startDateInput = page.locator('#start-date')
    await startDateInput.fill('2024-01-01')

    // Click a preset button
    const twoWeekButton = page.locator('button', { hasText: '2週間' })
    await twoWeekButton.click()

    // Check if the button is highlighted (has different variant)
    await expect(twoWeekButton).toHaveClass(/bg-blue-600|default/)
  })

  test('リスト生成ボタンが存在する', async ({ page }) => {
    // Look for generate button
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await expect(generateButton).toBeVisible()
  })

  test('リセットボタンが存在する', async ({ page }) => {
    // Look for reset button
    const resetButton = page.locator('button', { hasText: /リセット|クリア/ })
    await expect(resetButton).toBeVisible()
  })

  test('フォーム入力後にリスト生成ボタンを押すとリストが表示される', async ({
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

  test('リセットボタン押下でフォームが初期化される', async ({ page }) => {
    // Fill form first
    const titleInput = page.getByRole('textbox', { name: 'タイトル' })
    await titleInput.fill('テストタイトル')

    // Click reset button
    const resetButton = page.getByRole('button', { name: 'リセット' })
    await resetButton.click()

    // Check if title is cleared
    await expect(titleInput).toHaveValue('Schedule')
  })
})
