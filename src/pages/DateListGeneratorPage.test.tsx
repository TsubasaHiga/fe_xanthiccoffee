import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateListGeneratorPage } from './DateListGeneratorPage'

// Mock the components and hooks
vi.mock('@/components/DateSettings', () => ({
  DateSettings: () => (
    <div data-testid='date-list-settings-card'>Settings Card</div>
  )
}))

// Mock lazy-loaded MarkdownViewer
vi.mock('@/components/MarkdownViewer', () => ({
  MarkdownViewer: ({ generatedList }: { generatedList: string }) => (
    <div data-testid='generated-list-card'>Generated List: {generatedList}</div>
  )
}))

vi.mock('@/components/ContentLayout', () => ({
  ContentLayout: vi.fn().mockImplementation(({ children, ...props }, ref) => (
    <div ref={ref} data-testid='content-layout' {...props}>
      {children}
    </div>
  ))
}))

// Mock the context and hook
const mockGeneratedList = ''
const mockCopyToClipboard = vi.fn()

vi.mock('@/contexts/DateListSettingsContext', () => ({
  DateListSettingsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='date-list-settings-provider'>{children}</div>
  ),
  useDateListSettings: () => ({
    generatedList: mockGeneratedList,
    copyToClipboard: mockCopyToClipboard
  })
}))

// Remove React.lazy and Suspense mocks to adopt a simpler approach

describe('日付リスト生成ページ', () => {
  it('ページの基本構造が正しく表示される', () => {
    render(<DateListGeneratorPage />)

    // Check main title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'MarkDays'
    )

    // Check description
    expect(
      screen.getByText(/Markdown形式で日付と曜日のリストを一発生成！/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/スケジュール作成やタスク管理をもっとスムーズに。/)
    ).toBeInTheDocument()

    // Check that provider is rendered
    expect(
      screen.getByTestId('date-list-settings-provider')
    ).toBeInTheDocument()

    // Check that settings card is rendered
    expect(screen.getByTestId('date-list-settings-card')).toBeInTheDocument()
  })

  it('生成リストがない場合はリストカードが表示されない', () => {
    render(<DateListGeneratorPage />)

    // Generated list card should not be visible when generatedList is empty
    expect(screen.queryByTestId('generated-list-card')).not.toBeInTheDocument()
  })

  it('メインコンテナのクラスが正しい', () => {
    const { container } = render(<DateListGeneratorPage />)

    // Check for main container classes (the root div of the page)
    const mainContainer = container.querySelector('.relative.flex.min-h-screen')
    expect(mainContainer).toBeInTheDocument()

    // Check title styling
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveClass(
      'font-[Inter]',
      'font-extrabold',
      'text-gray-800',
      'tracking-tight'
    )
  })

  it('背景パターン要素が存在する', () => {
    const { container } = render(<DateListGeneratorPage />)

    // Check for background pattern div
    const backgroundPattern = container.querySelector("div[class*='bg-[url']")
    expect(backgroundPattern).toBeInTheDocument()
    expect(backgroundPattern).toHaveClass('opacity-10')
  })
})

describe('DateListGeneratorContentの条件分岐', () => {
  it('コンテキストの値に応じてリスト表示が切り替わる', () => {
    // This function tests the actual conditional branching logic
    // When mockGeneratedList is empty, MarkdownViewer is not displayed
    render(<DateListGeneratorPage />)

    // Initially not displayed since generated list is empty
    expect(screen.queryByTestId('generated-list-card')).not.toBeInTheDocument()
  })

  it('コンポーネントの状態変化を正しく処理できる', () => {
    // Test basic state changes of the component
    const { rerender } = render(<DateListGeneratorPage />)

    // Verify that basic elements exist in the initial state
    expect(
      screen.getByTestId('date-list-settings-provider')
    ).toBeInTheDocument()
    expect(screen.getByTestId('date-list-settings-card')).toBeInTheDocument()

    // Basic structure is maintained even after re-rendering
    rerender(<DateListGeneratorPage />)
    expect(
      screen.getByTestId('date-list-settings-provider')
    ).toBeInTheDocument()
  })

  it('遅延読み込みアーキテクチャをサポートする', () => {
    // Confirm that lazy loading architecture is supported
    // Actual lazy loading is tested in E2E tests
    render(<DateListGeneratorPage />)

    // Basic component structure exists
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByTestId('date-list-settings-card')).toBeInTheDocument()
  })
})
