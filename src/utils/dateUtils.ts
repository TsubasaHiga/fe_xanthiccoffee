import dayjs from 'dayjs'
import 'dayjs/locale/ja'

// 日本語ロケールを設定
dayjs.locale('ja')

export const formatDate = (date: Date, format: string): string => {
  return dayjs(date).format(format)
}

export const getTodayString = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

export const addDays = (date: string, days: number): string => {
  return dayjs(date)
    .add(days - 1, 'day')
    .format('YYYY-MM-DD')
}

export const addMonths = (date: string, months: number): string => {
  return dayjs(date)
    .add(months, 'month')
    .subtract(1, 'day')
    .format('YYYY-MM-DD')
}

export const isValidDateRange = (
  startDate: string,
  endDate: string
): boolean => {
  return (
    dayjs(startDate).isBefore(dayjs(endDate)) ||
    dayjs(startDate).isSame(dayjs(endDate))
  )
}

export const generateDateList = (
  startDate: string,
  endDate: string,
  title: string,
  format: string
): string => {
  if (!startDate || !endDate) return ''

  if (!isValidDateRange(startDate, endDate)) {
    throw new Error('開始日は終了日より前の日付を選択してください')
  }

  let markdown = `# ${title || 'タイトル'}\n\n`

  let current = dayjs(startDate)
  const end = dayjs(endDate)

  while (current.isBefore(end) || current.isSame(end)) {
    markdown += `- ${formatDate(current.toDate(), format)}\n`
    current = current.add(1, 'day')
  }

  return markdown
}
