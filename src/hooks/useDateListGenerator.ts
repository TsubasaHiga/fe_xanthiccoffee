import { addDays, generateDateList, getTodayString } from '@/utils/dateUtils'
import { exportAsMarkdown, exportAsPDF } from '@/utils/exportUtils'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

// Type definitions
type PresetType = 'period' | 'months'
type Preset = { type: PresetType; value: number }

// Constants
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

  // Preset selection state
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>({
    type: 'period',
    value: INITIAL_END_DATE
  })

  // Holiday settings
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
        error instanceof Error ? error.message : 'An error occurred',
        { style: { color: '#b91c1c' } }
      )
    } finally {
      if (isFirstGeneration) {
        setIsLoading(false)
      }
    }
  }, [generateListDependencies, isFirstGeneration])

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

  const exportPDF = useCallback(() => {
    try {
      exportAsPDF(generatedList)
      toast.success('PDF印刷ダイアログを開きました')
    } catch (err) {
      console.error('PDF エクスポートに失敗しました:', err)
      toast.error('PDF エクスポートに失敗しました', {
        style: { color: '#b91c1c' }
      })
    }
  }, [generatedList])

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
    setNationalHolidayColor
  }
}
