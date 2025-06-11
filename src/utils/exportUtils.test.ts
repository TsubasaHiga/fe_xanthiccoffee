import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAsMarkdown, exportAsPDF } from './exportUtils'

// Mock external dependencies
vi.mock('marked', () => ({
  marked: vi.fn().mockResolvedValue('<h1>Test</h1><ul><li>Item 1</li></ul>')
}))

vi.mock('github-markdown-css/github-markdown-light.css?inline', () => ({
  default: 'mock-css-content'
}))

vi.mock('./xssUtils', () => ({
  sanitizeTitle: vi.fn((title: string) => title)
}))

// Mock DOM APIs
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()
const mockSetAttribute = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()

const mockCreateElement = vi.fn()

// Mock print window for PDF tests
const mockPrintWindow = {
  document: {
    write: vi.fn(),
    close: vi.fn(),
    readyState: 'complete'
  },
  addEventListener: vi.fn(),
  focus: vi.fn(),
  print: vi.fn(),
  close: vi.fn()
}

const mockWindowOpen = vi.fn().mockReturnValue(mockPrintWindow)

// Mock global objects
Object.defineProperty(global, 'document', {
  value: {
    createElement: mockCreateElement,
    body: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild
    }
  },
  writable: true
})

Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL
  },
  writable: true
})

Object.defineProperty(global, 'window', {
  value: {
    open: mockWindowOpen,
    navigator: {
      userAgent: 'Mozilla/5.0 (Test Browser)'
    }
  },
  writable: true
})

Object.defineProperty(global, 'Blob', {
  value: vi.fn(),
  writable: true
})

Object.defineProperty(global, 'setTimeout', {
  value: vi.fn((callback: () => void) => {
    callback()
    return 1
  }),
  writable: true
})

describe('exportUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateElement.mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return {
          setAttribute: mockSetAttribute,
          style: { display: '' },
          click: mockClick
        }
      }
      return {}
    })
    mockCreateObjectURL.mockReturnValue('mock-url')
  })

  describe('exportAsMarkdown', () => {
    it('Markdown形式でエクスポートできる', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）
- 01/03（水）（元日）`

      exportAsMarkdown(content, 'テストスケジュール')

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
    })

    it('カスタムタイトルが正しく使用される', () => {
      const content = `# マイスケジュール

- 01/01（月）`

      exportAsMarkdown(content, 'カスタムタイトル')

      expect(mockSetAttribute).toHaveBeenCalledWith('href', 'mock-url')

      const downloadCall = mockSetAttribute.mock.calls.find(
        (call: unknown[]) => Array.isArray(call) && call[0] === 'download'
      ) as [string, string] | undefined
      expect(downloadCall).toBeDefined()
      expect(downloadCall![1]).toMatch(
        /^カスタムタイトル-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.md$/
      )
    })

    it('Blobが正しい設定で作成される', () => {
      const content = '# テスト内容'
      const title = 'テスト'

      exportAsMarkdown(content, title)

      expect(global.Blob).toHaveBeenCalledWith([content], {
        type: 'text/markdown;charset=utf-8;'
      })
    })
  })

  describe('exportAsPDF', () => {
    it('PDF関数が呼び出し可能である', () => {
      expect(exportAsPDF).toBeDefined()
      expect(typeof exportAsPDF).toBe('function')
      expect(exportAsPDF.length).toBe(2)
    })

    it('E2Eテスト環境では即座に解決される', async () => {
      Object.defineProperty(global.window, '__e2e_pdf_test_mode__', {
        value: true,
        writable: true
      })

      const content = 'テスト内容'
      const title = 'テストタイトル'

      const result = await exportAsPDF(content, title)
      expect(result).toBeUndefined()
    })

    it('通常環境では印刷ウィンドウが開かれる', async () => {
      Object.defineProperty(global.window, '__e2e_pdf_test_mode__', {
        value: false,
        writable: true
      })

      const content = 'テスト内容'
      const title = 'テストタイトル'

      await exportAsPDF(content, title)

      expect(mockWindowOpen).toHaveBeenCalledWith(
        '',
        '_blank',
        'width=800,height=600'
      )
      expect(mockPrintWindow.document.write).toHaveBeenCalled()
      expect(mockPrintWindow.document.close).toHaveBeenCalled()
      expect(mockPrintWindow.focus).toHaveBeenCalled()
      expect(mockPrintWindow.print).toHaveBeenCalled()
    })

    it('ポップアップがブロックされた場合はエラーがスローされる', async () => {
      mockWindowOpen.mockReturnValueOnce(null)

      Object.defineProperty(global.window, '__e2e_pdf_test_mode__', {
        value: false,
        writable: true
      })

      const content = 'テスト内容'
      const title = 'テストタイトル'

      await expect(exportAsPDF(content, title)).rejects.toThrow(
        'ポップアップがブロックされました。ポップアップを許可してから再試行してください。'
      )
    })

    it('HTML生成時に簡潔なCSS設定が含まれる', async () => {
      Object.defineProperty(global.window, '__e2e_pdf_test_mode__', {
        value: false,
        writable: true
      })

      const content = '# テスト見出し\n\n- リスト項目1\n- リスト項目2'
      const title = 'テストタイトル'

      await exportAsPDF(content, title)

      const writeCall = mockPrintWindow.document.write.mock.calls[0][0]

      // 改ページ制御が削除されていることを確認
      expect(writeCall).not.toContain('page-break-inside: avoid')
      expect(writeCall).not.toContain('break-inside: avoid')

      // 基本的なスタイルが含まれていることを確認
      expect(writeCall).toContain('mock-css-content')
      expect(writeCall).toContain('font-family: -apple-system')
      expect(writeCall).toContain('@media print')
      expect(writeCall).toContain('max-width: 100%')

      // 改ページ制御削除のコメントが含まれていることを確認
      expect(writeCall).toContain(
        '改ページ制御は削除 - ブラウザの自然な判断に任せる'
      )
    })
  })
})
