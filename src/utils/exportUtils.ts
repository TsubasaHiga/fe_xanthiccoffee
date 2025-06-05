import dayjs from 'dayjs'

/**
 * Parse markdown content to extract dates and title
 */
export function parseMarkdownContent(content: string): {
  title: string
  dates: Array<{ date: string; dayOfWeek: string; holiday?: string }>
} {
  const lines = content.split('\n').filter((line) => line.trim())

  // Extract title (first line starting with #)
  const titleLine = lines.find((line) => line.startsWith('#'))
  const title = titleLine ? titleLine.replace(/^#+\s*/, '') : 'スケジュール'

  // Extract dates (lines starting with -)
  const dateLines = lines.filter((line) => line.startsWith('- '))
  const dates = dateLines.map((line) => {
    const content = line.replace(/^-\s*/, '')

    // Parse content that might include HTML span tags and holiday names
    const cleanContent = content.replace(/<[^>]*>/g, '') // Remove HTML tags

    // Extract date, day of week, and optional holiday name
    const match = cleanContent.match(/^(.+?)（(.+?)）(?:（(.+?)）)?/)
    if (match) {
      return {
        date: match[1],
        dayOfWeek: match[2],
        holiday: match[3]
      }
    }

    // Fallback parsing
    return {
      date: cleanContent,
      dayOfWeek: '',
      holiday: undefined
    }
  })

  return { title, dates }
}

/**
 * Export as CSV format
 */
export function exportAsCSV(content: string): void {
  const { title, dates } = parseMarkdownContent(content)

  // Create CSV content
  const headers = ['日付', '曜日', '祝日']
  const csvContent = [
    headers.join(','),
    ...dates.map(({ date, dayOfWeek, holiday }) =>
      [date, dayOfWeek, holiday || ''].join(',')
    )
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${title}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export as Excel format (CSV with .xlsx extension)
 */
export function exportAsExcel(content: string): void {
  const { title, dates } = parseMarkdownContent(content)

  // Create CSV content (Excel can read CSV)
  const headers = ['日付', '曜日', '祝日']
  const csvContent = [
    headers.join(','),
    ...dates.map(({ date, dayOfWeek, holiday }) =>
      [date, dayOfWeek, holiday || ''].join(',')
    )
  ].join('\n')

  // Create and download file as Excel format
  const blob = new Blob([csvContent], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${title}.xlsx`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export as PDF using browser print functionality
 */
export function exportAsPDF(content: string): void {
  const { title, dates } = parseMarkdownContent(content)

  // Create HTML content for printing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        ul { list-style-type: none; padding: 0; }
        li { padding: 5px 0; border-bottom: 1px solid #eee; }
        .holiday { color: #dc2626; font-weight: bold; }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <ul>
        ${dates
          .map(
            ({ date, dayOfWeek, holiday }) =>
              `<li${holiday ? ' class="holiday"' : ''}>${date}（${dayOfWeek}）${holiday ? `（${holiday}）` : ''}</li>`
          )
          .join('')}
      </ul>
    </body>
    </html>
  `

  // Open in new window and trigger print
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

/**
 * Export as ICS calendar format
 */
export function exportAsICS(content: string): void {
  const { title, dates } = parseMarkdownContent(content)

  // Generate ICS content
  const now = new Date()
  const timestamp = `${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MarkDays//MarkDays Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]

  dates.forEach(({ date, dayOfWeek, holiday }, index) => {
    // Parse the date - assuming format like "01/01" or "MM/DD"
    const currentYear = now.getFullYear()
    let parsedDate: dayjs.Dayjs

    try {
      // Try to parse various date formats
      if (date.includes('/')) {
        const [month, day] = date.split('/')
        parsedDate = dayjs(
          `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        )
      } else if (date.includes('-')) {
        parsedDate = dayjs(date)
      } else {
        // Skip if we can't parse the date
        return
      }

      if (!parsedDate.isValid()) {
        return
      }

      const eventDate = parsedDate.format('YYYYMMDD')
      const eventTitle = holiday
        ? `${date}（${dayOfWeek}）（${holiday}）`
        : `${date}（${dayOfWeek}）`
      const uid = `${eventDate}-${index}@markdays.app`

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART;VALUE=DATE:${eventDate}`,
        `DTEND;VALUE=DATE:${eventDate}`,
        `SUMMARY:${eventTitle}`,
        `DESCRIPTION:${title}で生成されたイベント`,
        'END:VEVENT'
      )
    } catch (error) {
      console.warn('Date parsing failed for:', date, error)
    }
  })

  icsContent.push('END:VCALENDAR')

  // Create and download file
  const blob = new Blob([icsContent.join('\r\n')], {
    type: 'text/calendar;charset=utf-8;'
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${title}.ics`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
