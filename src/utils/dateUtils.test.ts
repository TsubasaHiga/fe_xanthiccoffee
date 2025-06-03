import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  addMonths,
  formatDate,
  generateDateList,
  getTodayString,
  isValidDateRange
} from './dateUtils'

describe('dateUtils', () => {
  beforeEach(() => {
    // Reset date mocks before each test
    vi.clearAllMocks()
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-01')
      const result = formatDate(date, 'YYYY-MM-DD')
      expect(result).toBe('2024-01-01')
    })

    it('should format date with Japanese day of week', () => {
      const date = new Date('2024-01-01') // Monday
      const result = formatDate(date, 'MM/DD（ddd）')
      expect(result).toBe('01/01（月）')
    })
  })

  describe('getTodayString', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const result = getTodayString()
      const today = new Date().toISOString().split('T')[0]
      expect(result).toBe(today)
    })
  })

  describe('addDays', () => {
    it('should add specified days correctly', () => {
      const result = addDays('2024-01-01', 7)
      expect(result).toBe('2024-01-07')
    })

    it('should handle adding 1 day (subtracts 1 from input)', () => {
      const result = addDays('2024-01-01', 1)
      expect(result).toBe('2024-01-01')
    })

    it('should handle month boundary', () => {
      const result = addDays('2024-01-30', 5)
      expect(result).toBe('2024-02-03')
    })
  })

  describe('addMonths', () => {
    it('should add months correctly and subtract 1 day', () => {
      const result = addMonths('2024-01-01', 1)
      expect(result).toBe('2024-01-31')
    })

    it('should handle year boundary', () => {
      const result = addMonths('2024-12-01', 1)
      expect(result).toBe('2024-12-31')
    })
  })

  describe('isValidDateRange', () => {
    it('should return true for valid range', () => {
      const result = isValidDateRange('2024-01-01', '2024-01-07')
      expect(result).toBe(true)
    })

    it('should return true for same date', () => {
      const result = isValidDateRange('2024-01-01', '2024-01-01')
      expect(result).toBe(true)
    })

    it('should return false for invalid range', () => {
      const result = isValidDateRange('2024-01-07', '2024-01-01')
      expect(result).toBe(false)
    })
  })

  describe('generateDateList', () => {
    it('should generate basic date list', () => {
      const result = generateDateList(
        '2024-01-01',
        '2024-01-03',
        'Test Schedule',
        'MM/DD（ddd）'
      )

      expect(result).toContain('# Test Schedule')
      expect(result).toContain('- 01/01（月）')
      expect(result).toContain('- 01/02（火）')
      expect(result).toContain('- 01/03（水）')
    })

    it('should return empty string for empty dates', () => {
      const result = generateDateList('', '', 'Test', 'MM/DD')
      expect(result).toBe('')
    })

    it('should throw error for invalid date range', () => {
      expect(() => {
        generateDateList('2024-01-07', '2024-01-01', 'Test', 'MM/DD')
      }).toThrow('開始日は終了日より前の日付を選択してください')
    })

    it('should exclude weekends when excludeHolidays is true', () => {
      const result = generateDateList(
        '2024-01-01', // Monday
        '2024-01-07', // Sunday
        'Test',
        'MM/DD（ddd）',
        true // excludeHolidays
      )

      // Should include weekdays but not Saturday (01/06) and Sunday (01/07)
      expect(result).toContain('- 01/01（月）')
      expect(result).toContain('- 01/05（金）')
      expect(result).not.toContain('- 01/06（土）')
      expect(result).not.toContain('- 01/07（日）')
    })

    it('should apply holiday colors when enabled', () => {
      const result = generateDateList(
        '2024-01-06', // Saturday
        '2024-01-07', // Sunday
        'Test',
        'MM/DD（ddd）',
        false, // don't exclude holidays
        false, // don't exclude JP holidays
        true, // enable holiday colors
        '#ff0000', // holiday color
        '#00ff00' // national holiday color
      )

      expect(result).toContain(
        '<span style="color: #ff0000">01/06（土）</span>'
      )
      expect(result).toContain(
        '<span style="color: #ff0000">01/07（日）</span>'
      )
    })

    it('should use default title when title is empty', () => {
      const result = generateDateList('2024-01-01', '2024-01-01', '', 'MM/DD')

      expect(result).toContain('# タイトル')
    })
  })
})
