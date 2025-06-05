import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('ユーティリティ関数', () => {
  describe('cn関数', () => {
    it('クラス名を正しく結合できる', () => {
      const result = cn('bg-red-500', 'text-white')
      expect(result).toBe('bg-red-500 text-white')
    })

    it('undefinedやnullを無視して結合できる', () => {
      const result = cn('bg-red-500', undefined, null, 'text-white')
      expect(result).toBe('bg-red-500 text-white')
    })

    it('条件付きクラスを正しく処理できる', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('条件がfalseのときクラスが追加されない', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class')
    })

    it('Tailwindの競合クラスを正しく解決できる', () => {
      // twMerge should resolve conflicts, keeping the last one
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })

    it('配列で渡したクラスも結合できる', () => {
      const result = cn(['bg-red-500', 'text-white'])
      expect(result).toBe('bg-red-500 text-white')
    })

    it('オブジェクト形式のクラス指定も正しく処理できる', () => {
      const result = cn({
        'bg-red-500': true,
        'text-white': true,
        hidden: false
      })
      expect(result).toBe('bg-red-500 text-white')
    })

    it('引数なしの場合は空文字を返す', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})
