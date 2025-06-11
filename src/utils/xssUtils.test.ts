import { describe, expect, it } from 'vitest'
import {
  escapeHtml,
  sanitizeColorValue,
  sanitizeDateFormat,
  sanitizeTitle
} from './xssUtils'

describe('XSS Utils', () => {
  describe('escapeHtml', () => {
    it('HTMLの特殊文字をエスケープする', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      )
      expect(escapeHtml('Hello & "World"')).toBe(
        'Hello &amp; &quot;World&quot;'
      )
      expect(escapeHtml("'test'")).toBe('&#39;test&#39;')
    })

    it('非文字列の値を文字列に変換する', () => {
      expect(escapeHtml(123 as unknown as string)).toBe('123')
      expect(escapeHtml(null as unknown as string)).toBe('null')
      expect(escapeHtml(undefined as unknown as string)).toBe('undefined')
    })
  })

  describe('sanitizeColorValue', () => {
    it('有効な16進数カラーを許可する', () => {
      expect(sanitizeColorValue('#ff0000')).toBe('#ff0000')
      expect(sanitizeColorValue('#F00')).toBe('#f00')
      expect(sanitizeColorValue('#123456')).toBe('#123456')
    })

    it('有効なRGB/RGBA形式を許可する', () => {
      expect(sanitizeColorValue('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)')
      expect(sanitizeColorValue('rgba(255, 0, 0, 0.5)')).toBe(
        'rgba(255, 0, 0, 0.5)'
      )
    })

    it('有効なHSL/HSLA形式を許可する', () => {
      expect(sanitizeColorValue('hsl(120, 100%, 50%)')).toBe(
        'hsl(120, 100%, 50%)'
      )
      expect(sanitizeColorValue('hsla(120, 100%, 50%, 0.3)')).toBe(
        'hsla(120, 100%, 50%, 0.3)'
      )
    })

    it('CSS名前付き色を許可する', () => {
      expect(sanitizeColorValue('red')).toBe('red')
      expect(sanitizeColorValue('Blue')).toBe('blue')
      expect(sanitizeColorValue('GREEN')).toBe('green')
    })

    it('不正な色値にはデフォルト色を返す', () => {
      expect(sanitizeColorValue('invalid')).toBe('#000000')
      expect(sanitizeColorValue('')).toBe('#000000')
      expect(sanitizeColorValue('javascript:alert(1)')).toBe('#000000')
      expect(sanitizeColorValue('<script>alert(1)</script>')).toBe('#000000')
    })
  })

  describe('sanitizeDateFormat', () => {
    it('有効な日付フォーマットを許可する', () => {
      expect(sanitizeDateFormat('YYYY-MM-DD')).toBe('YYYY-MM-DD')
      expect(sanitizeDateFormat('YYYY年MM月DD日')).toBe('YYYY年MM月DD日')
      expect(sanitizeDateFormat('MM/DD/YYYY')).toBe('MM/DD/YYYY')
    })

    it('危険な文字を含む場合はデフォルトフォーマットを返す', () => {
      expect(sanitizeDateFormat('<script>alert(1)</script>')).toBe('YYYY-MM-DD')
      expect(sanitizeDateFormat('<script>alert(1)</script>YYYY-MM-DD')).toBe(
        'YYYY-MM-DD'
      )
      // HTMLタグが除去され、残った文字が有効なフォーマットの場合はそのまま返す
      expect(sanitizeDateFormat('YYYY<>')).toBe('YYYY')
      expect(sanitizeDateFormat('')).toBe('YYYY-MM-DD')
      expect(sanitizeDateFormat(null as unknown as string)).toBe('YYYY-MM-DD')
    })

    it('長すぎるフォーマットを切り詰める', () => {
      const longFormat = 'Y'.repeat(120)
      const result = sanitizeDateFormat(longFormat)
      expect(result.length).toBe(100)
    })
  })

  describe('sanitizeTitle', () => {
    it('有効なタイトルを保持する', () => {
      expect(sanitizeTitle('Hello World')).toBe('Hello World')
      expect(sanitizeTitle('Title with script')).toBe('Title with script')
      expect(sanitizeTitle('Title & "quotes"')).toBe('Title & "quotes"')
    })

    it('危険なHTMLタグを除去する', () => {
      expect(
        sanitizeTitle('<script>alert("XSS")</script>Malicious Title')
      ).toBe('Malicious Title')
      // HTMLタグが除去され、空白が正規化される
      expect(sanitizeTitle('Title with <script>alert("xss")</script>')).toBe(
        'Title with'
      )
      expect(sanitizeTitle('Title with <img src="x" onerror="alert(1)">')).toBe(
        'Title with'
      )
    })

    it('空文字や非文字列の場合は空文字を返す', () => {
      expect(sanitizeTitle('')).toBe('')
      expect(sanitizeTitle('   ')).toBe('')
      expect(sanitizeTitle(null as unknown as string)).toBe('')
    })

    it('長すぎるタイトルを切り詰める', () => {
      const longTitle = 'A'.repeat(250)
      const result = sanitizeTitle(longTitle)
      expect(result.length).toBe(200)
    })
  })
})
