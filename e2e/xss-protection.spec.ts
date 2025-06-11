import { expect, test } from '@playwright/test'

test.describe('XSS Protection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('タイトルフィールドでXSS攻撃を防ぐ', async ({ page }) => {
    // XSS攻撃を試みるタイトルを入力
    const titleInput = page.getByRole('textbox', { name: 'タイトル' })
    const xssTitle = '<script>alert("XSS")</script>Malicious Title'

    await titleInput.fill(xssTitle)

    // Wait for React state updates and ensure the sanitized value is applied
    await page.waitForTimeout(300)

    // Trigger blur to ensure sanitization has taken effect
    await titleInput.blur()
    await page.waitForTimeout(100)

    // タイトルがエスケープされているかサニタイズされているかを確認
    const titleValue = await titleInput.inputValue()

    // HTMLタグがエスケープされているか、除去されているかを確認
    expect(titleValue).not.toContain('<script>')
    expect(titleValue).not.toContain('alert("XSS")')

    // Should contain the cleaned text "Malicious Title"
    expect(titleValue).toBe('Malicious Title')
  })

  test('日付フォーマットでXSS攻撃を防ぐ', async ({ page }) => {
    // 詳細オプションを開く
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })

    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    const formatInput = page.getByRole('textbox', { name: '日付フォーマット' })

    if (await formatInput.isVisible()) {
      const xssFormat = '<script>alert("XSS")</script>YYYY-MM-DD'
      await formatInput.fill(xssFormat)

      // Reactの状態更新とサニタイズ処理の完了を待つ
      await page.waitForTimeout(100)

      // 値がサニタイズされているかを確認
      const formatValue = await formatInput.inputValue()
      expect(formatValue).not.toContain('<script>')
      expect(formatValue).not.toContain('alert("XSS")')
    }
  })

  test('カラー入力でXSS攻撃を防ぐ', async ({ page }) => {
    // 詳細オプションを開く
    const expandButton = page.locator('summary, button', {
      hasText: /詳細|オプション|設定|advanced/i
    })

    if (await expandButton.isVisible()) {
      await expandButton.click()
      await page.waitForTimeout(500)
    }

    const colorInput = page.locator('input[type="text"]').last()

    if (await colorInput.isVisible()) {
      const xssColor = 'javascript:alert("XSS")'
      await colorInput.fill(xssColor)

      // Reactの状態更新とサニタイズ処理の完了を待つ
      await page.waitForTimeout(100)

      // 値がサニタイズされているかを確認
      const colorValue = await colorInput.inputValue()
      expect(colorValue).not.toContain('javascript:')
      expect(colorValue).not.toContain('alert("XSS")')
    }
  })

  test('生成されたリストでマークダウンXSS攻撃を防ぐ', async ({ page }) => {
    // 基本フォームを入力
    const titleInput = page.getByRole('textbox', { name: 'タイトル' })
    await titleInput.fill('XSSテスト')

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-03')

    // 生成ボタンをクリック
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await generateButton.click()

    // 生成されたリストが表示されるまで待機
    const generatedContent = page.locator('[data-testid="generated-list-card"]')
    await expect(generatedContent).toBeVisible({ timeout: 5000 })

    // 編集モードに切り替え
    const editButton = page.getByRole('button', { name: '編集する' })
    if (await editButton.isVisible()) {
      await editButton.click()

      // エディターが表示されるまで待機
      await page.waitForTimeout(500)

      // 複数のセレクターを順次試す
      const editor = page
        .locator('[data-testid="md-editor"]')
        .or(page.locator('textarea[placeholder*="マークダウン"]'))
        .or(page.locator('.md-editor textarea'))
        .first()

      if (await editor.isVisible()) {
        // XSS攻撃を試みるマークダウンを入力
        const xssMarkdown =
          '# Title\n\n<script>alert("XSS")</script>\n\n<img src="x" onerror="alert(\'XSS\')">'
        await editor.fill(xssMarkdown)

        // Reactの状態更新とサニタイズ処理の完了を待つ
        await page.waitForTimeout(100)

        // プレビューモードに戻る
        const previewButton = page.getByRole('button', {
          name: 'プレビューに戻す'
        })
        if (await previewButton.isVisible()) {
          await previewButton.click()

          // プレビューエリアでXSS攻撃が無効化されていることを確認
          const previewArea = page.locator('[data-testid="md-preview"]')
          if (await previewArea.isVisible()) {
            const previewContent = await previewArea.textContent()
            // スクリプトタグやイベントハンドラが実際のHTMLに変換されていないことを確認
            expect(previewContent).not.toContain('<script>')
            expect(previewContent).not.toContain('alert("XSS")')
            expect(previewContent).not.toContain('onerror=')
          }
        }
      }
    }
  })

  test('ファイル名でXSS攻撃を防ぐ', async ({ page }) => {
    // 基本フォームを入力
    const titleInput = page.getByRole('textbox', { name: 'タイトル' })
    const xssTitle = '<script>alert("XSS")</script>Document'
    await titleInput.fill(xssTitle)

    const dateInputs = page.locator('input[type="date"]')
    await dateInputs.first().fill('2024-01-01')
    await dateInputs.last().fill('2024-01-03')

    // 生成ボタンをクリック
    const generateButton = page.locator('button', { hasText: /生成|リスト/ })
    await generateButton.click()

    // 生成されたリストが表示されるまで待機
    const generatedContent = page.locator('[data-testid="generated-list-card"]')
    await expect(generatedContent).toBeVisible({ timeout: 5000 })

    // ダウンロードメニューを開く
    const downloadButton = page.getByRole('button', {
      name: 'ダウンロードする'
    })
    if (await downloadButton.isVisible()) {
      await downloadButton.click()

      // Markdownダウンロードオプションをクリック
      const markdownOption = page.getByRole('menuitem', { name: /Markdown/i })
      if (await markdownOption.isVisible()) {
        // ダウンロードを開始（ファイル名が適切にサニタイズされることを期待）
        const downloadPromise = page.waitForEvent('download')
        await markdownOption.click()

        const download = await downloadPromise
        const filename = download.suggestedFilename()

        // ファイル名にXSSスクリプトが含まれていないことを確認
        expect(filename).not.toContain('<script>')
        expect(filename).not.toContain('alert("XSS")')
        expect(filename).toMatch(/\.md$/)
      }
    }
  })
})
