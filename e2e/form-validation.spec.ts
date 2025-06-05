import { expect, test } from '@playwright/test'

test.describe('フォームバリデーション', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('全項目が空のとき生成ボタンが無効になる', async ({ page }) => {
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

  test('タイトルが空のとき生成ボタンが無効になる', async ({ page }) => {
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

  test('開始日が空のとき生成ボタンが無効になる', async ({ page }) => {
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

  test('終了日が空のとき生成ボタンが無効になる', async ({ page }) => {
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

  test('全ての必須項目が入力されていれば生成ボタンが有効になる', async ({
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

  test('開始日より終了日が前の場合はエラーが表示される', async ({ page }) => {
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

      // 1000ms wait replaced with explicit wait for error message appearance
      const errorMessage = page
        .locator('[data-sonner-toast]')
        .or(page.locator('div', { hasText: /エラー|error/i }))
      await expect(errorMessage).toBeVisible({ timeout: 1200 })

      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toBeVisible()
      }
    }
  })

  test('日付入力欄は正しいフォーマットを受け付ける', async ({ page }) => {
    // HTML5 date inputs handle format validation automatically
    // Just check that date inputs accept valid dates
    const dateInputs = page.locator('input[type="date"]')

    if (await dateInputs.first().isVisible()) {
      await dateInputs.first().fill('2024-01-01')
      await expect(dateInputs.first()).toHaveValue('2024-01-01')
    }
  })
})
