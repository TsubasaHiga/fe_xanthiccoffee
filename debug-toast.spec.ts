import { expect, test } from '@playwright/test'

test('Debug toast structure', async ({ page }) => {
  await page.goto('/')

  // Fill form with invalid date range
  const titleInput = page.locator('input[type="text"]').first()
  await titleInput.fill('テストタイトル')

  const dateInputs = page.locator('input[type="date"]')
  await dateInputs.first().fill('2024-01-07') // Start date
  await dateInputs.last().fill('2024-01-01') // End date (before start)

  // Generate
  const generateButton = page.locator('button', { hasText: /生成|リスト/ })
  await generateButton.click()

  // Wait a moment and check the page structure
  await page.waitForTimeout(2000)

  // Log the entire page content to see toast structure
  const pageContent = await page.content()
  console.log('Page content:', pageContent)

  // Try different selectors
  const allElements = await page.locator('body *').all()
  for (const element of allElements) {
    const text = await element.textContent()
    if (text?.includes('開始日')) {
      console.log('Found element with error text:', await element.innerHTML())
    }
  }
})
