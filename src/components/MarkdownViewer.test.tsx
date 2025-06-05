import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MarkdownViewer } from './MarkdownViewer'

// Mock md-editor-rt components
vi.mock('md-editor-rt', () => ({
  MdEditor: vi.fn(({ value, onChange, placeholder }) => (
    <textarea
      data-testid='md-editor'
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
    />
  )),
  MdPreview: vi.fn(({ value }) => <div data-testid='md-preview'>{value}</div>),
  config: vi.fn()
}))

// Mock dynamic components
vi.mock('./DynamicMdEditor', () => ({
  DynamicMdEditor: vi.fn(({ value, onChange, placeholder }) => (
    <textarea
      data-testid='md-editor'
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
    />
  ))
}))

vi.mock('./MdPreview', () => ({
  MdPreview: vi.fn(({ value }) => <div data-testid='md-preview'>{value}</div>)
}))

// Mock @codemirror/view
vi.mock('@codemirror/view', () => ({
  lineNumbers: vi.fn(() => 'lineNumbers-extension')
}))

// Mock @vavt/cm-extension
vi.mock('@vavt/cm-extension/dist/locale/jp-JP', () => ({
  default: 'jp-JP-locale'
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Copy: vi.fn(() => <span data-testid='copy-icon'>Copy Icon</span>),
  FileSpreadsheet: vi.fn(() => (
    <span data-testid='spreadsheet-icon'>Spreadsheet Icon</span>
  )),
  FileText: vi.fn(() => (
    <span data-testid='file-text-icon'>File Text Icon</span>
  )),
  Calendar: vi.fn(() => <span data-testid='calendar-icon'>Calendar Icon</span>)
}))

