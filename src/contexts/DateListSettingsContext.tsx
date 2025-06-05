import { useDateListGenerator } from '@/hooks/useDateListGenerator'
import type React from 'react'
import { createContext, useContext, useMemo } from 'react'

// Context type
export type DateListSettingsContextType = ReturnType<
  typeof useDateListGenerator
>

const DateListSettingsContext = createContext<
  DateListSettingsContextType | undefined
>(undefined)

export const DateListSettingsProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const value = useDateListGenerator()
  // Wrap with useMemo to prevent unnecessary re-renders
  const memoedValue = useMemo(() => value, [value])
  return (
    <DateListSettingsContext.Provider value={memoedValue}>
      {children}
    </DateListSettingsContext.Provider>
  )
}

export function useDateListSettings() {
  const ctx = useContext(DateListSettingsContext)
  if (!ctx)
    throw new Error(
      'useDateListSettings must be used within DateListSettingsProvider'
    )
  return ctx
}
