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

  test('遅延読み込み後に生成リストカードが表示される', async ({ page }) => {
    // Check if generated list card is visible after lazy loading
    const listCard = page.locator('[data-testid="generated-list-card"]').first()
    await expect(listCard).toBeVisible()

    // Verify that content is correctly displayed after lazy loading
    await expect(listCard.locator('text=生成されたリスト')).toBeVisible()
  })

  test('遅延読み込み後にコピー用ボタンが表示される', async ({ page }) => {
    // Look for copy button (usually has copy icon or copy text)
    // Verify that the copy button becomes available after lazy loading
    const copyButton = page.getByRole('button', { name: 'コピー' })

    // Wait for the button to be displayed after lazy loading completion
    await expect(copyButton).toBeVisible({ timeout: 3000 })
  })

  test('遅延読み込み後に編集/プレビュー切替ができる', async ({ page }) => {
    // Look for edit/preview toggle buttons after lazy loading
    // Verify that edit/preview toggle buttons become available after lazy loading
    const editButton = page.locator('button', { hasText: /編集|edit/i })

    // Verify that the edit button is displayed after lazy loading
    await expect(editButton).toBeVisible({ timeout: 3000 })
  })

  test('遅延読み込み後に日付が正しく表示される', async ({ page }) => {
    // Check if the generated content contains expected dates after lazy loading
    // Verify that content is correctly displayed after lazy loading
    const content = page.locator('[data-testid="generated-list"]')

    // Verify that the start date (01/01) is displayed after lazy loading
    await expect(content.locator('text=01/01')).toBeVisible({ timeout: 3000 })
  })

  test('遅延読み込み後にMarkdown形式で内容が表示される', async ({ page }) => {
    // Check if content appears to be markdown formatted after lazy loading
    // Verify that Markdown-formatted content is displayed after lazy loading
    const markdownContainer = page.locator('[data-testid="generated-list"]')

    // Verify that the Markdown container is displayed after lazy loading
    await expect(markdownContainer).toBeVisible({ timeout: 3000 })
  })

  test('遅延読み込み後にコピー操作でトーストが表示される', async ({
    page
  }, testInfo) => {
    if (!['chromium', 'Mobile Chrome'].includes(testInfo.project.name)) {
      console.log(
        `[SKIP] ${testInfo.project.name} ではクリップボードテストをスキップします`
      )
      test.skip()
    }

    // Find copy button after lazy loading
    // Verify that the copy button becomes available after lazy loading
    const copyButton = page.getByRole('button', { name: 'コピー' }).first()
    await expect(copyButton).toBeVisible({ timeout: 3000 })

    await copyButton.click()

    // Wait for toast notification after copy
    // Verify toast notification after copy
    const toast = page
      .getByRole('region', { name: 'Notifications alt+T' })
      .getByRole('listitem')
      .getByText('クリップボードにコピーしました')
    await expect(toast).toBeVisible({ timeout: 1500 })
  })

  test('遅延読み込みが遅い場合もリストが最終的に表示される', async ({
    page
  }) => {
    // Simulate slow network to test lazy loading behavior
    // Simulate slow network to test lazy loading behavior
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      route.continue()
    })

    // Click the list generation button
    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    // Verify that the lazy-loaded component is eventually displayed
    const listCard = page.locator('[data-testid="generated-list-card"]').first()
    await expect(listCard).toBeVisible({ timeout: 10000 })
  })
})
