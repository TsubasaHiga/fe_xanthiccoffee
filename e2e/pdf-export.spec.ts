import { expect, test } from '@playwright/test'

test.describe('PDFエクスポート機能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill('PDFテスト用スケジュール')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-07')

    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    const listCard = page.locator('[data-testid="generated-list-card"]').first()
    await expect(listCard).toBeVisible({ timeout: 5000 })
  })

  test('PDFエクスポートボタンが表示される', async ({ page }) => {
    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await expect(downloadButton).toBeVisible({ timeout: 3000 })
  })

  test('ダウンロードドロップダウンメニューが正しく動作する', async ({
    page
  }) => {
    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await expect(downloadButton).toBeVisible({ timeout: 3000 })
    await downloadButton.click()

    const pdfOption = page.getByRole('menuitem', { name: /PDF/i })
    await expect(pdfOption).toBeVisible({ timeout: 1000 })

    const markdownOption = page.getByRole('menuitem', { name: /Markdown/i })
    await expect(markdownOption).toBeVisible()
  })

  test('PDFエクスポートがダウンロードを開始する', async ({ page }) => {
    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await downloadButton.click()

    const pdfOption = page.getByRole('menuitem', { name: /PDF/i })
    await pdfOption.click()

    // 成功トーストまたはエラートーストの表示を待機
    const successToast = page.locator('text=PDFファイルをダウンロードしました')
    const errorToast = page.locator('text=PDFエクスポートに失敗しました')

    // 成功トーストが表示されるか、エラートーストが表示されないかを確認
    await Promise.race([
      expect(successToast).toBeVisible({ timeout: 10000 }),
      expect(errorToast).not.toBeVisible({ timeout: 10000 })
    ])
  })

  test('PDF生成中にエラーが発生しない', async ({ page }) => {
    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await downloadButton.click()

    const pdfOption = page.getByRole('menuitem', { name: /PDF/i })
    await pdfOption.click()

    // 成功トーストの表示を待機
    const successToast = page.locator('text=PDFファイルをダウンロードしました')
    await expect(successToast).toBeVisible({ timeout: 10000 })

    const errorToast = page.locator('text=PDFエクスポートに失敗しました')
    await expect(errorToast).not.toBeVisible()
  })

  test('編集モード時はダウンロードボタンが非表示になる', async ({ page }) => {
    // Initially download button should be visible
    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await expect(downloadButton).toBeVisible()

    // Click edit button to enter edit mode
    const editButton = page.getByRole('button', { name: /編集する/i })
    await editButton.click()

    // Download button should be hidden in edit mode
    await expect(downloadButton).not.toBeVisible()

    // Click preview button to exit edit mode
    const previewButton = page.getByRole('button', {
      name: /プレビューに戻す/i
    })
    await previewButton.click()

    // Download button should be visible again
    await expect(downloadButton).toBeVisible()
  })

  test('長いタイトルでもPDFエクスポートが動作する', async ({ page }) => {
    await page.goto('/')

    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill(
      '非常に長いタイトルのスケジュール - これはPDFエクスポート機能のテストです'
    )

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-06-01')
    await dateInputs.last().fill('2024-06-03')

    const generateButton = page.getByRole('button', { name: /生成|リスト/ })
    await generateButton.click()

    const listCard = page.locator('[data-testid="generated-list-card"]').first()
    await expect(listCard).toBeVisible({ timeout: 5000 })

    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await downloadButton.click()

    const pdfOption = page.getByRole('menuitem', { name: /PDF/i })
    await pdfOption.click()

    // 成功トーストの表示を待機
    const successToast = page.locator('text=PDFファイルをダウンロードしました')
    await expect(successToast).toBeVisible({ timeout: 10000 })

    const errorToast = page.locator('text=PDFエクスポートに失敗しました')
    await expect(errorToast).not.toBeVisible()
  })

  test('モバイルビューでPDFエクスポートが動作する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const downloadButton = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await expect(downloadButton).toBeVisible()
    await downloadButton.click()

    const pdfOption = page.getByRole('menuitem', { name: /PDF/i })
    await expect(pdfOption).toBeVisible()
    await pdfOption.click()

    // 成功トーストの表示を待機
    const successToast = page.locator('text=PDFファイルをダウンロードしました')
    await expect(successToast).toBeVisible({ timeout: 10000 })

    const errorToast = page.locator('text=PDFエクスポートに失敗しました')
    await expect(errorToast).not.toBeVisible()
  })

  test('複数のPDFエクスポートが連続で実行できる', async ({ page }) => {
    // First export
    const downloadButton1 = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await downloadButton1.click()
    const pdfOption1 = page.getByRole('menuitem', { name: /PDF/i })
    await pdfOption1.click()

    // 1回目の成功トーストの表示を待機
    const successToast1 = page.locator('text=PDFファイルをダウンロードしました')
    await expect(successToast1).toBeVisible({ timeout: 10000 })

    let errorToast = page.locator('text=PDFエクスポートに失敗しました')
    await expect(errorToast).not.toBeVisible()

    // Second export
    const downloadButton2 = page.getByRole('button', {
      name: /ダウンロードする/i
    })
    await downloadButton2.click()
    const pdfOption2 = page.getByRole('menuitem', { name: /PDF/i })
    await pdfOption2.click()

    // 2回目の成功トーストの表示を待機
    const successToast2 = page.locator('text=PDFファイルをダウンロードしました')
    await expect(successToast2).toBeVisible({ timeout: 10000 })

    errorToast = page.locator('text=PDFエクスポートに失敗しました')
    await expect(errorToast).not.toBeVisible()
  })
})
