import { addDays, generateDateList, getTodayString } from '@/utils/dateUtils'
import { exportAsMarkdown, exportAsPDF } from '@/utils/exportUtils'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// 型定義
type PresetType = 'period' | 'months'

interface Preset {
  readonly type: PresetType
  readonly value: number
}

// 定数
const INITIAL_END_DATE = 14
const DEFAULT_HOLIDAY_COLOR = '#dc2626'
const DEFAULT_TITLE = 'スケジュール'
const DEFAULT_DATE_FORMAT = 'MM/DD（ddd）'

export const useDateListGenerator = () => {
  // 基本状態
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [dateFormat, setDateFormat] = useState(DEFAULT_DATE_FORMAT)
  const [generatedList, setGeneratedList] = useState('')

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstGeneration, setIsFirstGeneration] = useState(true)
  const [isWaitingForLazyLoad, setIsWaitingForLazyLoad] = useState(false)

  // プリセット選択状態
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>({
    type: 'period',
    value: INITIAL_END_DATE
  })

  // 祝日設定状態
  const [excludeHolidays, setExcludeHolidays] = useState(false)
  const [excludeJpHolidays, setExcludeJpHolidays] = useState(false)
  const [enableHolidayColors, setEnableHolidayColors] = useState(true)
  const [holidayColor, setHolidayColor] = useState(DEFAULT_HOLIDAY_COLOR)
  const [nationalHolidayColor, setNationalHolidayColor] = useState(
    DEFAULT_HOLIDAY_COLOR
  )

  // 初期化処理
  useEffect(() => {
    const today = getTodayString()
    setStartDate(today)
    setEndDate(addDays(today, INITIAL_END_DATE))
  }, [])

  // Memoize generation process dependencies
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

  // リスト生成処理
  const handleGenerateList = useCallback(() => {
    try {
      // 初回生成時（既存のリストがない場合）のみローディング状態を開始
      const isFirstLoad = !generatedList

      if (isFirstLoad) {
        setIsLoading(true)
        setIsWaitingForLazyLoad(true)
      }

      // 設定値を取得して日付リストを生成
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

      // 常にリストを設定
      setGeneratedList(result)

      // 状態更新処理
      if (isFirstGeneration) {
        setIsFirstGeneration(false)
        // isWaitingForLazyLoadは遅延読み込み完了まで継続（初回のみ）
      }

      // 2回目以降の生成では、ローディング状態を即座に終了
      if (!isFirstLoad) {
        setIsLoading(false)
        setIsWaitingForLazyLoad(false)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred'
      toast.error(errorMessage, { style: { color: '#b91c1c' } })
      setIsLoading(false)
      setIsWaitingForLazyLoad(false)
    }
  }, [generateListDependencies, generatedList, isFirstGeneration])

  // 遅延読み込み完了を通知する関数
  const notifyLazyLoadingComplete = useCallback(() => {
    setIsWaitingForLazyLoad(false)
    // 遅延読み込み完了時は必ずローディングを終了
    setIsLoading(false)
  }, [])

  // Function to update preset selection state (does not change dates)
  const updateSelectedPreset = useCallback((preset: Preset) => {
    setSelectedPreset(preset)
  }, []) // Common date calculation logic
  const calculateDateFromPreset = useCallback(
    (
      baseDate: string,
      value: number,
      type: PresetType,
      direction: 'forward' | 'backward'
    ): string => {
      if (!baseDate) return ''

      const multiplier = direction === 'backward' ? -1 : 1

      // Use dayjs to avoid timezone effects
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

  // Integrated function for preset application
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

  // Export functions
  const exportMarkdown = useCallback(() => {
    try {
      exportAsMarkdown(generatedList)
      toast.success('Markdownファイルをダウンロードしました')
    } catch (err) {
      console.error('Markdown エクスポートに失敗しました:', err)
      toast.error('Markdown エクスポートに失敗しました', {
        style: { color: '#b91c1c' }
      })
    }
  }, [generatedList])

  const exportPDF = useCallback(async () => {
    try {
      await exportAsPDF(generatedList)
      toast.success('PDF印刷ダイアログを開きました')
    } catch (err) {
      console.error('PDF エクスポートに失敗しました:', err)
      toast.error('PDF エクスポートに失敗しました', {
        style: { color: '#b91c1c' }
      })
    }
  }, [generatedList])

  // 設定リセット処理
  const resetSettings = useCallback(() => {
    const today = getTodayString()

    // 基本設定をデフォルト値に戻す
    setTitle(DEFAULT_TITLE)
    setDateFormat(DEFAULT_DATE_FORMAT)
    setStartDate(today)
    setEndDate(addDays(today, INITIAL_END_DATE))
    setGeneratedList('')

    // プリセット設定をリセット
    setSelectedPreset({ type: 'period', value: INITIAL_END_DATE })

    // 祝日設定をデフォルト値に戻す
    setExcludeHolidays(false)
    setExcludeJpHolidays(false)
    setEnableHolidayColors(true)
    setHolidayColor(DEFAULT_HOLIDAY_COLOR)
    setNationalHolidayColor(DEFAULT_HOLIDAY_COLOR)

    // 状態をリセット
    setIsLoading(false)
    setIsWaitingForLazyLoad(false)
    setIsFirstGeneration(true)
  }, [])

  // Memoized validation state
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
    isWaitingForLazyLoad,
    handleGenerateList,
    updateSelectedPreset,
    applyPreset,
    copyToClipboard,
    exportMarkdown,
    exportPDF,
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
    setNationalHolidayColor,
    notifyLazyLoadingComplete
  }
}
