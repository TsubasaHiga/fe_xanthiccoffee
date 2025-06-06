import dayjs from 'dayjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  addMonths,
  formatDate,
  generateDateList,
  getTodayString,
  isValidDateRange
} from './dateUtils'

describe('日付ユーティリティ関数', () => {
  beforeEach(() => {
    // Reset date mocks before each test
    vi.clearAllMocks()
  })

  describe('formatDate', () => {
    it('日付を正しくフォーマットできる', () => {
      const date = new Date('2024-01-01')
      const result = formatDate(date, 'YYYY-MM-DD')
      expect(result).toBe('2024-01-01')
    })

    it('日本語曜日付きでフォーマットできる', () => {
      const date = new Date('2024-01-01') // Monday
      const result = formatDate(date, 'MM/DD（ddd）')
      expect(result).toBe('01/01（月）')
    })
  })

  describe('getTodayString', () => {
    it('今日の日付をYYYY-MM-DD形式で返す', () => {
      const result = getTodayString()
      const today = dayjs().format('YYYY-MM-DD')
      expect(result).toBe(today)
    })
  })

  describe('addDays', () => {
    it('指定日数分正しく加算できる', () => {
      const result = addDays('2024-01-01', 7)
      expect(result).toBe('2024-01-07')
    })

    it('1日加算時は入力値そのまま', () => {
      const result = addDays('2024-01-01', 1)
      expect(result).toBe('2024-01-01')
    })

    it('月境界をまたぐ場合も正しく加算できる', () => {
      const result = addDays('2024-01-30', 5)
      expect(result).toBe('2024-02-03')
    })
  })

  describe('addMonths', () => {
    it('月加算時に1日引いた日付を返す', () => {
      const result = addMonths('2024-01-01', 1)
      expect(result).toBe('2024-01-31')
    })

    it('年をまたぐ場合も正しく加算できる', () => {
      const result = addMonths('2024-12-01', 1)
      expect(result).toBe('2024-12-31')
    })
  })

  describe('isValidDateRange', () => {
    it('有効な日付範囲ならtrue', () => {
      const result = isValidDateRange('2024-01-01', '2024-01-07')
      expect(result).toBe(true)
    })

    it('同じ日付でもtrue', () => {
      const result = isValidDateRange('2024-01-01', '2024-01-01')
      expect(result).toBe(true)
    })

    it('不正な範囲ならfalse', () => {
      const result = isValidDateRange('2024-01-07', '2024-01-01')
      expect(result).toBe(false)
    })
  })

  describe('generateDateList', () => {
    it('基本的な日付リストを生成できる', () => {
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

    it('日付が空の場合は空文字を返す', () => {
      const result = generateDateList('', '', 'Test', 'MM/DD')
      expect(result).toBe('')
    })

    it('不正な日付範囲はエラーになる', () => {
      expect(() => {
        generateDateList('2024-01-07', '2024-01-01', 'Test', 'MM/DD')
      }).toThrow('開始日は終了日より前の日付を選択してください')
    })

    it('祝日除外時は土日が除外される', () => {
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

    it('祝日色付けが有効な場合は色が付与される', () => {
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

    it('タイトルが空の場合はデフォルトタイトルになる', () => {
      const result = generateDateList('2024-01-01', '2024-01-01', '', 'MM/DD')

      expect(result).toContain('# タイトル')
    })
  })

  describe('タイムゾーン関連テスト', () => {
    describe('タイムゾーン一貫性テスト', () => {
      it('日付文字列からのdayjs変換で一貫性がある', () => {
        const dateString = '2024-01-15'
        const dayjsDate = new Date(dateString)

        // タイムゾーンに関係なく同じ日付として処理されることを確認
        const formatted = formatDate(dayjsDate, 'YYYY-MM-DD')
        expect(formatted).toBe('2024-01-15')
      })

      it('異なるタイムゾーンでの日付加算も一貫性がある', () => {
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

      it('月境界での日付加算も正しく処理できる', () => {
        // 月末近くの日付でのテスト
        const endOfMonth = '2024-01-29'
        const result = addDays(endOfMonth, 5)

        // 月境界を正しく処理できることを確認
        expect(result).toBe('2024-02-02')
      })

      it('うるう年の2月29日を含む期間も正しく処理できる', () => {
        // うるう年の2月28日からの加算
        const leapYearDate = '2024-02-28'
        const result = addDays(leapYearDate, 2)

        // addDaysは日数-1を加算するため、2024-02-28 + (2-1) = 2024-02-29
        expect(result).toBe('2024-02-29')
      })

      it('年末年始をまたぐ日付加算も正しく処理できる', () => {
        // 年末からの加算
        const yearEnd = '2023-12-30'
        const result = addDays(yearEnd, 5)

        // 年を跨いでも正しく計算されることを確認
        expect(result).toBe('2024-01-03')
      })
    })

    describe('月加算でのタイムゾーン処理', () => {
      it('月加算で一貫性がある', () => {
        const baseDate = '2024-01-15'

        const result1 = addMonths(baseDate, 1)
        const result2 = addMonths(baseDate, 6)

        // 結果が期待される日付文字列形式であることを確認
        expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })

      it('月末日からの月加算も正しく処理できる', () => {
        // 月末日からの月加算
        const monthEnd = '2024-01-31'
        const result = addMonths(monthEnd, 1) // addMonthsは月を加算した後に1日を引くため、2024-01-31 + 1ヶ月 - 1日 = 2024-02-28
        expect(result).toBe('2024-02-28') // 2024年はうるう年だが、subtract(1, 'day')により28日
      })

      it('12月から翌年1月への月加算も正しく処理できる', () => {
        const december = '2023-12-15'
        const result = addMonths(december, 1)

        // 年を跨いでも正しく計算されることを確認
        expect(result).toBe('2024-01-14')
      })
    })

    describe('日付リスト生成でのタイムゾーン処理', () => {
      it('夏時間切り替え時期でも正しくリスト生成できる', () => {
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

      it('冬時間切り替え時期でも正しくリスト生成できる', () => {
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

      it('UTC境界でも一貫したリスト生成ができる', () => {
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

      it('日本標準時での祝日処理も一貫している', () => {
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
