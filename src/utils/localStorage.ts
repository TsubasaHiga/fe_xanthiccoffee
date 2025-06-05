// localStorage utility functions with error handling

const STORAGE_KEY = 'markdays_settings'

export interface PersistedSettings {
  title: string
  dateFormat: string
  excludeHolidays: boolean
  excludeJpHolidays: boolean
  enableHolidayColors: boolean
  holidayColor: string
  nationalHolidayColor: string
}

export const saveSettingsToStorage = (settings: PersistedSettings): void => {
  try {
    const serialized = JSON.stringify(settings)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error)
  }
}

export const loadSettingsFromStorage =
  (): Partial<PersistedSettings> | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const parsed = JSON.parse(stored)

      // Validate the structure to ensure data integrity
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }

      return null
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error)
      return null
    }
  }

export const clearSettingsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error)
  }
}
