import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should merge classes correctly', () => {
      const result = cn('bg-red-500', 'text-white')
      expect(result).toBe('bg-red-500 text-white')
    })

    it('should handle undefined and null values', () => {
      const result = cn('bg-red-500', undefined, null, 'text-white')
      expect(result).toBe('bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('should handle conditional classes when false', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class')
    })

    it('should merge conflicting Tailwind classes', () => {
      // twMerge should resolve conflicts, keeping the last one
      const result = cn('bg-red-500', 'bg-blue-500')
      expect(result).toBe('bg-blue-500')
    })

    it('should handle array of classes', () => {
      const result = cn(['bg-red-500', 'text-white'])
      expect(result).toBe('bg-red-500 text-white')
    })

    it('should handle object with boolean values', () => {
      const result = cn({
        'bg-red-500': true,
        'text-white': true,
        hidden: false
      })
      expect(result).toBe('bg-red-500 text-white')
    })

    it('should return empty string for no arguments', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})
