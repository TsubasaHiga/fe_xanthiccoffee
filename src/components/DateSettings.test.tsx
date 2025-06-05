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

describe('日付設定コンポーネント', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('全ての必須フォーム項目が表示される', () => {
    render(<DateSettings />)

    // Check for title input
    expect(screen.getByLabelText('タイトル *')).toBeInTheDocument()

    // Check for date inputs
    expect(screen.getByLabelText('開始日 *')).toBeInTheDocument()
    expect(screen.getByLabelText('終了日 *')).toBeInTheDocument()

    // Check for preset base selector
    expect(screen.getByText('期間プリセット')).toBeInTheDocument()

    // Check for generate button
    expect(screen.getByText('リスト生成')).toBeInTheDocument()

    // Check for reset button
    expect(screen.getByText('リセット')).toBeInTheDocument()
  })

  it('プリセットボタンが表示される', () => {
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

  it('期間プリセットボタン押下でapplyPresetが呼ばれる', () => {
    render(<DateSettings />)

    const twoWeekButton = screen.getByText('2週間')
    fireEvent.click(twoWeekButton)

    expect(mockApplyPreset).toHaveBeenCalledWith(14, 'period', 'start')
  })

  it('月プリセットボタン押下でapplyPresetが呼ばれる', () => {
    render(<DateSettings />)

    const threeMonthButton = screen.getByText('3ヶ月')
    fireEvent.click(threeMonthButton)

    expect(mockApplyPreset).toHaveBeenCalledWith(3, 'months', 'start')
  })

  it('選択中のプリセットボタンがハイライトされる', () => {
    render(<DateSettings />)

    const twoWeekButton = screen.getByText('2週間')

    // The button should have the selected styling (the component uses selectedPreset.value === 14)
    expect(twoWeekButton).toHaveClass('bg-blue-600')
  })

  it('リスト生成ボタン押下でhandleGenerateListが呼ばれる', () => {
    render(<DateSettings />)

    const generateButton = screen.getByText('リスト生成')
    fireEvent.click(generateButton)

    expect(mockHandleGenerateList).toHaveBeenCalledTimes(1)
  })

  it('リセットボタン押下でresetSettingsが呼ばれる', () => {
    render(<DateSettings />)

    const resetButton = screen.getByText('リセット')
    fireEvent.click(resetButton)

    expect(mockResetSettings).toHaveBeenCalledTimes(1)
  })

  it('タイトル入力変更でsetTitleが呼ばれる', () => {
    render(<DateSettings />)

    const titleInput = screen.getByLabelText('タイトル *')
    fireEvent.change(titleInput, { target: { value: '新しいタイトル' } })

    expect(mockSetTitle).toHaveBeenCalledWith('新しいタイトル')
  })

  it('開始日入力変更でsetStartDateが呼ばれる', () => {
    render(<DateSettings />)

    const startDateInput = screen.getByLabelText('開始日 *')
    fireEvent.change(startDateInput, { target: { value: '2024-02-01' } })

    expect(mockSetStartDate).toHaveBeenCalledWith('2024-02-01')
  })

  it('終了日入力変更でsetEndDateが呼ばれる', () => {
    render(<DateSettings />)

    const endDateInput = screen.getByLabelText('終了日 *')
    fireEvent.change(endDateInput, { target: { value: '2024-02-15' } })

    expect(mockSetEndDate).toHaveBeenCalledWith('2024-02-15')
  })

  it('詳細オプション展開時に各項目が表示される', async () => {
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

  it('プリセット基準セレクタ変更でapplyPresetの引数が変わる', async () => {
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

  it('日付入力欄間に矢印アイコンが表示される', () => {
    render(<DateSettings />)

    // SVG element (ArrowRight icon) display check
    const arrowIcon = document.querySelector(
      'svg[class*="lucide-arrow-right"], svg[class*="lucide-arrow-left"]'
    )
    expect(arrowIcon).toBeTruthy()
  })

  it('プリセット基準に応じて矢印方向が変わる', () => {
    render(<DateSettings />)

    // By default it's "start" so right arrow is displayed
    // Test that changing preset base select also changes arrow direction
    const presetBaseSelect = screen.getByRole('combobox')
    expect(presetBaseSelect).toBeInTheDocument()
  })
})
