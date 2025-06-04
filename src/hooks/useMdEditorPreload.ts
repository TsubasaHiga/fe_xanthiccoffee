import { useCallback, useEffect, useRef } from 'react'

/**
 * md-editor-rtのコンポーネントをプリロードするカスタムhook
 * 編集ボタンのhoverやfocusで事前にモジュールを読み込む
 */
export function useMdEditorPreload() {
  const preloadTriggered = useRef(false)

  const preloadMdEditor = useCallback(async () => {
    if (preloadTriggered.current) return
    preloadTriggered.current = true

    try {
      // バックグラウンドでmd-editor-rtとその依存関係をプリロード
      const imports = [
        import('md-editor-rt'),
        import('@codemirror/view'),
        import('md-editor-rt/lib/style.css')
      ]

      // jp-JPロケールは追加でインポートを試行（失敗してもプリロードは継続）
      try {
        imports.push(import('@vavt/cm-extension/dist/locale/jp-JP'))
      } catch (localeError) {
        console.warn('jp-JP locale preload skipped:', localeError)
      }

      await Promise.all(imports)
    } catch (error) {
      console.warn('Failed to preload md-editor:', error)
      preloadTriggered.current = false // リトライを可能にする
    }
  }, [])

  // コンポーネント初期化後、少し遅延してプリロードを開始（オプション）
  useEffect(() => {
    const timer = setTimeout(() => {
      // 低優先度でプリロード（ユーザーが編集機能を使う可能性が高い場合）
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => preloadMdEditor())
      } else {
        // フォールバック
        setTimeout(preloadMdEditor, 100)
      }
    }, 2000) // 2秒後に開始

    return () => clearTimeout(timer)
  }, [preloadMdEditor])

  return { preloadMdEditor }
}
