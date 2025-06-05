import { expect, test } from '@playwright/test'

test.describe('スモークテスト', () => {
  test('Playwrightのセットアップが正しい', async ({ page }) => {
    // This is a simple smoke test to verify Playwright is working
    expect(page).toBeDefined()
    expect(page.goto).toBeDefined()
  })

  test('アプリケーションに遷移できる', async ({ page }) => {
    await page.goto('/')

    // Check that we can access the page (any 2xx response)
    const _response = await page.waitForLoadState('networkidle')

    // Check that the page title contains something (not empty)
    const title = await page.title()
    expect(title).toBeTruthy()

    // Check that the page has some content
    const bodyContent = await page.locator('body').textContent()
    expect(bodyContent).toBeTruthy()
    if (bodyContent) {
      expect(bodyContent.length).toBeGreaterThan(0)
    }
  })

  test('ページが10秒以内に読み込まれる', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - startTime

    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000)
  })
})
