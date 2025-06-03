import { act, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  DateListSettingsProvider,
  useDateListSettings
} from './DateListSettingsContext'

// Mock the useDateListGenerator hook
vi.mock('@/hooks/useDateListGenerator', () => ({
  useDateListGenerator: () => ({
    startDate: '2024-01-01',
    setStartDate: vi.fn(),
    endDate: '2024-01-15',
    setEndDate: vi.fn(),
    title: 'Test Schedule',
    setTitle: vi.fn(),
    dateFormat: 'MM/DD（ddd）',
    setDateFormat: vi.fn(),
    generatedList: '',
    handleGenerateList: vi.fn(),
    updateSelectedPreset: vi.fn(),
    applyPreset: vi.fn(),
    copyToClipboard: vi.fn(),
    resetSettings: vi.fn(),
    isGenerateButtonDisabled: false,
    selectedPreset: { type: 'period', value: 14 },
    excludeHolidays: false,
    setExcludeHolidays: vi.fn(),
    excludeJpHolidays: false,
    setExcludeJpHolidays: vi.fn(),
    enableHolidayColors: true,
    setEnableHolidayColors: vi.fn(),
    holidayColor: '#dc2626',
    setHolidayColor: vi.fn(),
    nationalHolidayColor: '#dc2626',
    setNationalHolidayColor: vi.fn()
  })
}))

describe('DateListSettingsContext', () => {
  const TestComponent = () => {
    const context = useDateListSettings()
    return (
      <div>
        <div data-testid='title'>{context.title}</div>
        <div data-testid='start-date'>{context.startDate}</div>
        <div data-testid='end-date'>{context.endDate}</div>
        <div data-testid='date-format'>{context.dateFormat}</div>
        <div data-testid='is-disabled'>
          {context.isGenerateButtonDisabled.toString()}
        </div>
      </div>
    )
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <DateListSettingsProvider>{children}</DateListSettingsProvider>
  )

  it('should provide context values to children', () => {
    render(<TestComponent />, { wrapper })

    expect(screen.getByTestId('title')).toHaveTextContent('Test Schedule')
    expect(screen.getByTestId('start-date')).toHaveTextContent('2024-01-01')
    expect(screen.getByTestId('end-date')).toHaveTextContent('2024-01-15')
    expect(screen.getByTestId('date-format')).toHaveTextContent('MM/DD（ddd）')
    expect(screen.getByTestId('is-disabled')).toHaveTextContent('false')
  })

  it('should provide all hook methods and properties', () => {
    const { result } = renderHook(() => useDateListSettings(), { wrapper })

    expect(result.current).toMatchObject({
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      title: 'Test Schedule',
      dateFormat: 'MM/DD（ddd）',
      generatedList: '',
      isGenerateButtonDisabled: false,
      selectedPreset: { type: 'period', value: 14 },
      excludeHolidays: false,
      excludeJpHolidays: false,
      enableHolidayColors: true,
      holidayColor: '#dc2626',
      nationalHolidayColor: '#dc2626'
    })

    expect(typeof result.current.setStartDate).toBe('function')
    expect(typeof result.current.setEndDate).toBe('function')
    expect(typeof result.current.setTitle).toBe('function')
    expect(typeof result.current.setDateFormat).toBe('function')
    expect(typeof result.current.handleGenerateList).toBe('function')
    expect(typeof result.current.updateSelectedPreset).toBe('function')
    expect(typeof result.current.applyPreset).toBe('function')
    expect(typeof result.current.copyToClipboard).toBe('function')
    expect(typeof result.current.resetSettings).toBe('function')
  })

  it('should throw error when useDateListSettings is used outside provider', () => {
    expect(() => {
      renderHook(() => useDateListSettings())
    }).toThrow(
      'useDateListSettings must be used within DateListSettingsProvider'
    )
  })

  it('should call hook methods when context methods are called', () => {
    const { result } = renderHook(() => useDateListSettings(), { wrapper })

    act(() => {
      result.current.setTitle('New Title')
    })

    expect(result.current.setTitle).toHaveBeenCalledWith('New Title')

    act(() => {
      result.current.handleGenerateList()
    })

    expect(result.current.handleGenerateList).toHaveBeenCalled()

    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.resetSettings).toHaveBeenCalled()
  })
})
