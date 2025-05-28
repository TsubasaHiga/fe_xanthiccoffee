import {
  addDays,
  addMonths,
  generateDateList,
  getTodayString
} from '@/utils/dateUtils'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useDateListGenerator = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [title, setTitle] = useState('スケジュール')
  const [dateFormat, setDateFormat] = useState('MM/DD（ddd）')
  const [generatedList, setGeneratedList] = useState('')

  // 終了日の初期値を設定
  const initialEndDate = 14

  // 追加: プリセット選択状態
  const [selectedPreset, setSelectedPreset] = useState<
    { type: 'period'; value: number } | { type: 'months'; value: number } | null
  >({ type: 'period', value: initialEndDate })

  const [excludeHolidays, setExcludeHolidays] = useState(true)
  const [excludeJpHolidays, setExcludeJpHolidays] = useState(false)

  useEffect(() => {
    setStartDate(getTodayString())
    setEndDate(addDays(getTodayString(), initialEndDate))
  }, [])

  const handleGenerateList = () => {
    try {
      const result = generateDateList(
        startDate,
        endDate,
        title,
        dateFormat,
        excludeHolidays,
        excludeJpHolidays
      )
      setGeneratedList(result)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'エラーが発生しました',
        { style: { color: '#b91c1c' } }
      )
    }
  }

  const setPresetPeriod = (days: number) => {
    const start = startDate || getTodayString()
    setEndDate(addDays(start, days))
    setSelectedPreset({ type: 'period', value: days })
  }

  const setPresetMonths = (months: number) => {
    const start = startDate || getTodayString()
    setEndDate(addMonths(start, months))
    setSelectedPreset({ type: 'months', value: months })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedList)
      toast.success('クリップボードにコピーしました')
    } catch (err) {
      console.error('コピーに失敗しました:', err)
      toast.error('コピーに失敗しました', {
        style: { color: '#b91c1c' }
      })
    }
  }

  const resetSettings = () => {
    setTitle('スケジュール')
    setDateFormat('MM/DD（ddd）')
    setStartDate(getTodayString())
    setEndDate(addDays(getTodayString(), initialEndDate))
    setGeneratedList('')
    setSelectedPreset({ type: 'period', value: initialEndDate })
  }

  const isGenerateButtonDisabled = !title.trim() || !startDate || !endDate

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
    handleGenerateList,
    setPresetPeriod,
    setPresetMonths,
    copyToClipboard,
    resetSettings,
    isGenerateButtonDisabled,
    selectedPreset, // 追加
    excludeHolidays,
    setExcludeHolidays,
    excludeJpHolidays,
    setExcludeJpHolidays
  }
}
