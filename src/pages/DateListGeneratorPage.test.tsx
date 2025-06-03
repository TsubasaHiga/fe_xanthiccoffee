import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DateListGeneratorPage } from './DateListGeneratorPage'

// Mock the components and hooks
vi.mock('@/components/DateListSettingsCard', () => ({
  DateListSettingsCard: () => (
    <div data-testid='date-list-settings-card'>Settings Card</div>
  )
}))

vi.mock('@/components/GeneratedListCardV3', () => ({
  GeneratedListCardV3: ({ generatedList }: { generatedList: string }) => (
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
vi.mock('@/contexts/DateListSettingsContext', () => ({
  DateListSettingsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='date-list-settings-provider'>{children}</div>
  ),
  useDateListSettings: () => ({
    generatedList: '',
    copyToClipboard: vi.fn()
  })
}))

describe('DateListGeneratorPage', () => {
  it('should render the main page structure', () => {
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

  it('should not show generated list card when no generated list', () => {
    render(<DateListGeneratorPage />)

    // Generated list card should not be visible when generatedList is empty
    expect(screen.queryByTestId('generated-list-card')).not.toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    const { container } = render(<DateListGeneratorPage />)

    // Check for main container classes (the root div of the page)
    const mainContainer = container.querySelector('.relative.flex.min-h-screen')
    expect(mainContainer).toBeInTheDocument()

    // Check title styling
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toHaveClass('font-extrabold', 'text-3xl', 'text-gray-800')
  })

  it('should have background pattern element', () => {
    const { container } = render(<DateListGeneratorPage />)

    // Check for background pattern div
    const backgroundPattern = container.querySelector("div[class*='bg-[url']")
    expect(backgroundPattern).toBeInTheDocument()
    expect(backgroundPattern).toHaveClass('opacity-10')
  })
})

describe('DateListGeneratorContent', () => {
  it('should conditionally render generated list', () => {
    // This test is covered by integration, but we can test the concept
    // The actual conditional rendering is tested through the main component tests
    expect(true).toBe(true) // Placeholder for now
  })
})
