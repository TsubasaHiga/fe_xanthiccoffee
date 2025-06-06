import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAsMarkdown, exportAsPDF } from './exportUtils'

// Mock DOM APIs
const mockCreateElement = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

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
    open: vi.fn(() => ({
      document: {
        write: vi.fn(),
        close: vi.fn()
      },
      focus: vi.fn(),
      print: vi.fn(),
      close: vi.fn()
    }))
  },
  writable: true
})

Object.defineProperty(global, 'Blob', {
  value: class MockBlob {
    content: unknown[]
    options: unknown
    constructor(content: unknown[], options: unknown) {
      this.content = content
      this.options = options
    }
  },
  writable: true
})

describe('exportUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup mock link element
    const mockLink = {
      setAttribute: vi.fn(),
      style: {},
      click: mockClick
    }
    mockCreateElement.mockReturnValue(mockLink)
    mockCreateObjectURL.mockReturnValue('mock-url')
  })

  describe('exportAsMarkdown', () => {
    it('Markdown形式でエクスポートできる', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）
- 01/03（水）（元日）`

      exportAsMarkdown(content)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
    })

    it('タイトルがある場合はファイル名にタイトルを使用する', () => {
      const content = `# マイスケジュール

- 01/01（月）`

      exportAsMarkdown(content)

      const mockLink = mockCreateElement.mock.results[0].value
      // Check for any call with 'download' and the title since order may vary
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'マイスケジュール.md'
      )
    })

    it('タイトルがない場合はデフォルトファイル名を使用する', () => {
      const content = `- 01/01（月）
- 01/02（火）`

      exportAsMarkdown(content)

      const mockLink = mockCreateElement.mock.results[0].value
      // Check for any call with 'download' and default filename since order may vary
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'マークダウンファイル.md'
      )
    })
  })

  describe('exportAsPDF', () => {
    it('PDF形式でエクスポートできる', async () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）`

      await exportAsPDF(content)

      expect(global.window.open).toHaveBeenCalled()
    })
  })
})
