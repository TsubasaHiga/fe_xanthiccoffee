import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDateListGenerator } from './useDateListGenerator'

// Mock the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock the dateUtils
vi.mock('@/utils/dateUtils', () => ({
  getTodayString: vi.fn(() => '2024-01-01'),
  addDays: vi.fn((date, days) => {
    const baseDate = new Date('2024-01-01')
    baseDate.setDate(baseDate.getDate() + days - 1)
    return baseDate.toISOString().split('T')[0]
  }),
  addMonths: vi.fn((date, months) => {
    const baseDate = new Date('2024-01-01')
    baseDate.setMonth(baseDate.getMonth() + months)
    baseDate.setDate(baseDate.getDate() - 1)
    return baseDate.toISOString().split('T')[0]
  }),
  generateDateList: vi.fn(
    () => '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）\n'
  )
}))

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  writable: true
})

describe('useDateListGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDateListGenerator())

    expect(result.current.startDate).toBe('2024-01-01')
    expect(result.current.title).toBe('スケジュール')
    expect(result.current.dateFormat).toBe('MM/DD（ddd）')
    expect(result.current.generatedList).toBe('')
    expect(result.current.excludeHolidays).toBe(false)
    expect(result.current.excludeJpHolidays).toBe(false)
    expect(result.current.enableHolidayColors).toBe(true)
  })

  it('should update title', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setTitle('New Title')
    })

    expect(result.current.title).toBe('New Title')
  })

  it('should update date format', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setDateFormat('YYYY-MM-DD')
    })

    expect(result.current.dateFormat).toBe('YYYY-MM-DD')
  })

  it('should update start date and clear preset', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setStartDate('2024-02-01')
    })

    expect(result.current.startDate).toBe('2024-02-01')
  })

  it('should update end date', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setEndDate('2024-02-01')
    })

    expect(result.current.endDate).toBe('2024-02-01')
  })

  it('should generate list successfully', async () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setTitle('Test Title')
      result.current.setStartDate('2024-01-01')
      result.current.setEndDate('2024-01-02')
    })

    act(() => {
      result.current.handleGenerateList()
    })

    expect(result.current.generatedList).toBe(
      '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）\n'
    )
  })

  it('should handle generate list error', async () => {
    const { generateDateList } = await import('@/utils/dateUtils')
    vi.mocked(generateDateList).mockImplementationOnce(() => {
      throw new Error('Test error')
    })

    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.handleGenerateList()
    })

    const { toast } = await import('sonner')
    expect(toast.error).toHaveBeenCalledWith('Test error', {
      style: { color: '#b91c1c' }
    })
  })

  it('should set preset period', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setPresetPeriod(30)
    })

    expect(result.current.selectedPreset).toEqual({ type: 'period', value: 30 })
  })

  it('should set preset months', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setPresetMonths(3)
    })

    expect(result.current.selectedPreset).toEqual({ type: 'months', value: 3 })
  })

  it('should copy to clipboard successfully', async () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.handleGenerateList()
    })

    await act(async () => {
      await result.current.copyToClipboard()
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '# Test Schedule\n\n- 01/01（月）\n- 01/02（火）\n'
    )

    const { toast } = await import('sonner')
    expect(toast.success).toHaveBeenCalledWith('クリップボードにコピーしました')
  })

  it('should copy custom text to clipboard', async () => {
    const { result } = renderHook(() => useDateListGenerator())

    await act(async () => {
      await result.current.copyToClipboard('Custom text')
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Custom text')
  })

  it('should handle clipboard error', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
      new Error('Clipboard error')
    )

    const { result } = renderHook(() => useDateListGenerator())

    await act(async () => {
      await result.current.copyToClipboard('test')
    })

    const { toast } = await import('sonner')
    expect(toast.error).toHaveBeenCalledWith('コピーに失敗しました', {
      style: { color: '#b91c1c' }
    })
  })

  it('should reset settings to defaults', () => {
    const { result } = renderHook(() => useDateListGenerator())

    // Change some values first
    act(() => {
      result.current.setTitle('Changed Title')
      result.current.setDateFormat('YYYY-MM-DD')
      result.current.setExcludeHolidays(true)
      result.current.setHolidayColor('#ff0000')
    })

    // Reset
    act(() => {
      result.current.resetSettings()
    })

    expect(result.current.title).toBe('スケジュール')
    expect(result.current.dateFormat).toBe('MM/DD（ddd）')
    expect(result.current.excludeHolidays).toBe(false)
    expect(result.current.holidayColor).toBe('#dc2626')
    expect(result.current.generatedList).toBe('')
  })

  it('should disable generate button when required fields are empty', () => {
    const { result } = renderHook(() => useDateListGenerator())

    // Set empty title
    act(() => {
      result.current.setTitle('')
    })

    expect(result.current.isGenerateButtonDisabled).toBe(true)

    // Set valid title
    act(() => {
      result.current.setTitle('Valid Title')
    })

    expect(result.current.isGenerateButtonDisabled).toBe(false)
  })

  it('should update holiday settings', () => {
    const { result } = renderHook(() => useDateListGenerator())

    act(() => {
      result.current.setExcludeHolidays(true)
      result.current.setExcludeJpHolidays(true)
      result.current.setEnableHolidayColors(false)
      result.current.setHolidayColor('#ff0000')
      result.current.setNationalHolidayColor('#00ff00')
    })

    expect(result.current.excludeHolidays).toBe(true)
    expect(result.current.excludeJpHolidays).toBe(true)
    expect(result.current.enableHolidayColors).toBe(false)
    expect(result.current.holidayColor).toBe('#ff0000')
    expect(result.current.nationalHolidayColor).toBe('#00ff00')
  })
})
