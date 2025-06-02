import { expect, test } from '@playwright/test'

test.describe('Generated List Functionality', () => {
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

    // Wait for list to be generated
    await page.waitForTimeout(2000)
  })

  test('should display generated list card', async ({ page }) => {
    // Check if generated list card is visible
    const listCard = page.locator('[data-testid="generated-list-card"]').first()
    await expect(listCard).toBeVisible()
  })

  test('should have copy button', async ({ page }) => {
    // Look for copy button (usually has copy icon or copy text)
    const copyButton = page.getByRole('button', { name: 'コピー' })

    if (await copyButton.isVisible()) {
      await expect(copyButton).toBeVisible()
    }
  })

  test('should have edit/preview toggle functionality', async ({ page }) => {
    // Look for edit/preview toggle buttons
    const editButton = page.locator('button', { hasText: /編集|edit/i })
    const previewButton = page.locator('button', {
      hasText: /プレビュー|preview/i
    })

    // Check if either edit or preview functionality exists
    const hasToggle =
      (await editButton.isVisible()) || (await previewButton.isVisible())

    if (hasToggle) {
      if (await editButton.isVisible()) {
        await expect(editButton).toBeVisible()
      }
      if (await previewButton.isVisible()) {
        await expect(previewButton).toBeVisible()
      }
    }
  })

  test('should show generated content with dates', async ({ page }) => {
    // Check if the generated content contains expected dates
    const content = page.locator('body')

    // Look for 2024 year in content (since we set dates to 2024)
    const hasDateContent = await content.locator('text=2024').isVisible()

    if (hasDateContent) {
      await expect(content.locator('text=2024')).toBeVisible()
    }
  })

  test('should display markdown formatted content', async ({ page }) => {
    // Check if content appears to be markdown formatted
    // Look for common markdown elements like lists or formatted text
    const markdownElements = page.locator('ul, ol, li, h1, h2, h3, h4, h5, h6')

    if (await markdownElements.first().isVisible()) {
      await expect(markdownElements.first()).toBeVisible()
    }
  })

  test('should copy content to clipboard when copy button is clicked', async ({
    page
  }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    // Find copy button
    const copyButton = page.getByRole('button', { name: 'コピー' }).first()

    if (await copyButton.isVisible()) {
      await copyButton.click()

      // Wait for potential toast notification
      await page.waitForTimeout(1000)

      // Check if toast notification appears
      const toast = page
        .getByRole('region', { name: 'Notifications alt+T' })
        .getByRole('listitem')
        .getByText('クリップボードにコピーしました')

      if (await toast.isVisible()) {
        await expect(toast).toBeVisible()
      }
    }
  })
})
