import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneratedListCardV3 } from './GeneratedListCardV3'

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

vi.mock('@/hooks/useMdEditorPreload', () => ({
  useMdEditorPreload: () => ({
    preloadMdEditor: vi.fn()
  })
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
  Copy: vi.fn(() => <span data-testid='copy-icon'>Copy Icon</span>)
}))

describe('GeneratedListCardV3', () => {
  const defaultProps = {
    generatedList: '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）',
    copyToClipboard: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with generated list content', () => {
    render(<GeneratedListCardV3 {...defaultProps} />)

    expect(screen.getByTestId('generated-list-card')).toBeInTheDocument()
    expect(screen.getByText('生成されたリスト')).toBeInTheDocument()
    expect(
      screen.getByText('以下のマークダウンをコピーしてご利用ください')
    ).toBeInTheDocument()
    expect(screen.getByTestId('md-preview')).toHaveTextContent(
      '# Test Schedule'
    )
  })

  it('should show copy button', () => {
    render(<GeneratedListCardV3 {...defaultProps} />)

    const copyButton = screen.getByRole('button', { name: /コピー/i })
    expect(copyButton).toBeInTheDocument()
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
  })

  it('should call copyToClipboard when copy button is clicked', () => {
    const mockCopyToClipboard = vi.fn()
    render(
      <GeneratedListCardV3
        {...defaultProps}
        copyToClipboard={mockCopyToClipboard}
      />
    )

    const copyButton = screen.getByRole('button', { name: /コピー/i })
    fireEvent.click(copyButton)

    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）'
    )
  })

  it('should toggle between preview and edit mode', () => {
    render(<GeneratedListCardV3 {...defaultProps} />)

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

  it('should update value when generatedList prop changes', () => {
    const { rerender } = render(<GeneratedListCardV3 {...defaultProps} />)

    expect(screen.getByTestId('md-preview')).toHaveTextContent(
      '# Test Schedule'
    )

    // Change the generatedList prop
    rerender(
      <GeneratedListCardV3
        {...defaultProps}
        generatedList='# New Schedule\n\n- 02/01（木）'
      />
    )

    expect(screen.getByTestId('md-preview')).toHaveTextContent('# New Schedule')
  })

  it('should update editor value when typing in edit mode', () => {
    const mockCopyToClipboard = vi.fn()
    render(
      <GeneratedListCardV3
        {...defaultProps}
        copyToClipboard={mockCopyToClipboard}
      />
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

  it('should have correct test ids and styling', () => {
    render(<GeneratedListCardV3 {...defaultProps} />)

    const card = screen.getByTestId('generated-list-card')
    expect(card).toHaveClass('z-10', 'mb-8', 'rounded-2xl', 'border')

    const listContainer = screen.getByTestId('generated-list')
    expect(listContainer).toHaveAttribute('data-color-mode', 'light')
  })
})
