import { expect, test } from '@playwright/test'

test.describe('生成リスト機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Fill form to generate a list
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-07')

    // Generate list
    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    // Wait for list to be generated and lazy loaded component to appear
    // Wait for the lazy-loaded MarkdownViewer component to be displayed
    const listCard = page.locator('[data-testid="generated-list-card"]').first()
    await expect(listCard).toBeVisible({ timeout: 5000 })
  })

  // 遅延読み込みテストは独立したテストとして実行し、beforeEachの影響を受けないようにする
  test('遅延読み込みが遅い場合もリストが最終的に表示される', async ({
    page
  }) => {
    // このテストは独立して実行し、ネットワーク遅延をシミュレート
    await page.goto('/')

    // Simulate slower network for more realistic lazy loading test
    await page.route('**/*', async (route) => {
      // Only add delay to JS/CSS files to simulate component loading delay
      if (
        route.request().url().includes('.js') ||
        route.request().url().includes('.css')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      route.continue()
    })

    // Fill form to generate a list with different dates
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('遅延テスト用タイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-02-01')
    await dateInputs.last().fill('2024-02-07')

    // Click the list generation button
    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await expect(generateButton).toBeEnabled({ timeout: 5000 })
    await generateButton.click()

    // Wait for the generated list container to appear
    // This tests that the component loads even with network delays
    const generatedListContainer = page
      .locator('[data-testid="generated-list-card"]')
      .or(page.locator('.markdown-viewer'))
      .or(page.locator('text=生成されたリスト').locator('..'))

    await expect(generatedListContainer.first()).toBeVisible({ timeout: 20000 })

    // Verify that the content is actually loaded with correct dates
    const content = page
      .locator('text=02/01')
      .or(page.locator('text=2024-02-01'))
    await expect(content.first()).toBeVisible({ timeout: 5000 })

    // Verify copy button is available after lazy loading
    const copyButton = page.getByRole('button', { name: 'コピー' })
    await expect(copyButton).toBeVisible({ timeout: 5000 })

    // Verify edit button is available after lazy loading
    const editButton = page.getByRole('button', { name: /編集する/i })
    await expect(editButton).toBeVisible({ timeout: 5000 })
  })

  test('コピー操作でトーストが表示される', async ({ page }, testInfo) => {
    if (!['chromium', 'Mobile Chrome'].includes(testInfo.project.name)) {
      console.log(
        `[SKIP] ${testInfo.project.name} ではクリップボードテストをスキップします`
      )
      test.skip()
    }

    // Find copy button after lazy loading
    const copyButton = page.getByRole('button', { name: 'コピー' }).first()
    await expect(copyButton).toBeVisible({ timeout: 3000 })

    await copyButton.click()

    // Wait for toast notification after copy
    const toast = page.locator('text=クリップボードにコピーしました')
    await expect(toast).toBeVisible({ timeout: 3000 })
  })
})
