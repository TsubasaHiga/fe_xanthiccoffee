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

  useEffect(() => {
    setStartDate(getTodayString())
  }, [])

  const handleGenerateList = () => {
    try {
      const result = generateDateList(startDate, endDate, title, dateFormat)
      setGeneratedList(result)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'エラーが発生しました'
      )
    }
  }

  const setPresetPeriod = (days: number) => {
    const start = startDate || getTodayString()
    setEndDate(addDays(start, days))
  }

  const setPresetMonths = (months: number) => {
    const start = startDate || getTodayString()
    setEndDate(addMonths(start, months))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedList)
      toast.success('クリップボードにコピーしました')
    } catch (err) {
      console.error('コピーに失敗しました:', err)
      toast.error('コピーに失敗しました')
    }
  }

  const resetSettings = () => {
    setTitle('')
    setDateFormat('MM/DD（ddd）')
    setStartDate(getTodayString())
    setEndDate('')
    setGeneratedList('')
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
    isGenerateButtonDisabled
  }
}
