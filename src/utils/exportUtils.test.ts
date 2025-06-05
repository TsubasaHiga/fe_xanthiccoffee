import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  exportAsCSV,
  exportAsExcel,
  exportAsICS,
  exportAsPDF,
  parseMarkdownContent
} from './exportUtils'

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

  describe('parseMarkdownContent', () => {
    it('基本的なマークダウンを正しく解析する', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）
- 01/03（水）（元日）`

      const result = parseMarkdownContent(content)

      expect(result.title).toBe('テストスケジュール')
      expect(result.dates).toHaveLength(3)
      expect(result.dates[0]).toEqual({
        date: '01/01',
        dayOfWeek: '月',
        holiday: undefined
      })
      expect(result.dates[2]).toEqual({
        date: '01/03',
        dayOfWeek: '水',
        holiday: '元日'
      })
    })

    it('HTMLタグを含むコンテンツを正しく解析する', () => {
      const content = `# スケジュール

- <span style="color: #dc2626">01/01（月）（元日）</span>
- 01/02（火）`

      const result = parseMarkdownContent(content)

      expect(result.dates[0]).toEqual({
        date: '01/01',
        dayOfWeek: '月',
        holiday: '元日'
      })
    })

    it('タイトルがない場合はデフォルトタイトルを使用する', () => {
      const content = `- 01/01（月）
- 01/02（火）`

      const result = parseMarkdownContent(content)

      expect(result.title).toBe('スケジュール')
      expect(result.dates).toHaveLength(2)
    })
  })

  describe('exportAsCSV', () => {
    it('CSV形式でエクスポートできる', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）（祝日）`

      exportAsCSV(content)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })
  })

  describe('exportAsExcel', () => {
    it('Excel形式でエクスポートできる', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）`

      exportAsExcel(content)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })
  })

  describe('exportAsPDF', () => {
    it('PDF形式でエクスポートできる', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）`

      exportAsPDF(content)

      expect(window.open).toHaveBeenCalledWith('', '_blank')
    })
  })

  describe('exportAsICS', () => {
    it('ICS形式でエクスポートできる', () => {
      const content = `# テストスケジュール

- 01/01（月）
- 01/02（火）`

      exportAsICS(content)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })

    it('無効な日付は無視される', () => {
      const content = `# テストスケジュール

- 無効な日付
- 01/01（月）`

      // Should not throw an error
      expect(() => exportAsICS(content)).not.toThrow()
    })
  })
})
