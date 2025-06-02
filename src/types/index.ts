export type DateListSettings = {
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  title: string
  setTitle: (v: string) => void
  dateFormat: string
  setDateFormat: (v: string) => void
  handleGenerateList: () => void
  setPresetPeriod: (v: number) => void
  setPresetMonths: (v: number) => void
  resetSettings: () => void
  isGenerateButtonDisabled: boolean
  selectedPreset: { type: string; value: number } | null
  excludeHolidays: boolean
  setExcludeHolidays: (v: boolean) => void
  excludeJpHolidays: boolean
  setExcludeJpHolidays: (v: boolean) => void
  enableHolidayColors: boolean
  setEnableHolidayColors: (v: boolean) => void
  holidayColor: string
  setHolidayColor: (v: string) => void
  nationalHolidayColor: string
  setNationalHolidayColor: (v: string) => void
}
