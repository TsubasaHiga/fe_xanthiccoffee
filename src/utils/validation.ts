import dayjs from 'dayjs'

// Constants for validation limits
export const MAX_DATE_RANGE_DAYS = 3650 // 10 years maximum
export const MAX_TITLE_LENGTH = 200
export const MAX_DATE_FORMAT_LENGTH = 50

export interface ValidationResult {
  isValid: boolean
  errorMessage?: string
}

/**
 * Validates if start date is before or equal to end date
 */
export const validateDateRange = (
  startDate: string,
  endDate: string
): ValidationResult => {
  if (!startDate || !endDate) {
    return { isValid: false, errorMessage: '開始日と終了日を入力してください' }
  }

  const start = dayjs(startDate)
  const end = dayjs(endDate)

  if (!start.isValid() || !end.isValid()) {
    return { isValid: false, errorMessage: '有効な日付を入力してください' }
  }

  if (start.isAfter(end)) {
    return {
      isValid: false,
      errorMessage: '開始日は終了日より前の日付を選択してください'
    }
  }

  // Check for extremely long periods
  const daysDiff = end.diff(start, 'day')
  if (daysDiff > MAX_DATE_RANGE_DAYS) {
    return {
      isValid: false,
      errorMessage: `期間は${MAX_DATE_RANGE_DAYS}日（約10年）以内で設定してください`
    }
  }

  return { isValid: true }
}

/**
 * Sanitizes input text to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return ''

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers with optional spaces
    .trim()
}

/**
 * Validates title input
 */
export const validateTitle = (title: string): ValidationResult => {
  const sanitized = sanitizeInput(title)

  if (!sanitized) {
    return { isValid: false, errorMessage: 'タイトルを入力してください' }
  }

  if (sanitized.length > MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      errorMessage: `タイトルは${MAX_TITLE_LENGTH}文字以内で入力してください`
    }
  }

  return { isValid: true }
}

/**
 * Validates date format input
 */
export const validateDateFormat = (format: string): ValidationResult => {
  const sanitized = sanitizeInput(format)

  if (!sanitized) {
    return {
      isValid: false,
      errorMessage: '日付フォーマットを入力してください'
    }
  }

  if (sanitized.length > MAX_DATE_FORMAT_LENGTH) {
    return {
      isValid: false,
      errorMessage: `日付フォーマットは${MAX_DATE_FORMAT_LENGTH}文字以内で入力してください`
    }
  }

  // Test format with a sample date - dayjs is more lenient, so check for obviously invalid patterns
  if (sanitized.includes('[[[') || sanitized.includes(']]]')) {
    return {
      isValid: false,
      errorMessage: '有効な日付フォーマットを入力してください'
    }
  }

  try {
    const formatted = dayjs().format(sanitized)
    // If the format returned is exactly the same as input (for completely invalid formats),
    // or contains obvious error indicators, consider it invalid
    if (formatted === sanitized && !sanitized.match(/[YMDHmsA]/)) {
      return {
        isValid: false,
        errorMessage: '有効な日付フォーマットを入力してください'
      }
    }
    return { isValid: true }
  } catch (_error) {
    return {
      isValid: false,
      errorMessage: '有効な日付フォーマットを入力してください'
    }
  }
}

/**
 * Validates color hex input
 */
export const validateColorHex = (color: string): ValidationResult => {
  const sanitized = sanitizeInput(color)
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

  if (!hexPattern.test(sanitized)) {
    return {
      isValid: false,
      errorMessage: '有効な色コード（例: #ff0000）を入力してください'
    }
  }

  return { isValid: true }
}
