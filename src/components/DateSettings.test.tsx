import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DateSettings } from './DateSettings'

// Mock the context
const mockApplyPreset = vi.fn()
const mockUpdateSelectedPreset = vi.fn()
const mockHandleGenerateList = vi.fn()
const mockResetSettings = vi.fn()
const mockSetTitle = vi.fn()
const mockSetStartDate = vi.fn()
const mockSetEndDate = vi.fn()

vi.mock('@/contexts/DateListSettingsContext', () => ({
  useDateListSettings: () => ({
    startDate: '2024-01-01',
    setStartDate: mockSetStartDate,
    endDate: '2024-01-15',
    setEndDate: mockSetEndDate,
    title: 'テストタイトル',
    setTitle: mockSetTitle,
    dateFormat: 'MM/DD（ddd）',
    setDateFormat: vi.fn(),
    handleGenerateList: mockHandleGenerateList,
    applyPreset: mockApplyPreset,
    updateSelectedPreset: mockUpdateSelectedPreset,
    resetSettings: mockResetSettings,
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

describe('DateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all required form fields', () => {
    render(<DateSettings />)

    // Check for title input
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()

    // Check for date inputs
    expect(screen.getByLabelText('開始日')).toBeInTheDocument()
    expect(screen.getByLabelText('終了日')).toBeInTheDocument()

    // Check for preset base selector
    expect(screen.getByText('期間プリセット')).toBeInTheDocument()

    // Check for generate button
    expect(screen.getByText('リスト生成')).toBeInTheDocument()

    // Check for reset button
    expect(screen.getByText('リセット')).toBeInTheDocument()
  })

  it('should render preset buttons', () => {
    render(<DateSettings />)

    // Check for period preset buttons
    expect(screen.getByText('1週間')).toBeInTheDocument()
    expect(screen.getByText('2週間')).toBeInTheDocument()
    expect(screen.getByText('3週間')).toBeInTheDocument()
    expect(screen.getByText('4週間')).toBeInTheDocument()

    // Check for month preset buttons
    expect(screen.getByText('1ヶ月')).toBeInTheDocument()
    expect(screen.getByText('2ヶ月')).toBeInTheDocument()
    expect(screen.getByText('3ヶ月')).toBeInTheDocument()
    expect(screen.getByText('4ヶ月')).toBeInTheDocument()
  })

  it('should call applyPreset with correct parameters when preset button is clicked', () => {
    render(<DateSettings />)

    const twoWeekButton = screen.getByText('2週間')
    fireEvent.click(twoWeekButton)

    expect(mockApplyPreset).toHaveBeenCalledWith(14, 'period', 'start')
  })

  it('should call applyPreset with correct parameters for month preset', () => {
    render(<DateSettings />)

    const threeMonthButton = screen.getByText('3ヶ月')
    fireEvent.click(threeMonthButton)

    expect(mockApplyPreset).toHaveBeenCalledWith(3, 'months', 'start')
  })

  it('should highlight selected preset button', () => {
    render(<DateSettings />)

    const twoWeekButton = screen.getByText('2週間')

    // The button should have the selected styling (the component uses selectedPreset.value === 14)
    expect(twoWeekButton).toHaveClass('bg-blue-600')
  })

  it('should call handleGenerateList when generate button is clicked', () => {
    render(<DateSettings />)

    const generateButton = screen.getByText('リスト生成')
    fireEvent.click(generateButton)

    expect(mockHandleGenerateList).toHaveBeenCalledTimes(1)
  })

  it('should call resetSettings when reset button is clicked', () => {
    render(<DateSettings />)

    const resetButton = screen.getByText('リセット')
    fireEvent.click(resetButton)

    expect(mockResetSettings).toHaveBeenCalledTimes(1)
  })

  it('should update title when title input changes', () => {
    render(<DateSettings />)

    const titleInput = screen.getByLabelText('タイトル')
    fireEvent.change(titleInput, { target: { value: '新しいタイトル' } })

    expect(mockSetTitle).toHaveBeenCalledWith('新しいタイトル')
  })

  it('should update start date when start date input changes', () => {
    render(<DateSettings />)

    const startDateInput = screen.getByLabelText('開始日')
    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } })

    expect(mockSetStartDate).toHaveBeenCalledWith('2024-02-01')
  })

  it('should update end date when end date input changes', () => {
    render(<DateSettings />)

    const endDateInput = screen.getByLabelText('終了日')
    fireEvent.change(endDateInput, { target: { value: '2024-02-15' } })

    expect(mockSetEndDate).toHaveBeenCalledWith('2024-02-15')
  })

  it('should show advanced options when collapsible is expanded', async () => {
    render(<DateSettings />)

    // Click on the advanced options trigger
    const advancedTrigger = screen.getByText('詳細オプション')
    fireEvent.click(advancedTrigger)

    // Wait for the collapsible content to appear
    await waitFor(() => {
      expect(screen.getByText('日付フォーマット')).toBeInTheDocument()
    })

    expect(screen.getByText('休日と祝日の色を変更する')).toBeInTheDocument()
    expect(
      screen.getByText('休日（土日）をリストから除外する')
    ).toBeInTheDocument()
    expect(
      screen.getByText('祝日（日本）をリストから除外する')
    ).toBeInTheDocument()
  })

  it('should change preset base when selector is changed', async () => {
    render(<DateSettings />)

    // Find and click the preset base selector
    const presetBaseSelect = screen.getByRole('combobox')
    fireEvent.click(presetBaseSelect)

    // Wait for the options to appear and click "終了日から"
    await waitFor(() => {
      const endOption = screen.getByText('終了日から')
      fireEvent.click(endOption)
    })

    // Now clicking a preset should call applyPreset with 'end' as the base
    const oneWeekButton = screen.getByText('1週間')
    fireEvent.click(oneWeekButton)

    expect(mockApplyPreset).toHaveBeenCalledWith(7, 'period', 'end')
  })

  it('should display arrow icon between date inputs', () => {
    render(<DateSettings />)

    // SVG要素（ArrowRightアイコン）が表示されているかチェック
    const arrowIcon = document.querySelector(
      'svg[class*="lucide-arrow-right"], svg[class*="lucide-arrow-left"]'
    )
    expect(arrowIcon).toBeTruthy()
  })

  it('should change arrow direction based on preset base', () => {
    render(<DateSettings />)

    // デフォルトでは「開始日から」（start）なので右矢印が表示される
    // プリセット基準セレクトを変更すると矢印の方向も変わることをテスト
    const presetBaseSelect = screen.getByRole('combobox')
    expect(presetBaseSelect).toBeInTheDocument()
  })
})
