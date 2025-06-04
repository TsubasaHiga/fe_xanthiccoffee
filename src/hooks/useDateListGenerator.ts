import { addDays, generateDateList, getTodayString } from '@/utils/dateUtils'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// 型定義
type PresetType = 'period' | 'months'
type Preset = { type: PresetType; value: number }

// 定数
const INITIAL_END_DATE = 14
const DEFAULT_HOLIDAY_COLOR = '#dc2626'

export const useDateListGenerator = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [title, setTitle] = useState('スケジュール')
  const [dateFormat, setDateFormat] = useState('MM/DD（ddd）')
  const [generatedList, setGeneratedList] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstGeneration, setIsFirstGeneration] = useState(true)

  // プリセット選択状態
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>({
    type: 'period',
    value: INITIAL_END_DATE
  })

  // 休日設定
  const [excludeHolidays, setExcludeHolidays] = useState(false)
  const [excludeJpHolidays, setExcludeJpHolidays] = useState(false)
  const [enableHolidayColors, setEnableHolidayColors] = useState(true)
  const [holidayColor, setHolidayColor] = useState(DEFAULT_HOLIDAY_COLOR)
  const [nationalHolidayColor, setNationalHolidayColor] = useState(
    DEFAULT_HOLIDAY_COLOR
  )

  useEffect(() => {
    setStartDate(getTodayString())
    setEndDate(addDays(getTodayString(), INITIAL_END_DATE))
  }, [])

  // 生成処理の依存関係をメモ化
  const generateListDependencies = useMemo(
    () => ({
      startDate,
      endDate,
      title,
      dateFormat,
      excludeHolidays,
      excludeJpHolidays,
      enableHolidayColors,
      holidayColor,
      nationalHolidayColor
    }),
    [
      startDate,
      endDate,
      title,
      dateFormat,
      excludeHolidays,
      excludeJpHolidays,
      enableHolidayColors,
      holidayColor,
      nationalHolidayColor
    ]
  )

  const handleGenerateList = useCallback(async () => {
    try {
      if (isFirstGeneration) {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      const {
        startDate,
        endDate,
        title,
        dateFormat,
        excludeHolidays,
        excludeJpHolidays,
        enableHolidayColors,
        holidayColor,
        nationalHolidayColor
      } = generateListDependencies
      const result = generateDateList(
        startDate,
        endDate,
        title,
        dateFormat,
        excludeHolidays,
        excludeJpHolidays,
        enableHolidayColors,
        holidayColor,
        nationalHolidayColor
      )
      setGeneratedList(result)
      if (isFirstGeneration) {
        setIsFirstGeneration(false)
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'エラーが発生しました',
        { style: { color: '#b91c1c' } }
      )
    } finally {
      if (isFirstGeneration) {
        setIsLoading(false)
      }
    }
  }, [generateListDependencies, isFirstGeneration])

  // プリセット選択状態を更新する関数（日付変更は行わない）
  const updateSelectedPreset = useCallback((preset: Preset) => {
    setSelectedPreset(preset)
  }, []) // 日付計算の共通ロジック
  const calculateDateFromPreset = useCallback(
    (
      baseDate: string,
      value: number,
      type: PresetType,
      direction: 'forward' | 'backward'
    ): string => {
      if (!baseDate) return ''

      const multiplier = direction === 'backward' ? -1 : 1

      // dayjsを使ってタイムゾーンの影響を避ける
      let date = dayjs(baseDate)

      if (type === 'period') {
        date = date.add(value * multiplier, 'day')
      } else {
        date = date.add(value * multiplier, 'month')
      }

      return date.format('YYYY-MM-DD')
    },
    []
  )

  // プリセット適用の統合関数
  const applyPreset = useCallback(
    (value: number, type: PresetType, base: 'start' | 'end') => {
      if (base === 'start' && startDate) {
        const newEndDate = calculateDateFromPreset(
          startDate,
          value,
          type,
          'forward'
        )
        setEndDate(newEndDate)
      } else if (base === 'end' && endDate) {
        const newStartDate = calculateDateFromPreset(
          endDate,
          value,
          type,
          'backward'
        )
        setStartDate(newStartDate)
      }

      updateSelectedPreset({ type, value })
    },
    [startDate, endDate, calculateDateFromPreset, updateSelectedPreset]
  )

  const copyToClipboard = useCallback(
    async (text?: string) => {
      try {
        await navigator.clipboard.writeText(text || generatedList)
        toast.success('クリップボードにコピーしました')
      } catch (err) {
        console.error('コピーに失敗しました:', err)
        toast.error('コピーに失敗しました', {
          style: { color: '#b91c1c' }
        })
      }
    },
    [generatedList]
  )

  const resetSettings = useCallback(() => {
    setTitle('スケジュール')
    setDateFormat('MM/DD（ddd）')
    setStartDate(getTodayString())
    setEndDate(addDays(getTodayString(), INITIAL_END_DATE))
    setGeneratedList('')
    setSelectedPreset({ type: 'period', value: INITIAL_END_DATE })
    setExcludeHolidays(false)
    setExcludeJpHolidays(false)
    setEnableHolidayColors(true)
    setHolidayColor(DEFAULT_HOLIDAY_COLOR)
    setNationalHolidayColor(DEFAULT_HOLIDAY_COLOR)
    setIsLoading(false)
  }, [])

  // バリデーション状態をメモ化
  const isGenerateButtonDisabled = useMemo(() => {
    return !title.trim() || !startDate || !endDate
  }, [title, startDate, endDate])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    dateFormat,
    setDateFormat,
    generatedList,
    isLoading,
    isFirstGeneration,
    handleGenerateList,
    updateSelectedPreset,
    applyPreset,
    copyToClipboard,
    resetSettings,
    isGenerateButtonDisabled,
    selectedPreset,
    excludeHolidays,
    setExcludeHolidays,
    excludeJpHolidays,
    setExcludeJpHolidays,
    enableHolidayColors,
    setEnableHolidayColors,
    holidayColor,
    setHolidayColor,
    nationalHolidayColor,
    setNationalHolidayColor
  }
}
