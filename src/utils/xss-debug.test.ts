import { expect, test } from 'vitest'
import {
  sanitizeColorValue,
  sanitizeDateFormat,
  sanitizeTitle
} from './xssUtils'

test('sanitizeTitle should clean XSS payload', () => {
  const input = '<script>alert("XSS")</script>Malicious Title'
  expect(sanitizeTitle(input)).toBe('Malicious Title')
  expect(sanitizeTitle(input)).not.toContain('<script>')
  expect(sanitizeTitle(input)).not.toContain('alert("XSS")')
})

test('sanitizeDateFormat should return default for XSS', () => {
  const input = '<script>alert("XSS")</script>YYYY-MM-DD'
  expect(sanitizeDateFormat(input)).toBe('YYYY-MM-DD')
  expect(sanitizeDateFormat(input)).not.toContain('<script>')
})

test('sanitizeColorValue should return default for XSS', () => {
  const input = 'javascript:alert("XSS")'
  expect(sanitizeColorValue(input)).toBe('#000000')
  expect(sanitizeColorValue(input)).not.toContain('javascript:')
})
