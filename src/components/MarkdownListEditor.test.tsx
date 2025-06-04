import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MarkdownListEditor } from './MarkdownListEditor'

// Mock @uiw/react-md-editor components
vi.mock('@uiw/react-md-editor', () => ({
  default: vi.fn(({ value, onChange, preview, hideToolbar }) => {
    if (preview === 'preview' || hideToolbar) {
      // プレビューモード
      return <div data-testid='md-preview'>{value}</div>
    }
    // 編集モード
    return (
      <textarea
        data-testid='md-editor'
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    )
  })
}))

// Mock MdEditor component
vi.mock('./MdEditor', () => ({
  MdEditor: vi.fn(({ value, onChange, preview, readOnly }) => {
    if (preview === 'preview' || readOnly) {
      // プレビューモード
      return <div data-testid='md-preview'>{value}</div>
    }
    // 編集モード
    return (
      <textarea
        data-testid='md-editor'
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    )
  })
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Copy: vi.fn(() => <span data-testid='copy-icon'>Copy Icon</span>)
}))

describe('MarkdownListEditor', () => {
  const defaultProps = {
    generatedList: '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）',
    copyToClipboard: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with generated list content', () => {
    render(<MarkdownListEditor {...defaultProps} />)

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

  it('should show copy button', () => {
    render(<MarkdownListEditor {...defaultProps} />)

    const copyButton = screen.getByRole('button', { name: /コピー/i })
    expect(copyButton).toBeInTheDocument()
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
  })

  it('should call copyToClipboard when copy button is clicked', () => {
    const mockCopyToClipboard = vi.fn()
    render(
      <MarkdownListEditor
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
    render(<MarkdownListEditor {...defaultProps} />)

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
    const { rerender } = render(<MarkdownListEditor {...defaultProps} />)

    expect(screen.getByTestId('md-preview')).toHaveTextContent(
      '# Test Schedule'
    )

    // Change the generatedList prop
    rerender(
      <MarkdownListEditor
        {...defaultProps}
        generatedList='# New Schedule\n\n- 02/01（木）'
      />
    )

    expect(screen.getByTestId('md-preview')).toHaveTextContent('# New Schedule')
  })

  it('should update editor value when typing in edit mode', () => {
    const mockCopyToClipboard = vi.fn()
    render(
      <MarkdownListEditor
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
    render(<MarkdownListEditor {...defaultProps} />)

    const card = screen.getByTestId('generated-list-card')
    expect(card).toHaveClass('z-10', 'mb-8', 'rounded-2xl', 'border')

    const listContainer = screen.getByTestId('generated-list')
    expect(listContainer).toHaveAttribute('data-color-mode', 'light')
  })
})
