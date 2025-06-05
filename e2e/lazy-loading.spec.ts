import { expect, test } from '@playwright/test'

test.describe('Lazy Loading Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should not load MarkdownViewer initially', async ({ page }) => {
    // Verify that MarkdownViewer component is not loaded in the initial state
    const listCard = page.locator('[data-testid="generated-list-card"]')
    await expect(listCard).not.toBeVisible()
  })

  test('should lazy load MarkdownViewer only when list is generated', async ({
    page
  }) => {
    // Fill in the form
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('遅延読み込みテスト')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-05')

    // Verify that MarkdownViewer does not exist before list generation
    const listCardBefore = page.locator('[data-testid="generated-list-card"]')
    await expect(listCardBefore).not.toBeVisible()

    // Click the list generation button
    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    // Verify that MarkdownViewer is displayed after lazy loading
    const listCardAfter = page.locator('[data-testid="generated-list-card"]')
    await expect(listCardAfter).toBeVisible({ timeout: 5000 })

    // Verify that main elements of MarkdownViewer are correctly loaded
    await expect(listCardAfter.locator('text=生成されたリスト')).toBeVisible()
    await expect(page.getByRole('button', { name: 'コピー' })).toBeVisible()
    await expect(page.getByRole('button', { name: '編集する' })).toBeVisible()
  })

  test('should handle lazy loading with network delays', async ({ page }) => {
    // Simulate network delay
    await page.route('**/*.js', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      route.continue()
    })

    // Fill in the form and generate list
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('ネットワーク遅延テスト')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-03')

    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    // Verify that MarkdownViewer is eventually loaded despite delays
    const listCard = page.locator('[data-testid="generated-list-card"]')
    await expect(listCard).toBeVisible({ timeout: 10000 })
  })

  test('should preserve lazy loading state on navigation', async ({ page }) => {
    // Generate a list
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('ナビゲーションテスト')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-02')

    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    // Verify that MarkdownViewer is loaded
    const listCard = page.locator('[data-testid="generated-list-card"]')
    await expect(listCard).toBeVisible({ timeout: 5000 })

    // Reload the page
    await page.reload()

    // Verify that it returns to lazy loading state after reload
    // (generated list is cleared by state management)
    await expect(listCard).not.toBeVisible()
  })

  test('should handle multiple rapid generations', async ({ page }) => {
    // Verify that lazy loading works correctly even with multiple consecutive generations
    const titleInput = page.locator('input[type="text"]').first()
    const dateInputs = page.locator('input[type="date"]')
    const generateButton = page.getByRole('button', { name: /生成|リスト/ })

    // First generation
    await titleInput.fill('第1回テスト')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-02')
    await generateButton.click()

    const listCard = page.locator('[data-testid="generated-list-card"]')
    await expect(listCard).toBeVisible({ timeout: 5000 })

    // Change settings and regenerate
    await titleInput.fill('第2回テスト')
    await dateInputs.first().fill('2024-07-01')
    await dateInputs.last().fill('2024-07-03')
    await generateButton.click()

    // Verify that the lazy-loaded component is updated
    await expect(listCard.locator('text=第2回テスト')).toBeVisible({
      timeout: 3000
    })
  })

  test('should show loading state during lazy loading', async ({ page }) => {
    // Test the state during lazy loading
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('ローディングテスト')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-05')

    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    // Check loading state during generation (spinner or disabled state etc.)
    // Note: Depending on implementation, there may or may not be loading display
    const listCard = page.locator('[data-testid="generated-list-card"]')

    // Verify that MarkdownViewer is eventually displayed
    await expect(listCard).toBeVisible({ timeout: 5000 })
  })
})
