import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type PersistedSettings,
  clearSettingsFromStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage
} from './localStorage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('localStorage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockSettings: PersistedSettings = {
    title: 'テストタイトル',
    dateFormat: 'YYYY/MM/DD',
    excludeHolidays: true,
    excludeJpHolidays: false,
    enableHolidayColors: true,
    holidayColor: '#ff0000',
    nationalHolidayColor: '#00ff00'
  }

  describe('saveSettingsToStorage', () => {
    it('should save settings to localStorage', () => {
      saveSettingsToStorage(mockSettings)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'markdays_settings',
        JSON.stringify(mockSettings)
      )
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      expect(() => saveSettingsToStorage(mockSettings)).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save settings to localStorage:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('loadSettingsFromStorage', () => {
    it('should load settings from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSettings))

      const result = loadSettingsFromStorage()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('markdays_settings')
      expect(result).toEqual(mockSettings)
    })

    it('should return null when no settings are stored', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = loadSettingsFromStorage()

      expect(result).toBeNull()
    })

    it('should return null for invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.getItem.mockReturnValue('invalid json')

      const result = loadSettingsFromStorage()

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load settings from localStorage:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should return null for non-object data', () => {
      localStorageMock.getItem.mockReturnValue('"string data"')

      const result = loadSettingsFromStorage()

      expect(result).toBeNull()
    })
  })

  describe('clearSettingsFromStorage', () => {
    it('should remove settings from localStorage', () => {
      clearSettingsFromStorage()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'markdays_settings'
      )
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => clearSettingsFromStorage()).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear settings from localStorage:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })
})
