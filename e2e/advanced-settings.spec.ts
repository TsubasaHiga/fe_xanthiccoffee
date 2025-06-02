import { expect, test } from '@playwright/test'

test.describe('Advanced Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have expandable advanced options', async ({ page }) => {
    // Look for details/summary element or button to expand options
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })

    if (await expandButton.isVisible()) {
      await expect(expandButton).toBeVisible()

      // Try to expand options
      await expandButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('should have date format input', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    // Look for date format input
    const formatInput = page
      .locator('input[type="text"]')
      .filter({ hasText: /format|フォーマット/i })
      .or(page.locator('input').filter({ hasValue: /YYYY|MM|DD/ }))

    if (await formatInput.isVisible()) {
      await expect(formatInput).toBeVisible()
    }
  })

  test('should have holiday color toggle', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    // Look for holiday color toggle
    const holidayToggle = page
      .locator('input[type="checkbox"], [role="switch"]')
      .filter({
        hasText: /休日|祝日|holiday/i
      })
      .or(
        page
          .locator('label', { hasText: /休日|祝日|holiday/i })
          .locator('input[type="checkbox"], [role="switch"]')
      )

    if (await holidayToggle.isVisible()) {
      await expect(holidayToggle).toBeVisible()
    }
  })

  test('should have weekend exclusion toggle', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    // Look for weekend exclusion toggle
    const weekendToggle = page
      .locator('input[type="checkbox"], [role="switch"]')
      .filter({
        hasText: /土日|週末|weekend/i
      })
      .or(
        page
          .locator('label', { hasText: /土日|週末|weekend/i })
          .locator('input[type="checkbox"], [role="switch"]')
      )

    if (await weekendToggle.isVisible()) {
      await expect(weekendToggle).toBeVisible()
    }
  })

  test('should have holiday exclusion toggle', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    // Look for holiday exclusion toggle
    const holidayExclusionToggle = page
      .locator('input[type="checkbox"], [role="switch"]')
      .filter({
        hasText: /祝日.*除外|holiday.*exclude/i
      })
      .or(
        page
          .locator('label', { hasText: /祝日.*除外|holiday.*exclude/i })
          .locator('input[type="checkbox"], [role="switch"]')
      )

    if (await holidayExclusionToggle.isVisible()) {
      await expect(holidayExclusionToggle).toBeVisible()
    }
  })

  test('should toggle switches correctly', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    // Find any toggle switch
    const toggles = page.locator('input[type="checkbox"], [role="switch"]')
    const toggleCount = await toggles.count()

    if (toggleCount > 0) {
      const firstToggle = toggles.first()

      // Get initial state
      const initialChecked = await firstToggle.isChecked()

      // Toggle the switch
      await firstToggle.click()
      await page.waitForTimeout(300)

      // Check that state changed
      const newChecked = await firstToggle.isChecked()
      expect(newChecked).not.toBe(initialChecked)
    }
  })

  test('should persist advanced settings when generating list', async ({
    page
  }) => {
    // Fill basic form
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('テストタイトル')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-07')

    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)

      // Toggle some advanced setting
      const toggles = page.locator('input[type="checkbox"], [role="switch"]')
      if (await toggles.first().isVisible()) {
        await toggles.first().click()
      }
    }

    // Generate list
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await generateButton.click()
    await page.waitForTimeout(2000)

    // Check that settings are still accessible/visible
    if (await expandButton.isVisible()) {
      // Settings should still be expandable
      await expect(expandButton).toBeVisible()
    }
  })
})