describe('MarkdownViewerコンポーネント', () => {
  const defaultProps = {
    generatedList: '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）',
    copyToClipboard: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('生成リスト内容が正しく表示される', () => {
    render(<MarkdownViewer {...defaultProps} />)

    expect(screen.getByTestId('generated-list-card')).toBeInTheDocument()
    expect(screen.getByText('生成されたリスト')).toBeInTheDocument()
    expect(
      screen.getByText(
        '以下のマークダウンをコピーしてご利用ください。必要に応じて編集も可能です。'
      )
    ).toBeInTheDocument()
    expect(screen.getByTestId('md-preview')).toHaveTextContent(
      '# Test Schedule'
    )
  })

  it('onMountコールバックがマウント時に呼ばれる', () => {
    const mockOnMount = vi.fn()
    render(<MarkdownViewer {...defaultProps} onMount={mockOnMount} />)

    // Verify that onMount callback is called
    expect(mockOnMount).toHaveBeenCalledTimes(1)
  })

  it('onMount未指定でもエラーにならない', () => {
    // Verify that rendering without onMount property doesn't cause errors
    expect(() => {
      render(<MarkdownViewer {...defaultProps} />)
    }).not.toThrow()
  })

  it('コピー用ボタンが表示される', () => {
    render(<MarkdownViewer {...defaultProps} />)

    const copyButton = screen.getByRole('button', { name: /コピー/i })
    expect(copyButton).toBeInTheDocument()
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
  })

  it('コピー用ボタン押下でcopyToClipboardが呼ばれる', () => {
    const mockCopyToClipboard = vi.fn()
    render(
      <MarkdownViewer {...defaultProps} copyToClipboard={mockCopyToClipboard} />
    )

    const copyButton = screen.getByRole('button', { name: /コピー/i })
    fireEvent.click(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）'
    )
  })

  it('プレビュー/編集モードが切り替えられる', () => {
    render(<MarkdownViewer {...defaultProps} />)

    // Initially in preview mode
    expect(screen.getByTestId('md-preview')).toBeInTheDocument()
    expect(screen.queryByTestId('md-editor')).not.toBeInTheDocument()

    const editButton = screen.getByRole('button', { name: '編集する' })
    fireEvent.click(editButton)

    // Now in edit mode
    expect(screen.queryByTestId('md-preview')).not.toBeInTheDocument()
    expect(screen.getByTestId('md-editor')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'プレビューに戻す' })
    ).toBeInTheDocument()

    // Toggle back to preview
    const previewButton = screen.getByRole('button', {
      name: 'プレビューに戻す'
    })
    fireEvent.click(previewButton)

    expect(screen.getByTestId('md-preview')).toBeInTheDocument()
    expect(screen.queryByTestId('md-editor')).not.toBeInTheDocument()
  })

  it('generatedListの変更で内容が更新される', () => {
    const { rerender } = render(<MarkdownViewer {...defaultProps} />)

    expect(screen.getByTestId('md-preview')).toHaveTextContent(
      '# Test Schedule'
    )

    // Change the generatedList prop
    rerender(
      <MarkdownViewer
        {...defaultProps}
        generatedList='# New Schedule\n\n- 02/01（木）'
      />
    )

    expect(screen.getByTestId('md-preview')).toHaveTextContent('# New Schedule')
  })

  it('編集モードで入力値が更新されコピーも反映される', () => {
    const mockCopyToClipboard = vi.fn()
    render(
      <MarkdownViewer {...defaultProps} copyToClipboard={mockCopyToClipboard} />
    )

    // Switch to edit mode
    const editButton = screen.getByRole('button', { name: '編集する' })
    fireEvent.click(editButton)

    const editor = screen.getByTestId('md-editor')
    fireEvent.change(editor, { target: { value: '# Modified Schedule' } })

    // Copy should use the modified value
    const copyButton = screen.getByRole('button', { name: /コピー/i })
    fireEvent.click(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledWith('# Modified Schedule')
  })

  it('テストIDやスタイルが正しい', () => {
    render(<MarkdownViewer {...defaultProps} />)

    const card = screen.getByTestId('generated-list-card')
    expect(card).toHaveClass('z-10', 'mb-8', 'rounded-2xl', 'border')

    const listContainer = screen.getByTestId('generated-list')
    expect(listContainer).toHaveAttribute('data-color-mode', 'light')
  })

  describe('エクスポート機能', () => {
    it('CSV エクスポートボタンが正しく動作する', () => {
      const mockExportCSV = vi.fn()
      render(<MarkdownViewer {...defaultProps} exportCSV={mockExportCSV} />)

      const csvButton = screen.getByRole('button', { name: /CSV/i })
      fireEvent.click(csvButton)

      expect(mockExportCSV).toHaveBeenCalled()
    })

    it('Excel エクスポートボタンが正しく動作する', () => {
      const mockExportExcel = vi.fn()
      render(<MarkdownViewer {...defaultProps} exportExcel={mockExportExcel} />)

      const excelButton = screen.getByRole('button', { name: /Excel/i })
      fireEvent.click(excelButton)

      expect(mockExportExcel).toHaveBeenCalled()
    })

    it('PDF エクスポートボタンが正しく動作する', () => {
      const mockExportPDF = vi.fn()
      render(<MarkdownViewer {...defaultProps} exportPDF={mockExportPDF} />)

      const pdfButton = screen.getByRole('button', { name: /PDF/i })
      fireEvent.click(pdfButton)

      expect(mockExportPDF).toHaveBeenCalled()
    })

    it('カレンダー エクスポートボタンが正しく動作する', () => {
      const mockExportICS = vi.fn()
      render(<MarkdownViewer {...defaultProps} exportICS={mockExportICS} />)

      const icsButton = screen.getByRole('button', { name: /カレンダー/i })
      fireEvent.click(icsButton)

      expect(mockExportICS).toHaveBeenCalled()
    })

    it('エクスポート関数が提供されない場合はボタンが表示されない', () => {
      render(<MarkdownViewer {...defaultProps} />)

      expect(
        screen.queryByRole('button', { name: /CSV/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /Excel/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /PDF/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /カレンダー/i })
      ).not.toBeInTheDocument()
    })

    it('すべてのエクスポート機能が提供された場合、すべてのボタンが表示される', () => {
      const mockExportCSV = vi.fn()
      const mockExportExcel = vi.fn()
      const mockExportPDF = vi.fn()
      const mockExportICS = vi.fn()

      render(
        <MarkdownViewer
          {...defaultProps}
          exportCSV={mockExportCSV}
          exportExcel={mockExportExcel}
          exportPDF={mockExportPDF}
          exportICS={mockExportICS}
        />
      )

      expect(screen.getByRole('button', { name: /CSV/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Excel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /PDF/i })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /カレンダー/i })
      ).toBeInTheDocument()
    })

    it('エクスポートボタンが適切なスタイルクラスを持つ', () => {
      const mockExportCSV = vi.fn()
      const mockExportPDF = vi.fn()
      const mockExportICS = vi.fn()

      render(
        <MarkdownViewer
          {...defaultProps}
          exportCSV={mockExportCSV}
          exportPDF={mockExportPDF}
          exportICS={mockExportICS}
        />
      )

      const csvButton = screen.getByRole('button', { name: /CSV/i })
      const pdfButton = screen.getByRole('button', { name: /PDF/i })
      const icsButton = screen.getByRole('button', { name: /カレンダー/i })

      expect(csvButton).toHaveClass('border-green-300', 'text-green-600')
      expect(pdfButton).toHaveClass('border-red-300', 'text-red-600')
      expect(icsButton).toHaveClass('border-purple-300', 'text-purple-600')
    })
  })
})
