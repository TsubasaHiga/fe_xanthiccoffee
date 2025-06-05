import { ContentLayout } from '@/components/ContentLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { useDateListSettings } from '@/contexts/DateListSettingsContext'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  RotateCcw
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

// Memoized preset configuration constants
const PRESET_CONFIGURATIONS = [
  { type: 'period' as const, value: 7, label: '1週間' },
  { type: 'period' as const, value: 14, label: '2週間' },
  { type: 'period' as const, value: 21, label: '3週間' },
  { type: 'period' as const, value: 28, label: '4週間' },
  { type: 'months' as const, value: 1, label: '1ヶ月' },
  { type: 'months' as const, value: 2, label: '2ヶ月' },
  { type: 'months' as const, value: 3, label: '3ヶ月' },
  { type: 'months' as const, value: 4, label: '4ヶ月' }
] as const

export function DateSettings({
  handleGenerateList: handleGenerateListProp
}: {
  handleGenerateList?: () => void
} = {}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [presetBase, setPresetBase] = useState<'start' | 'end'>('start')

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    dateFormat,
    setDateFormat,
    isLoading,
    isFirstGeneration,
    handleGenerateList,
    applyPreset,
    resetSettings,
    isGenerateButtonDisabled,
    selectedPreset,
    excludeHolidays,
    setExcludeHolidays,
    excludeJpHolidays,
    setExcludeJpHolidays,
    enableHolidayColors,
    setEnableHolidayColors,
    holidayColor,
    setHolidayColor,
    nationalHolidayColor,
    setNationalHolidayColor,
    generatedList,
    // New validation features
    validationErrors
  } = useDateListSettings()

  const handleGenerate = handleGenerateListProp || handleGenerateList

  // Integrated preset processing function
  const handlePresetClick = useCallback(
    (value: number, type: 'period' | 'months') => {
      applyPreset(value, type, presetBase)
    },
    [applyPreset, presetBase]
  )

  // Use validation errors from the hook
  const validationState = useMemo(
    () => ({
      isTitleError: !!validationErrors?.title,
      isDateRangeError: !!validationErrors?.dateRange,
      isDateFormatError: !!validationErrors?.dateFormat,
      isHolidayColorError: !!validationErrors?.holidayColor,
      isNationalHolidayColorError: !!validationErrors?.nationalHolidayColor
    }),
    [validationErrors]
  )

  const {
    isTitleError,
    isDateRangeError,
    isDateFormatError,
    isHolidayColorError,
    isNationalHolidayColorError
  } = validationState

  return (
    <ContentLayout>
      <Card
        data-testid='date-list-settings-card'
        className='z-10 mb-6 rounded-xl border border-gray-200 bg-white shadow-xl sm:mb-8'
      >
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Calendar className='hidden h-7 w-7 text-blue-500 sm:block' />
              <div>
                <CardTitle className='font-bold text-gray-800 text-lg'>
                  設定
                </CardTitle>
                <CardDescription className='text-gray-500 text-xs sm:text-sm'>
                  タイトルと期間を設定してリストを生成してください
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4 sm:space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-gray-700'>
              タイトル <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='タイトルを入力'
              className={`rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                isTitleError
                  ? 'border-destructive bg-destructive/10 placeholder:text-destructive'
                  : 'border-gray-300'
              }`}
              aria-invalid={isTitleError}
              aria-describedby={isTitleError ? 'title-error' : undefined}
              required
            />
            {isTitleError && validationErrors?.title && (
              <p
                id='title-error'
                className='text-destructive text-sm'
                role='alert'
              >
                {validationErrors.title}
              </p>
            )}
          </div>

          <div className='grid grid-cols-[minmax(120px,_1fr)_16px_minmax(120px,_1fr)] items-start gap-1 xs:gap-2 sm:gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='start-date' className='text-gray-700'>
                開始日 <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='start-date'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`appearance-none rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                  isDateRangeError
                    ? 'border-destructive bg-destructive/10'
                    : 'border-gray-300'
                }`}
                aria-invalid={isDateRangeError}
                aria-describedby={
                  isDateRangeError ? 'date-range-error' : undefined
                }
                required
              />
            </div>

            <div className='flex items-center justify-center pt-6'>
              {presetBase === 'start' ? (
                <ArrowRight
                  className='h-4 w-4 text-gray-400'
                  aria-hidden='true'
                />
              ) : (
                <ArrowLeft
                  className='h-4 w-4 text-gray-400'
                  aria-hidden='true'
                />
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='end-date' className='text-gray-700'>
                終了日 <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='end-date'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`appearance-none rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                  isDateRangeError
                    ? 'border-destructive bg-destructive/10'
                    : 'border-gray-300'
                }`}
                aria-invalid={isDateRangeError}
                aria-describedby={
                  isDateRangeError ? 'date-range-error' : undefined
                }
                required
              />
            </div>
          </div>

          {isDateRangeError && validationErrors?.dateRange && (
            <p
              id='date-range-error'
              className='text-destructive text-sm'
              role='alert'
            >
              {validationErrors.dateRange}
            </p>
          )}

          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <Label className='text-gray-700'>期間プリセット</Label>
              <Select
                value={presetBase}
                onValueChange={(v) => setPresetBase(v as 'start' | 'end')}
              >
                <SelectTrigger
                  className='h-auto! w-32 py-1.5 text-xs shadow-none sm:text-sm'
                  aria-label='期間プリセット開始日から/終了日から'
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='start'>開始日から</SelectItem>
                  <SelectItem value='end'>終了日から</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <fieldset className='grid grid-cols-4 gap-2'>
              <legend className='sr-only'>期間プリセット選択</legend>
              {PRESET_CONFIGURATIONS.map((preset) => (
                <Button
                  key={preset.type + preset.value}
                  variant={
                    selectedPreset?.type === preset.type &&
                    selectedPreset.value === preset.value
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() => handlePresetClick(preset.value, preset.type)}
                  disabled={presetBase === 'end' ? !endDate : !startDate}
                  className={
                    selectedPreset?.type === preset.type &&
                    selectedPreset.value === preset.value
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white'
                      : 'border border-blue-300 text-blue-600 transition hover:bg-blue-50'
                  }
                  aria-pressed={
                    selectedPreset?.type === preset.type &&
                    selectedPreset.value === preset.value
                  }
                  aria-label={`${preset.label}の期間を設定`}
                >
                  {preset.label}
                </Button>
              ))}
            </fieldset>
          </div>

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className='mb-4 rounded-xl border border-gray-200 bg-gray-50 sm:mb-6'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className={`flex h-auto w-full items-center justify-between p-3 text-gray-700 transition hover:bg-gray-100 ${isAdvancedOpen ? 'rounded-br-none rounded-bl-none bg-gray-100' : ''}`}
                aria-expanded={isAdvancedOpen}
                aria-controls='advanced-options'
              >
                <span className='font-medium text-sm'>詳細オプション</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                  aria-hidden='true'
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent id='advanced-options' className='p-3 pt-3'>
              <div className='space-y-2'>
                <div className='flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3'>
                  <Label
                    htmlFor='date-format'
                    className='font-medium text-gray-700 text-xs sm:text-base'
                  >
                    日付フォーマット
                  </Label>
                  <Input
                    id='date-format'
                    type='text'
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    placeholder='例: M/D（dd）, YYYY-MM-DD, MM月DD日（ddd）'
                    className={`rounded-lg border bg-gray-50 text-gray-800 transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                      isDateFormatError
                        ? 'border-destructive bg-destructive/10'
                        : 'border-gray-300'
                    }`}
                    aria-invalid={isDateFormatError}
                    aria-describedby={
                      isDateFormatError
                        ? 'date-format-error'
                        : 'date-format-help'
                    }
                  />
                  {isDateFormatError && validationErrors?.dateFormat && (
                    <p
                      id='date-format-error'
                      className='text-destructive text-sm'
                      role='alert'
                    >
                      {validationErrors.dateFormat}
                    </p>
                  )}
                  <div
                    id='date-format-help'
                    className='mt-1 flex flex-col space-y-1 pl-2 text-gray-500 text-xs'
                  >
                    <span>
                      設定例：（<span className='font-bold'>dayjs</span>{' '}
                      形式を使用）
                    </span>
                    <ul className='flex list-disc flex-col pl-5'>
                      <li>
                        <span className='font-mono'>M/D（dd）</span> →
                        12/25（日）
                      </li>
                      <li>
                        <span className='font-mono'>YYYY-MM-DD（ddd）</span> →
                        2024-12-25（Sun）
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='space-y-2 rounded-lg border border-gray-200 bg-white p-3'>
                  <div className='flex items-center justify-between gap-3'>
                    <Label
                      htmlFor='enable-holiday-colors'
                      className='font-medium text-gray-700 text-xs sm:text-base'
                    >
                      休日と祝日の色を変更する
                    </Label>
                    <Switch
                      className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-muted-foreground'
                      id='enable-holiday-colors'
                      checked={enableHolidayColors}
                      onCheckedChange={setEnableHolidayColors}
                      aria-describedby='holiday-colors-help'
                    />
                  </div>
                  <div id='holiday-colors-help' className='sr-only'>
                    有効にすると休日と祝日に色を設定できます
                  </div>
                  {enableHolidayColors && (
                    <div className='grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='holiday-color'
                          className='text-gray-600 text-xs sm:text-sm'
                        >
                          休日（土日）の色
                        </Label>
                        <div className='flex items-center gap-2'>
                          <Input
                            id='holiday-color'
                            type='color'
                            value={holidayColor}
                            onChange={(e) => setHolidayColor(e.target.value)}
                            className='h-8 w-12 rounded border border-gray-300 p-1'
                            aria-label='休日の色を選択'
                          />
                          <Input
                            type='text'
                            value={holidayColor}
                            onChange={(e) => setHolidayColor(e.target.value)}
                            placeholder='#dc2626'
                            className={`flex-1 rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                              isHolidayColorError
                                ? 'border-destructive bg-destructive/10'
                                : 'border-gray-300'
                            }`}
                            aria-invalid={isHolidayColorError}
                            aria-describedby={
                              isHolidayColorError
                                ? 'holiday-color-error'
                                : undefined
                            }
                            aria-label='休日の色コードを直接入力'
                          />
                        </div>
                        {isHolidayColorError &&
                          validationErrors?.holidayColor && (
                            <p
                              id='holiday-color-error'
                              className='text-destructive text-sm'
                              role='alert'
                            >
                              {validationErrors.holidayColor}
                            </p>
                          )}
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='national-holiday-color'
                          className='text-gray-600 text-xs sm:text-sm'
                        >
                          祝日（日本）の色
                        </Label>
                        <div className='flex items-center gap-2'>
                          <Input
                            id='national-holiday-color'
                            type='color'
                            value={nationalHolidayColor}
                            onChange={(e) =>
                              setNationalHolidayColor(e.target.value)
                            }
                            className='h-8 w-12 rounded border border-gray-300 p-1'
                            aria-label='祝日の色を選択'
                          />
                          <Input
                            type='text'
                            value={nationalHolidayColor}
                            onChange={(e) =>
                              setNationalHolidayColor(e.target.value)
                            }
                            placeholder='#dc2626'
                            className={`flex-1 rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                              isNationalHolidayColorError
                                ? 'border-destructive bg-destructive/10'
                                : 'border-gray-300'
                            }`}
                            aria-invalid={isNationalHolidayColorError}
                            aria-describedby={
                              isNationalHolidayColorError
                                ? 'national-holiday-color-error'
                                : undefined
                            }
                            aria-label='祝日の色コードを直接入力'
                          />
                        </div>
                        {isNationalHolidayColorError &&
                          validationErrors?.nationalHolidayColor && (
                            <p
                              id='national-holiday-color-error'
                              className='text-destructive text-sm'
                              role='alert'
                            >
                              {validationErrors.nationalHolidayColor}
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                </div>
                <div className='flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3'>
                  <Label
                    htmlFor='exclude-holidays'
                    className='font-medium text-gray-700 text-xs sm:text-base'
                  >
                    休日（土日）をリストから除外する
                  </Label>
                  <Switch
                    className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-muted-foreground'
                    id='exclude-holidays'
                    checked={excludeHolidays}
                    onCheckedChange={setExcludeHolidays}
                    aria-describedby='exclude-holidays-help'
                  />
                </div>
                <div id='exclude-holidays-help' className='sr-only'>
                  有効にすると土曜日と日曜日がリストから除外されます
                </div>
                <div className='flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3'>
                  <Label
                    htmlFor='exclude-jp-holidays'
                    className='font-medium text-gray-700 text-xs sm:text-base'
                  >
                    祝日（日本）をリストから除外する
                  </Label>
                  <Switch
                    className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-muted-foreground'
                    id='exclude-jp-holidays'
                    checked={excludeJpHolidays}
                    onCheckedChange={setExcludeJpHolidays}
                    aria-describedby='exclude-jp-holidays-help'
                  />
                </div>
                <div id='exclude-jp-holidays-help' className='sr-only'>
                  有効にすると日本の祝日がリストから除外されます
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className='-mx-6 space-y-4 sm:space-y-6'>
            <Separator />
            <div className='space-y-1 px-6'>
              <Button
                onClick={handleGenerate}
                size='lg'
                className='w-full rounded-lg bg-blue-600 py-3 font-bold text-base text-white shadow-md transition-all duration-200 hover:bg-blue-700 sm:text-lg'
                disabled={
                  isGenerateButtonDisabled ||
                  (isLoading && isFirstGeneration && !generatedList)
                }
                aria-describedby='generate-button-help'
              >
                {isLoading && isFirstGeneration && !generatedList ? (
                  <div className='flex items-center gap-2'>
                    <Spinner size={16} className='text-white' />
                    <span>生成中...</span>
                  </div>
                ) : (
                  'リスト生成'
                )}
              </Button>
              <div id='generate-button-help' className='sr-only'>
                入力された設定に基づいて日付リストを生成します
              </div>
              <Button
                onClick={resetSettings}
                variant='outline'
                size='lg'
                className='mt-2 w-full border border-gray-300 text-gray-500 transition hover:bg-gray-100'
                aria-label='すべての設定を初期値にリセット'
              >
                <RotateCcw className='mr-2 h-4 w-4' aria-hidden='true' />
                リセット
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  )
}
