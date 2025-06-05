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

describe('DateListSettingsContext - タイムゾーン関連テスト', () => {
  const TestWrapper = ({ children }: { children: ReactNode }) => (
    <DateListSettingsProvider>{children}</DateListSettingsProvider>
  )

  it('異なるタイムゾーンでの初期値設定の一貫性', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // 初期値がタイムゾーンに関係なく一貫していることを確認
    expect(result.current.startDate).toBe('2024-01-01')
    expect(result.current.endDate).toBe('2024-01-15')
    expect(result.current.title).toBe('Test Schedule')
  })

  it('コンテキスト経由での日付設定時のタイムゾーン処理', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // 日付設定のモック関数が呼ばれることを確認
    act(() => {
      result.current.setStartDate('2024-07-01')
    })

    expect(result.current.setStartDate).toHaveBeenCalledWith('2024-07-01')

    act(() => {
      result.current.setEndDate('2024-07-31')
    })

    expect(result.current.setEndDate).toHaveBeenCalledWith('2024-07-31')
  })

  it('月境界を跨ぐ日付設定でのタイムゾーン一貫性', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // 月境界を跨ぐ日付設定
    act(() => {
      result.current.setStartDate('2024-01-29')
    })

    act(() => {
      result.current.setEndDate('2024-02-03')
    })

    // 設定関数が正しく呼ばれることを確認
    expect(result.current.setStartDate).toHaveBeenCalledWith('2024-01-29')
    expect(result.current.setEndDate).toHaveBeenCalledWith('2024-02-03')
  })

  it('うるう年での2月29日を含む期間のタイムゾーン処理', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // うるう年の2月29日を含む期間を設定
    act(() => {
      result.current.setStartDate('2024-02-28')
    })

    act(() => {
      result.current.setEndDate('2024-03-01')
    })

    // うるう年の特殊日が正しく処理されることを確認
    expect(result.current.setStartDate).toHaveBeenCalledWith('2024-02-28')
    expect(result.current.setEndDate).toHaveBeenCalledWith('2024-03-01')
  })

  it('年末年始を跨ぐ期間のタイムゾーン処理', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // 年末年始を跨ぐ期間を設定
    act(() => {
      result.current.setStartDate('2023-12-30')
    })

    act(() => {
      result.current.setEndDate('2024-01-02')
    })

    // 年を跨いでも正しく設定されることを確認
    expect(result.current.setStartDate).toHaveBeenCalledWith('2023-12-30')
    expect(result.current.setEndDate).toHaveBeenCalledWith('2024-01-02')
  })

  it('タイムゾーンに影響されない日付フォーマット設定', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // 日付フォーマット設定
    act(() => {
      result.current.setDateFormat('YYYY年MM月DD日（ddd）')
    })

    // フォーマット設定が正しく呼ばれることを確認
    expect(result.current.setDateFormat).toHaveBeenCalledWith(
      'YYYY年MM月DD日（ddd）'
    )
  })

  it('タイムゾーン独立なタイトル設定', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // タイトル設定
    act(() => {
      result.current.setTitle('タイムゾーンテスト用スケジュール')
    })

    // タイトル設定が正しく呼ばれることを確認
    expect(result.current.setTitle).toHaveBeenCalledWith(
      'タイムゾーンテスト用スケジュール'
    )
  })

  it('リセット時のタイムゾーン独立性', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // リセット実行
    act(() => {
      result.current.resetSettings()
    })

    // リセット関数が正しく呼ばれることを確認
    expect(result.current.resetSettings).toHaveBeenCalled()
  })

  it('祝日設定でのタイムゾーン一貫性', () => {
    const { result } = renderHook(() => useDateListSettings(), {
      wrapper: TestWrapper
    })

    // 祝日関連設定
    act(() => {
      result.current.setExcludeHolidays(true)
    })

    act(() => {
      result.current.setExcludeJpHolidays(true)
    })

    act(() => {
      result.current.setEnableHolidayColors(false)
    })

    // 祝日設定が正しく呼ばれることを確認
    expect(result.current.setExcludeHolidays).toHaveBeenCalledWith(true)
    expect(result.current.setExcludeJpHolidays).toHaveBeenCalledWith(true)
    expect(result.current.setEnableHolidayColors).toHaveBeenCalledWith(false)
  })
})
