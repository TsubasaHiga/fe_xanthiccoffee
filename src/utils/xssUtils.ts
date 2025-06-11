/**
 * XSS対策のためのユーティリティ関数群（独立版）
 * umakiライブラリに依存しない確実な実装
 */

// 設定定数
const MAX_TITLE_LENGTH = 200
const MAX_FORMAT_LENGTH = 100
const DEFAULT_COLOR = '#000000'
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

/**
 * HTMLタグ除去関数
 * 信頼性を重視した独立実装
 */
function removeHtmlTags(input: string): string {
  return input
    .replace(/<[^>]*>/g, ' ') // HTMLタグを空白に置換
    .replace(/&[a-zA-Z0-9#]{1,10};/g, ' ') // HTMLエンティティを除去
    .replace(/\s+/g, ' ') // 連続する空白を正規化
    .trim()
}

/**
 * 数値を正の数に変換する
 */
function toPositiveNumber(value: string | number, defaultValue = 0): number {
  const num = typeof value === 'number' ? value : Number.parseFloat(value)
  return Number.isNaN(num) || num < 0 ? defaultValue : num
}

/**
 * HTML内容をエスケープする
 * 日付表示や祝日名など、HTMLに直接挿入されるテキスト用
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return String(text)
  }

  // 基本的なHTMLエスケープ
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * CSSカラー値をサニタイズする
 * styleプロパティに直接挿入される色値用
 */
export function sanitizeColorValue(color: string): string {
  if (typeof color !== 'string') {
    return DEFAULT_COLOR
  }

  // 空文字列の場合はデフォルト色を返す
  if (!color.trim()) {
    return DEFAULT_COLOR
  }

  // HTMLタグを完全に除去
  let sanitized = removeHtmlTags(color.trim())

  // JavaScriptプロトコルを除去
  sanitized = sanitized.replace(/javascript:/gi, '')

  // 危険パターンチェック
  if (
    sanitized.includes('javascript:') ||
    sanitized.includes('<') ||
    sanitized.includes('>') ||
    /on\w+\s*=/i.test(sanitized)
  ) {
    return DEFAULT_COLOR
  }

  // 16進数カラーコード（#RRGGBB または #RGB）
  const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if (hexColorRegex.test(sanitized)) {
    return sanitized.toLowerCase()
  }

  // RGB/RGBA形式
  const rgbRegex =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/
  const rgbMatch = sanitized.match(rgbRegex)
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch
    // umakiのtoPositiveNumberを使用して安全な数値変換
    const red = Math.min(255, toPositiveNumber(Number.parseInt(r, 10)))
    const green = Math.min(255, toPositiveNumber(Number.parseInt(g, 10)))
    const blue = Math.min(255, toPositiveNumber(Number.parseInt(b, 10)))

    if (a !== undefined) {
      const alpha = Math.min(1, Math.max(0, Number.parseFloat(a)))
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`
    }
    return `rgb(${red}, ${green}, ${blue})`
  }

  // HSL/HSLA形式
  const hslRegex =
    /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/
  const hslMatch = sanitized.match(hslRegex)
  if (hslMatch) {
    const [, h, s, l, a] = hslMatch
    // umakiのtoPositiveNumberを使用して安全な数値変換
    const hue = Math.min(360, toPositiveNumber(Number.parseInt(h, 10)))
    const saturation = Math.min(100, toPositiveNumber(Number.parseInt(s, 10)))
    const lightness = Math.min(100, toPositiveNumber(Number.parseInt(l, 10)))

    if (a !== undefined) {
      const alpha = Math.min(1, Math.max(0, Number.parseFloat(a)))
      return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
    }
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  // CSS名前付き色（基本色のみ許可）
  const namedColors = [
    'black',
    'white',
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'gray',
    'grey',
    'cyan',
    'magenta',
    'lime',
    'navy',
    'teal',
    'silver',
    'maroon',
    'olive',
    'aqua',
    'fuchsia'
  ]

  const lowerColor = sanitized.toLowerCase()
  if (namedColors.includes(lowerColor)) {
    return lowerColor
  }

  // 無効な色の場合はデフォルト色を返す
  return DEFAULT_COLOR
}

/**
 * 日付フォーマット文字列をサニタイズする
 * dayjs.format()に渡されるフォーマット文字列用
 */
export function sanitizeDateFormat(format: string): string {
  if (typeof format !== 'string') {
    return DEFAULT_DATE_FORMAT
  }

  // 空文字列の場合はデフォルトフォーマットを返す
  if (!format.trim()) {
    return DEFAULT_DATE_FORMAT
  }

  // HTMLタグを完全に除去
  let sanitized = removeHtmlTags(format.trim())

  // JavaScriptプロトコルを除去
  sanitized = sanitized.replace(/javascript:/gi, '')

  // 空になった場合はデフォルトを返す
  if (!sanitized.trim()) {
    return DEFAULT_DATE_FORMAT
  }

  // 危険なJavaScript関数呼び出しパターンをチェック
  if (
    /\balert\s*\(/i.test(sanitized) ||
    /\beval\s*\(/i.test(sanitized) ||
    /javascript\s*:/i.test(sanitized) ||
    /[<>]/g.test(sanitized)
  ) {
    return DEFAULT_DATE_FORMAT
  }

  // dayjs で使用される有効な文字のみを許可
  // 英数字、日本語文字、一般的な記号、括弧、スペースを許可
  const validFormatRegex =
    /^[A-Za-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s\-\/\(\)（）「」\[\]【】・、。:：_]+$/

  if (!validFormatRegex.test(sanitized)) {
    return DEFAULT_DATE_FORMAT
  }

  // 長すぎるフォーマット文字列を制限
  if (sanitized.length > MAX_FORMAT_LENGTH) {
    return sanitized.substring(0, MAX_FORMAT_LENGTH)
  }

  return sanitized
}

/**
 * タイトル文字列をサニタイズする
 * HTMLのtitleタグや見出しに直接出力されるタイトル用
 */
export function sanitizeTitle(title: string): string {
  if (typeof title !== 'string') {
    return ''
  }

  // 前後の空白を除去
  const trimmed = title.trim()

  if (!trimmed) {
    return ''
  }

  // HTMLタグを完全に除去
  let sanitized = removeHtmlTags(trimmed)

  // JavaScriptプロトコルを除去
  sanitized = sanitized.replace(/javascript:/gi, '')

  // 危険なパターンを除去
  sanitized = sanitized.replace(/\balert\s*\([^)]*\)/gi, '')
  sanitized = sanitized.replace(/\beval\s*\([^)]*\)/gi, '')
  sanitized = sanitized.replace(/[<>]/g, '')

  // 連続する空白を整理
  sanitized = sanitized.replace(/\s+/g, ' ').trim()

  // 長すぎるタイトルを制限
  if (sanitized.length > MAX_TITLE_LENGTH) {
    sanitized = sanitized.substring(0, MAX_TITLE_LENGTH)
  }

  return sanitized
}
