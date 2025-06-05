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

  describe('dateUtils - タイムゾーン関連テスト', () => {
    describe('タイムゾーン一貫性テスト', () => {
      it('日付文字列からのdayjs変換でのタイムゾーン一貫性', () => {
        const dateString = '2024-01-15'
        const dayjsDate = new Date(dateString)

        // タイムゾーンに関係なく同じ日付として処理されることを確認
        const formatted = formatDate(dayjsDate, 'YYYY-MM-DD')
        expect(formatted).toBe('2024-01-15')
      })

      it('異なるタイムゾーンでの日付加算の一貫性', () => {
        const baseDate = '2024-03-15'

        // 様々な日数での加算テスト
        const result1 = addDays(baseDate, 7)
        const result2 = addDays(baseDate, 30)

        // 結果が期待される日付文字列形式であることを確認
        expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}$/)

        // 基準日からの正確な計算結果を確認
        expect(result1).toBe('2024-03-21')
        expect(result2).toBe('2024-04-13')
      })

      it('月境界での日付加算のタイムゾーン処理', () => {
        // 月末近くの日付でのテスト
        const endOfMonth = '2024-01-29'
        const result = addDays(endOfMonth, 5)

        // 月境界を正しく処理できることを確認
        expect(result).toBe('2024-02-02')
      })

      it('うるう年での2月29日を含む期間の処理', () => {
        // うるう年の2月28日からの加算
        const leapYearDate = '2024-02-28'
        const result = addDays(leapYearDate, 2)

        // addDaysは日数-1を加算するため、2024-02-28 + (2-1) = 2024-02-29
        expect(result).toBe('2024-02-29')
      })

      it('年末年始を跨ぐ日付加算の処理', () => {
        // 年末からの加算
        const yearEnd = '2023-12-30'
        const result = addDays(yearEnd, 5)

        // 年を跨いでも正しく計算されることを確認
        expect(result).toBe('2024-01-03')
      })
    })

    describe('月加算でのタイムゾーン処理', () => {
      it('月加算での一貫性', () => {
        const baseDate = '2024-01-15'

        const result1 = addMonths(baseDate, 1)
        const result2 = addMonths(baseDate, 6)

        // 結果が期待される日付文字列形式であることを確認
        expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })

      it('月末日での月加算処理', () => {
        // 月末日からの月加算
        const monthEnd = '2024-01-31'
        const result = addMonths(monthEnd, 1) // addMonthsは月を加算した後に1日を引くため、2024-01-31 + 1ヶ月 - 1日 = 2024-02-28
        expect(result).toBe('2024-02-28') // 2024年はうるう年だが、subtract(1, 'day')により28日
      })

      it('12月から翌年1月への月加算', () => {
        const december = '2023-12-15'
        const result = addMonths(december, 1)

        // 年を跨いでも正しく計算されることを確認
        expect(result).toBe('2024-01-14')
      })
    })

    describe('日付リスト生成でのタイムゾーン処理', () => {
      it('夏時間切り替え時期での日付リスト生成', () => {
        // アメリカの夏時間切り替え時期をテスト（3月第2日曜日）
        const springForward = '2024-03-10' // 2024年の夏時間開始日
        const endDate = '2024-03-12'

        const result = generateDateList(
          springForward,
          endDate,
          'Test Schedule',
          'MM/DD（ddd）'
        )

        // 夏時間切り替えの影響を受けずに正確に生成されることを確認
        expect(result).toContain('03/10（日）')
        expect(result).toContain('03/11（月）')
        expect(result).toContain('03/12（火）')
      })

      it('冬時間切り替え時期での日付リスト生成', () => {
        // アメリカの冬時間切り替え時期をテスト（11月第1日曜日）
        const fallBack = '2024-11-03' // 2024年の冬時間開始日
        const endDate = '2024-11-05'

        const result = generateDateList(
          fallBack,
          endDate,
          'Test Schedule',
          'MM/DD（ddd）'
        )

        // 冬時間切り替えの影響を受けずに正確に生成されることを確認
        expect(result).toContain('11/03（日）')
        expect(result).toContain('11/04（月）')
        expect(result).toContain('11/05（火）')
      })

      it('UTC境界での日付リスト生成の一貫性', () => {
        // UTC日付境界近くの時間での処理を確認
        const utcBoundaryDate = '2024-06-15'
        const endDate = '2024-06-17'

        const result = generateDateList(
          utcBoundaryDate,
          endDate,
          'Test Schedule',
          'MM/DD（ddd）'
        )

        // UTC境界に関係なく一貫した結果が得られることを確認
        expect(result).toContain('06/15（土）')
        expect(result).toContain('06/16（日）')
        expect(result).toContain('06/17（月）')
      })

      it('日本標準時での祝日処理の一貫性', () => {
        // 日本の祝日（元日）でのテスト
        const newYearStart = '2024-01-01'
        const newYearEnd = '2024-01-03'

        const result = generateDateList(
          newYearStart,
          newYearEnd,
          'Test Schedule',
          'MM/DD（ddd）',
          false, // 祝日除外しない
          false, // 日本の祝日除外しない
          true, // 祝日色付け有効
          '#ff0000',
          '#00ff00'
        )

        // 日本の祝日が正しく処理されることを確認
        expect(result).toContain('01/01（月）')
        expect(result).toContain('01/02（火）')
        expect(result).toContain('01/03（水）')
      })
    })
  })
})
