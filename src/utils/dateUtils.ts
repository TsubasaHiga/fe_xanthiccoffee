import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import Holidays from 'date-holidays'
import {
  escapeHtml,
  sanitizeColorValue,
  sanitizeDateFormat,
  sanitizeTitle
} from './xssUtils'

// Set Japanese locale
dayjs.locale('ja')

const hd = new Holidays('JP')

export const formatDate = (date: Date, format: string): string => {
  return dayjs(date).format(sanitizeDateFormat(format))
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
  format: string,
  excludeHolidays?: boolean,
  excludeJpHolidays?: boolean,
  enableHolidayColors?: boolean,
  holidayColor?: string,
  nationalHolidayColor?: string
): string => {
  if (!startDate || !endDate) return ''

  if (!isValidDateRange(startDate, endDate)) {
    throw new Error('開始日は終了日より前の日付を選択してください')
  }

  let markdown = `# ${sanitizeTitle(title || 'タイトル')}\n\n`

  let current = dayjs(startDate)
  const end = dayjs(endDate)

  while (current.isBefore(end) || current.isSame(end)) {
    // Exclude weekends if excludeHolidays is true
    if (excludeHolidays) {
      const day = current.day()
      if (day === 0 || day === 6) {
        // 0:Sunday, 6:Saturday
        current = current.add(1, 'day')
        continue
      }
    }
    // Exclude Japanese holidays if excludeJpHolidays is true (using date-holidays)
    const holidayInfo = hd.isHoliday(current.toDate())
    if (excludeJpHolidays && holidayInfo) {
      current = current.add(1, 'day')
      continue
    }
    let dateContent = formatDate(current.toDate(), format)
    const day = current.day()
    const isWeekend = day === 0 || day === 6 // 0:Sunday, 6:Saturday

    if (!excludeJpHolidays && holidayInfo) {
      // holidayInfo is an array or object
      const name = Array.isArray(holidayInfo)
        ? holidayInfo[0] && typeof holidayInfo[0] === 'object'
          ? (holidayInfo[0] as { name?: string }).name
          : undefined
        : (holidayInfo as { name?: string })?.name
      if (name) {
        dateContent += `（${escapeHtml(name)}）`
      }
    }

    // Apply colors
    if (enableHolidayColors && (isWeekend || holidayInfo)) {
      const color = holidayInfo ? nationalHolidayColor : holidayColor
      dateContent = `<span style="color: ${sanitizeColorValue(color || '#dc2626')}">${escapeHtml(dateContent)}</span>`
    }

    const line = `- ${dateContent}`

    markdown += `${line}\n`
    current = current.add(1, 'day')
  }

  return markdown
}
