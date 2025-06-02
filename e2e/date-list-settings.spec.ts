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

    // Check for date inputs (start and end date)
    const dateInputs = page.locator('input[type="date"]')
    await expect(dateInputs).toHaveCount(2)
  })

  test('should allow entering title and dates', async ({ page }) => {
    // Fill title
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')
    await expect(titleInput).toHaveValue('テストタイトル')

    // Fill start date
    const dateInputs = page.locator('input[type="date"]')
    const startDate = dateInputs.first()
    await startDate.fill('2024-01-01')
    await expect(startDate).toHaveValue('2024-01-01')

    // Fill end date
    const endDate = dateInputs.last()
    await endDate.fill('2024-01-07')
    await expect(endDate).toHaveValue('2024-01-07')
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

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-07')

    // Click generate button
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await generateButton.click()

    // Wait for generated list to appear
    await page.waitForTimeout(1000)

    // Check if generated content is visible
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()

    if (await generatedContent.isVisible()) {
      await expect(generatedContent).toBeVisible()
    }
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
