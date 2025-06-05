import { expect, test } from '@playwright/test'

test.describe('基本ページ表示とナビゲーション', () => {
  test('トップページが正常に表示される', async ({ page }) => {
    await page.goto('/')

    // Check that the main title is present
    await expect(page.locator('h1')).toContainText('MarkDays')
  })

  test('日付設定フォームが表示される', async ({ page }) => {
    await page.goto('/')

    // Check that the settings card is visible
    await expect(
      page
        .locator('[data-testid="date-list-settings-card"]')
        .or(page.locator('form'))
    ).toBeVisible()
  })

  test('フッターが表示される', async ({ page }) => {
    await page.goto('/')

    // Check that footer is present
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })
})

test.describe('レスポンシブデザイン', () => {
  test('モバイル画面で正常に動作する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that the main title is still visible
    await expect(page.locator('h1')).toContainText('MarkDays')

    // Check that the page content is still accessible
    await expect(page.locator('body')).toBeVisible()
  })

  test('タブレット画面で正常に動作する', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // Check that the main title is still visible
    await expect(page.locator('h1')).toContainText('MarkDays')
  })
})
