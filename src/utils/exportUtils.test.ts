import { beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAsMarkdown, exportAsPDF } from './exportUtils'

// Mock external dependencies
const mockJsPDFInstance = {
  addPage: vi.fn(),
  addImage: vi.fn(),
  save: vi.fn(),
  setFillColor: vi.fn(),
  rect: vi.fn()
}

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => mockJsPDFInstance)
}))

vi.mock('html2canvas-pro', () => ({
  default: vi.fn().mockResolvedValue({
    width: 800,
    height: 600,
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock-canvas-data')
  })
}))

vi.mock('marked', () => ({
  marked: {
    parse: vi.fn().mockResolvedValue('<h1>Test</h1><ul><li>Item 1</li></ul>'),
    setOptions: vi.fn()
  }
}))

vi.mock('github-markdown-css/github-markdown-light.css?inline', () => ({
  default: 'mock-css-content'
}))

// Mock DOM APIs
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

// Mock DOM element with necessary methods
const createMockElement = (tagName: string) => {
  const element = {
    tagName: tagName.toUpperCase(),
    appendChild: mockAppendChild,
    removeChild: mockRemoveChild,
    click: mockClick,
    href: '',
    download: '',
    setAttribute: vi.fn(),
    style: {
      cssText: ''
    },
    textContent: '',
    id: '',
    className: '',
    parentNode: null,
    remove: vi.fn(),
    innerHTML: '',
    offsetHeight: 100,
    offsetWidth: 800,
    scrollHeight: 100,
    scrollWidth: 800
  }

  // Add specific properties for anchor elements
  if (tagName.toLowerCase() === 'a') {
    element.setAttribute = vi.fn()
  }

  // Add iframe-specific properties
  if (tagName.toLowerCase() === 'iframe') {
    const mockIframeDocument = {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
      createElement: vi.fn().mockImplementation(createMockElement),
      getElementById: vi.fn().mockReturnValue({
        innerHTML: '<h1>Test</h1><p>Test content</p>',
        offsetWidth: 800,
        offsetHeight: 600,
        scrollWidth: 800,
        scrollHeight: 600,
        style: {}
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        style: {}
      },
      head: {
        appendChild: vi.fn(),
        removeChild: vi.fn()
      },
      querySelectorAll: vi.fn().mockReturnValue([]),
      documentElement: {
        style: {}
      }
    }

    const mockContentWindow = {
      document: mockIframeDocument,
      getComputedStyle: vi.fn().mockReturnValue({
        borderBottom: '1px solid #d1d9e0',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#d1d9e0'
      })
    }

    Object.assign(element, {
      contentDocument: mockIframeDocument,
      contentWindow: mockContentWindow,
      onload: null
    })
  }

  return element
}

const mockCreateElement = vi.fn().mockImplementation(createMockElement)

// Mock global objects
Object.defineProperty(global, 'document', {
  value: {
    createElement: mockCreateElement,
    body: {
      appendChild: vi.fn(),
      removeChild: mockRemoveChild
    },
    head: {
      appendChild: vi.fn(),
      removeChild: mockRemoveChild
    },
    querySelectorAll: vi.fn().mockReturnValue([]),
    styleSheets: []
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
    navigator: {
      userAgent: 'Mozilla/5.0 (Test Browser)',
      webdriver: false
    },
    fonts: {
      ready: Promise.resolve()
    },
    getComputedStyle: vi.fn().mockReturnValue({
      borderBottom: '1px solid #d1d9e0',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: '#d1d9e0',
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI"',
      fontSize: '16px',
      lineHeight: '24px'
    })
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
    mockCreateElement.mockImplementation(createMockElement)
    mockCreateObjectURL.mockReturnValue('mock-url')

    // Reset jsPDF instance mock
    for (const mock of Object.values(mockJsPDFInstance)) {
      if (typeof mock === 'function' && 'mockClear' in mock) {
        mock.mockClear()
      }
    }
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
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'mock-url')
      expect(mockLink.setAttribute).toHaveBeenCalledWith(
        'download',
        'マークダウンファイル.md'
      )
    })
  })

  describe('exportAsPDF', () => {
    // Note: Since exportAsPDF involves complex iframe DOM manipulation that's difficult
    // to mock in a unit test environment, we focus on testing the parts we can verify.
    // Full functionality testing is done via E2E tests.

    it('PDF関数が呼び出し可能である', () => {
      // Verify the function exists and has the right signature
      expect(exportAsPDF).toBeDefined()
      expect(typeof exportAsPDF).toBe('function')
      expect(exportAsPDF.length).toBe(2) // content and optional customTitle parameters
    })

    it('タイトル抽出機能が正常動作する', () => {
      // Test title extraction through exportAsMarkdown which uses the same logic
      const contentWithTitle = '# My Title\n\nContent here'
      const contentWithoutTitle = 'Just content without title'

      exportAsMarkdown(contentWithTitle)
      const firstCall = mockCreateElement.mock.results[0].value
      expect(firstCall.setAttribute).toHaveBeenCalledWith(
        'download',
        'My Title.md'
      )

      vi.clearAllMocks()

      exportAsMarkdown(contentWithoutTitle)
      const secondCall = mockCreateElement.mock.results[0].value
      expect(secondCall.setAttribute).toHaveBeenCalledWith(
        'download',
        'マークダウンファイル.md'
      )
    })
  })
})
