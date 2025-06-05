import { addDays, generateDateList, getTodayString } from '@/utils/dateUtils'
import {
  type PersistedSettings,
  loadSettingsFromStorage,
  saveSettingsToStorage
} from '@/utils/localStorage'
import {
  sanitizeInput,
  validateColorHex,
  validateDateFormat,
  validateDateRange,
  validateTitle
} from '@/utils/validation'
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

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    dateRange?: string
    title?: string
    dateFormat?: string
    holidayColor?: string
    nationalHolidayColor?: string
  }>({})

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

  // Initialize settings from localStorage and set default dates
  useEffect(() => {
    const storedSettings = loadSettingsFromStorage()
    const today = getTodayString()

    setStartDate(today)
    setEndDate(addDays(today, INITIAL_END_DATE))

    if (storedSettings) {
      if (storedSettings.title) setTitle(storedSettings.title)
      if (storedSettings.dateFormat) setDateFormat(storedSettings.dateFormat)
      if (typeof storedSettings.excludeHolidays === 'boolean') {
        setExcludeHolidays(storedSettings.excludeHolidays)
      }
      if (typeof storedSettings.excludeJpHolidays === 'boolean') {
        setExcludeJpHolidays(storedSettings.excludeJpHolidays)
      }
      if (typeof storedSettings.enableHolidayColors === 'boolean') {
        setEnableHolidayColors(storedSettings.enableHolidayColors)
      }
      if (storedSettings.holidayColor)
        setHolidayColor(storedSettings.holidayColor)
      if (storedSettings.nationalHolidayColor) {
        setNationalHolidayColor(storedSettings.nationalHolidayColor)
      }
    }
  }, [])

  // Auto-save settings to localStorage when they change
  useEffect(() => {
    const settings: PersistedSettings = {
      title,
      dateFormat,
      excludeHolidays,
      excludeJpHolidays,
      enableHolidayColors,
      holidayColor,
      nationalHolidayColor
    }
    saveSettingsToStorage(settings)
  }, [
    title,
    dateFormat,
    excludeHolidays,
    excludeJpHolidays,
    enableHolidayColors,
    holidayColor,
    nationalHolidayColor
  ])

  // Validation functions
  const validateAllInputs = useCallback(() => {
    const errors: typeof validationErrors = {}

    // Validate date range
    const dateRangeResult = validateDateRange(startDate, endDate)
    if (!dateRangeResult.isValid) {
      errors.dateRange = dateRangeResult.errorMessage
    }

    // Validate title
    const titleResult = validateTitle(title)
    if (!titleResult.isValid) {
      errors.title = titleResult.errorMessage
    }

    // Validate date format
    const dateFormatResult = validateDateFormat(dateFormat)
    if (!dateFormatResult.isValid) {
      errors.dateFormat = dateFormatResult.errorMessage
    }

    // Validate holiday colors
    const holidayColorResult = validateColorHex(holidayColor)
    if (!holidayColorResult.isValid) {
      errors.holidayColor = holidayColorResult.errorMessage
    }

    const nationalHolidayColorResult = validateColorHex(nationalHolidayColor)
    if (!nationalHolidayColorResult.isValid) {
      errors.nationalHolidayColor = nationalHolidayColorResult.errorMessage
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [
    startDate,
    endDate,
    title,
    dateFormat,
    holidayColor,
    nationalHolidayColor
  ])

  // Clear validation errors for a specific field
  const clearValidationError = useCallback(
    (field: keyof typeof validationErrors) => {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    },
    []
  )

  // Enhanced setters with validation
  const setTitleWithValidation = useCallback(
    (newTitle: string) => {
      const sanitized = sanitizeInput(newTitle)
      setTitle(sanitized)

      const result = validateTitle(sanitized)
      if (result.isValid) {
        clearValidationError('title')
      } else {
        setValidationErrors((prev) => ({ ...prev, title: result.errorMessage }))
      }
    },
    [clearValidationError]
  )

  const setDateFormatWithValidation = useCallback(
    (newFormat: string) => {
      const sanitized = sanitizeInput(newFormat)
      setDateFormat(sanitized)

      const result = validateDateFormat(sanitized)
      if (result.isValid) {
        clearValidationError('dateFormat')
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          dateFormat: result.errorMessage
        }))
      }
    },
    [clearValidationError]
  )

  const setHolidayColorWithValidation = useCallback(
    (newColor: string) => {
      const sanitized = sanitizeInput(newColor)
      setHolidayColor(sanitized)

      const result = validateColorHex(sanitized)
      if (result.isValid) {
        clearValidationError('holidayColor')
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          holidayColor: result.errorMessage
        }))
      }
    },
    [clearValidationError]
  )

  const setNationalHolidayColorWithValidation = useCallback(
    (newColor: string) => {
      const sanitized = sanitizeInput(newColor)
      setNationalHolidayColor(sanitized)

      const result = validateColorHex(sanitized)
      if (result.isValid) {
        clearValidationError('nationalHolidayColor')
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          nationalHolidayColor: result.errorMessage
        }))
      }
    },
    [clearValidationError]
  )

  const setStartDateWithValidation = useCallback(
    (newStartDate: string) => {
      setStartDate(newStartDate)

      // Validate date range when start date changes
      setTimeout(() => {
        const result = validateDateRange(newStartDate, endDate)
        if (result.isValid) {
          clearValidationError('dateRange')
        } else {
          setValidationErrors((prev) => ({
            ...prev,
            dateRange: result.errorMessage
          }))
        }
      }, 0)
    },
    [endDate, clearValidationError]
  )

  const setEndDateWithValidation = useCallback(
    (newEndDate: string) => {
      setEndDate(newEndDate)

      // Validate date range when end date changes
      setTimeout(() => {
        const result = validateDateRange(startDate, newEndDate)
        if (result.isValid) {
          clearValidationError('dateRange')
        } else {
          setValidationErrors((prev) => ({
            ...prev,
            dateRange: result.errorMessage
          }))
        }
      }, 0)
    },
    [startDate, clearValidationError]
  )

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
    // Validate all inputs before generating
    if (!validateAllInputs()) {
      toast.error('入力内容に誤りがあります。確認してください。', {
        style: { color: '#b91c1c' }
      })
      return
    }

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
        error instanceof Error
          ? error.message
          : 'リスト生成中にエラーが発生しました',
        { style: { color: '#b91c1c' } }
      )
    } finally {
      if (isFirstGeneration) {
        setIsLoading(false)
      }
    }
  }, [generateListDependencies, isFirstGeneration, validateAllInputs])

  // Function to update preset selection state (does not change dates)
  const updateSelectedPreset = useCallback((preset: Preset) => {
    setSelectedPreset(preset)
  }, [])

  // Common date calculation logic
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

  // Integrated function for preset application with validation
  const applyPreset = useCallback(
    (value: number, type: PresetType, base: 'start' | 'end') => {
      if (base === 'start' && startDate) {
        const newEndDate = calculateDateFromPreset(
          startDate,
          value,
          type,
          'forward'
        )
        setEndDateWithValidation(newEndDate)
      } else if (base === 'end' && endDate) {
        const newStartDate = calculateDateFromPreset(
          endDate,
          value,
          type,
          'backward'
        )
        setStartDateWithValidation(newStartDate)
      }

      updateSelectedPreset({ type, value })
    },
    [
      startDate,
      endDate,
      calculateDateFromPreset,
      updateSelectedPreset,
      setStartDateWithValidation,
      setEndDateWithValidation
    ]
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
    setValidationErrors({})
  }, [])

  // Enhanced validation state
  const isGenerateButtonDisabled = useMemo(() => {
    return (
      !title.trim() ||
      !startDate ||
      !endDate ||
      Object.keys(validationErrors).length > 0
    )
  }, [title, startDate, endDate, validationErrors])

  return {
    startDate,
    setStartDate: setStartDateWithValidation,
    endDate,
    setEndDate: setEndDateWithValidation,
    title,
    setTitle: setTitleWithValidation,
    dateFormat,
    setDateFormat: setDateFormatWithValidation,
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
    setHolidayColor: setHolidayColorWithValidation,
    nationalHolidayColor,
    setNationalHolidayColor: setNationalHolidayColorWithValidation,
    // New validation features
    validationErrors,
    validateAllInputs,
    clearValidationError
  }
}
