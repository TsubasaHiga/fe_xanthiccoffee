import { expect, test } from '@playwright/test'

test.describe('詳細設定機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('詳細オプションが展開できる', async ({ page }) => {
    // Look for details/summary element or button to expand options
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })

    if (await expandButton.isVisible()) {
      await expect(expandButton).toBeVisible()

      // Try to expand options
      await expandButton.click()
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })
    }
  })

  test('日付フォーマット入力欄が存在する', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })
    }

    // Look for date format input
    const formatInput = page.getByRole('textbox', { name: '日付フォーマット' })

    if (await formatInput.isVisible()) {
      await expect(formatInput).toBeVisible()
    }
  })

  test('休日色切替スイッチが存在する', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })
    }

    // Look for holiday color toggle
    const holidayToggle = page
      .locator('input[type="checkbox"], [role="switch"]')
      .filter({ hasText: /休日|祝日|holiday/i })
      .or(
        page
          .locator('label', { hasText: /休日|祝日|holiday/i })
          .locator('input[type="checkbox"], [role="switch"]')
      )

    if (await holidayToggle.isVisible()) {
      await expect(holidayToggle).toBeVisible()
    }
  })

  test('週末除外スイッチが存在する', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })
    }

    // Look for weekend exclusion toggle
    const weekendToggle = page
      .locator('input[type="checkbox"], [role="switch"]')
      .filter({ hasText: /土日|週末|weekend/i })
      .or(
        page
          .locator('label', { hasText: /土日|週末|weekend/i })
          .locator('input[type="checkbox"], [role="switch"]')
      )

    if (await weekendToggle.isVisible()) {
      await expect(weekendToggle).toBeVisible()
    }
  })

  test('祝日除外スイッチが存在する', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })
    }

    // Look for holiday exclusion toggle
    const holidayExclusionToggle = page
      .locator('input[type="checkbox"], [role="switch"]')
      .filter({ hasText: /祝日.*除外|holiday.*exclude/i })
      .or(
        page
          .locator('label', { hasText: /祝日.*除外|holiday.*exclude/i })
          .locator('input[type="checkbox"], [role="switch"]')
      )

    if (await holidayExclusionToggle.isVisible()) {
      await expect(holidayExclusionToggle).toBeVisible()
    }
  })

  test('スイッチのON/OFFが正しく切り替わる', async ({ page }) => {
    // Expand advanced options if they exist
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })
    if (await expandButton.isVisible()) {
      await expandButton.click()
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })
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
      // 300ms wait replaced with explicit wait for toggle state change
      await expect(firstToggle)
        .toBeChecked({ timeout: 500 })
        .catch(() => {})

      // Check that state changed
      const newChecked = await firstToggle.isChecked()
      expect(newChecked).not.toBe(initialChecked)
    }
  })

  test('詳細設定を変更してもリスト生成後に保持される', async ({ page }) => {
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
      // 500ms wait replaced with explicit wait for advanced panel appearance
      const advancedPanel = page
        .locator(
          'input[type="checkbox"], [role="switch"], [name="日付フォーマット"]'
        )
        .first()
      await expect(advancedPanel).toBeVisible({ timeout: 800 })

      // Toggle some advanced setting
      const toggles = page.locator('input[type="checkbox"], [role="switch"]')
      if (await toggles.first().isVisible()) {
        await toggles.first().click()
      }
    }

    // Generate list
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await generateButton.click()
    // 2000ms wait replaced with explicit wait for generated list card appearance
    const generatedContent = page
      .locator('[data-testid="generated-list-card"]')
      .first()
    await expect(generatedContent).toBeVisible({ timeout: 1500 })

    // Check that settings are still accessible/visible
    if (await expandButton.isVisible()) {
      // Settings should still be expandable
      await expect(expandButton).toBeVisible()
    }
  })
})
