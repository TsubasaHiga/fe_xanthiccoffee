import { describe, expect, it } from 'vitest'
import {
  MAX_DATE_FORMAT_LENGTH,
  MAX_DATE_RANGE_DAYS,
  MAX_TITLE_LENGTH,
  sanitizeInput,
  validateColorHex,
  validateDateFormat,
  validateDateRange,
  validateTitle
} from './validation'

describe('validation utilities', () => {
  describe('validateDateRange', () => {
    it('should pass for valid date range', () => {
      const result = validateDateRange('2024-01-01', '2024-01-07')
      expect(result.isValid).toBe(true)
      expect(result.errorMessage).toBeUndefined()
    })

    it('should pass when start and end dates are the same', () => {
      const result = validateDateRange('2024-01-01', '2024-01-01')
      expect(result.isValid).toBe(true)
    })

    it('should fail when start date is after end date', () => {
      const result = validateDateRange('2024-01-07', '2024-01-01')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        '開始日は終了日より前の日付を選択してください'
      )
    })

    it('should fail when start date is empty', () => {
      const result = validateDateRange('', '2024-01-07')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('開始日と終了日を入力してください')
    })

    it('should fail when end date is empty', () => {
      const result = validateDateRange('2024-01-01', '')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('開始日と終了日を入力してください')
    })

    it('should fail for invalid date format', () => {
      const result = validateDateRange('invalid-date', '2024-01-07')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('有効な日付を入力してください')
    })

    it('should fail for extremely long periods', () => {
      const startDate = '2024-01-01'
      const endDate = '2035-01-01' // More than 10 years
      const result = validateDateRange(startDate, endDate)
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        `期間は${MAX_DATE_RANGE_DAYS}日（約10年）以内で設定してください`
      )
    })
  })

  describe('sanitizeInput', () => {
    it('should remove angle brackets', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      )
    })

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")')
    })

    it('should remove event handlers', () => {
      expect(sanitizeInput('onclick=alert("xss")')).toBe('alert("xss")')
      expect(sanitizeInput('onload=malicious()')).toBe('malicious()')
      expect(sanitizeInput('onclick =alert("xss")')).toBe('alert("xss")')
    })

    it('should handle non-string input', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('')
      expect(sanitizeInput(undefined as unknown as string)).toBe('')
      expect(sanitizeInput(123 as unknown as string)).toBe('')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  test  ')).toBe('test')
    })
  })

  describe('validateTitle', () => {
    it('should pass for valid title', () => {
      const result = validateTitle('Valid Title')
      expect(result.isValid).toBe(true)
    })

    it('should fail for empty title', () => {
      const result = validateTitle('')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('タイトルを入力してください')
    })

    it('should fail for whitespace-only title', () => {
      const result = validateTitle('   ')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('タイトルを入力してください')
    })

    it('should fail for title exceeding max length', () => {
      const longTitle = 'a'.repeat(MAX_TITLE_LENGTH + 1)
      const result = validateTitle(longTitle)
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        `タイトルは${MAX_TITLE_LENGTH}文字以内で入力してください`
      )
    })

    it('should sanitize malicious input', () => {
      const result = validateTitle('<script>alert("xss")</script>Valid Title')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateDateFormat', () => {
    it('should pass for valid date format', () => {
      const result = validateDateFormat('YYYY-MM-DD')
      expect(result.isValid).toBe(true)
    })

    it('should pass for Japanese date format', () => {
      const result = validateDateFormat('MM/DD（ddd）')
      expect(result.isValid).toBe(true)
    })

    it('should fail for empty format', () => {
      const result = validateDateFormat('')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe('日付フォーマットを入力してください')
    })

    it('should fail for format exceeding max length', () => {
      const longFormat = 'a'.repeat(MAX_DATE_FORMAT_LENGTH + 1)
      const result = validateDateFormat(longFormat)
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        `日付フォーマットは${MAX_DATE_FORMAT_LENGTH}文字以内で入力してください`
      )
    })

    it('should fail for invalid date format', () => {
      const result = validateDateFormat('invalid-format-[[[')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        '有効な日付フォーマットを入力してください'
      )
    })

    it('should allow most text as date format (dayjs is lenient)', () => {
      const result = validateDateFormat('just-text-no-date-tokens')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateColorHex', () => {
    it('should pass for valid 6-digit hex color', () => {
      const result = validateColorHex('#ff0000')
      expect(result.isValid).toBe(true)
    })

    it('should pass for valid 3-digit hex color', () => {
      const result = validateColorHex('#f00')
      expect(result.isValid).toBe(true)
    })

    it('should pass for uppercase hex', () => {
      const result = validateColorHex('#FF0000')
      expect(result.isValid).toBe(true)
    })

    it('should fail for invalid hex color', () => {
      const result = validateColorHex('red')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        '有効な色コード（例: #ff0000）を入力してください'
      )
    })

    it('should fail for hex without hash', () => {
      const result = validateColorHex('ff0000')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        '有効な色コード（例: #ff0000）を入力してください'
      )
    })

    it('should fail for invalid hex length', () => {
      const result = validateColorHex('#ff00')
      expect(result.isValid).toBe(false)
      expect(result.errorMessage).toBe(
        '有効な色コード（例: #ff0000）を入力してください'
      )
    })
  })
})
