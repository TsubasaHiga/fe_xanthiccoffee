import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import Holidays from 'date-holidays'

// 日本語ロケールを設定
dayjs.locale('ja')

const hd = new Holidays('JP')

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

  let markdown = `# ${title || 'タイトル'}\n\n`

  let current = dayjs(startDate)
  const end = dayjs(endDate)

  while (current.isBefore(end) || current.isSame(end)) {
    // excludeHolidaysがtrueなら土日を除外
    if (excludeHolidays) {
      const day = current.day()
      if (day === 0 || day === 6) {
        // 0:日曜, 6:土曜
        current = current.add(1, 'day')
        continue
      }
    }
    // excludeJpHolidaysがtrueなら祝日を除外（date-holidays使用）
    const holidayInfo = hd.isHoliday(current.toDate())
    if (excludeJpHolidays && holidayInfo) {
      current = current.add(1, 'day')
      continue
    }
    let line = `- ${formatDate(current.toDate(), format)}`
    const day = current.day()
    const isWeekend = day === 0 || day === 6 // 0:日曜, 6:土曜

    if (!excludeJpHolidays && holidayInfo) {
      // holidayInfoは配列またはオブジェクト
      const name = Array.isArray(holidayInfo)
        ? holidayInfo[0] && typeof holidayInfo[0] === 'object'
          ? (holidayInfo[0] as { name?: string }).name
          : undefined
        : (holidayInfo as { name?: string })?.name
      if (name) {
        line += `（${name}）`
      }
    }

    // 色の適用
    if (enableHolidayColors && (isWeekend || holidayInfo)) {
      const color = holidayInfo ? nationalHolidayColor : holidayColor
      line = `<span style="color: ${color || '#dc2626'}">${line}</span>`
    }

    markdown += `${line}\n`
    current = current.add(1, 'day')
  }

  return markdown
}
