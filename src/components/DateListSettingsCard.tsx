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
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useDateListSettings } from '@/contexts/DateListSettingsContext'
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export function DateListSettingsCard() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  // 必須項目のバリデーション
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    dateFormat,
    setDateFormat,
    handleGenerateList,
    setPresetPeriod,
    setPresetMonths,
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
    setNationalHolidayColor
  } = useDateListSettings()
  const isTitleError = !title.trim()
  const isStartDateError = !startDate
  const isEndDateError = !endDate

  return (
    <ContentLayout>
      <Card className='z-10 mb-6 rounded-xl border border-gray-200 bg-white shadow-xl sm:mb-8'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Calendar className='h-7 w-7 text-blue-500' />
              <div>
                <CardTitle className='font-bold text-base text-gray-800 sm:text-lg'>
                  設定
                </CardTitle>
                <CardDescription className='text-gray-500 text-xs sm:text-sm'>
                  タイトルと期間を設定してリストを生成してください
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-gray-700'>
              タイトル
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
              required
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='start-date' className='text-gray-700'>
                開始日
              </Label>
              <Input
                id='start-date'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                  isStartDateError
                    ? 'border-destructive bg-destructive/10 placeholder:text-destructive'
                    : 'border-gray-300'
                }`}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='end-date' className='text-gray-700'>
                終了日
              </Label>
              <Input
                id='end-date'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`rounded-lg border bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ${
                  isEndDateError
                    ? 'border-destructive bg-destructive/10 placeholder:text-destructive'
                    : 'border-gray-300'
                }`}
                required
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Label className='text-gray-700'>期間プリセット</Label>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
              {[
                { type: 'period', value: 7, label: '1週間' },
                { type: 'period', value: 14, label: '2週間' },
                { type: 'period', value: 21, label: '3週間' },
                { type: 'period', value: 28, label: '4週間' },
                { type: 'months', value: 1, label: '1ヶ月' },
                { type: 'months', value: 2, label: '2ヶ月' },
                { type: 'months', value: 3, label: '3ヶ月' },
                { type: 'months', value: 4, label: '4ヶ月' }
              ].map((preset) => (
                <Button
                  key={preset.type + preset.value}
                  variant={
                    selectedPreset?.type === preset.type &&
                    selectedPreset.value === preset.value
                      ? 'default'
                      : 'outline'
                  }
                  size='sm'
                  onClick={() =>
                    preset.type === 'period'
                      ? setPresetPeriod(preset.value)
                      : setPresetMonths(preset.value)
                  }
                  disabled={!startDate}
                  className={
                    selectedPreset?.type === preset.type &&
                    selectedPreset.value === preset.value
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white'
                      : 'border border-blue-300 text-blue-600 transition hover:bg-blue-50'
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className='rounded-xl border border-gray-200 bg-gray-50'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className={`flex h-auto w-full items-center justify-between p-3 text-gray-700 transition hover:bg-gray-100 ${isAdvancedOpen ? 'rounded-br-none rounded-bl-none bg-gray-100' : ''}`}
              >
                <span className='font-medium text-sm'>詳細オプション</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='p-3 pt-3'>
              <div className='space-y-2'>
                <div className='flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3'>
                  <Label
                    htmlFor='date-format'
                    className='font-medium text-gray-700'
                  >
                    日付フォーマット
                  </Label>
                  <Input
                    id='date-format'
                    type='text'
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    placeholder='例: M/D（dd）, YYYY-MM-DD, MM月DD日（ddd）'
                    className='rounded-lg border border-gray-300 bg-gray-50 text-gray-800 transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                  />
                  <p className='mt-1 flex list-disc flex-col space-y-1 pl-4 text-gray-500 text-xs'>
                    <span>
                      設定例：（<span className='font-bold'>dayjs</span>{' '}
                      形式を使用）
                    </span>
                    <li>
                      <span className='font-mono'>M/D（dd）</span> → 12/25（日）
                    </li>
                    <li>
                      <span className='font-mono'>YYYY-MM-DD（ddd）</span> →
                      2024-12-25（Sun）
                    </li>
                  </p>
                </div>
                <div className='space-y-2 rounded-lg border border-gray-200 bg-white p-3'>
                  <div className='flex items-center justify-between gap-3'>
                    <Label
                      htmlFor='enable-holiday-colors'
                      className='font-medium text-gray-700 text-sm'
                    >
                      休日と祝日の色を変更する
                    </Label>
                    <Switch
                      className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-muted-foreground'
                      id='enable-holiday-colors'
                      checked={enableHolidayColors}
                      onCheckedChange={setEnableHolidayColors}
                    />
                  </div>
                  {enableHolidayColors && (
                    <div className='grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='holiday-color'
                          className='text-gray-600 text-xs'
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
                          />
                          <Input
                            type='text'
                            value={holidayColor}
                            onChange={(e) => setHolidayColor(e.target.value)}
                            placeholder='#dc2626'
                            className='flex-1 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-xs transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='national-holiday-color'
                          className='text-gray-600 text-xs'
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
                          />
                          <Input
                            type='text'
                            value={nationalHolidayColor}
                            onChange={(e) =>
                              setNationalHolidayColor(e.target.value)
                            }
                            placeholder='#dc2626'
                            className='flex-1 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-xs transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className='flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3'>
                  <Label
                    htmlFor='exclude-holidays'
                    className='font-medium text-gray-700 text-sm'
                  >
                    休日（土日）をリストから除外する
                  </Label>
                  <Switch
                    className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-muted-foreground'
                    id='exclude-holidays'
                    checked={excludeHolidays}
                    onCheckedChange={setExcludeHolidays}
                  />
                </div>
                <div className='flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3'>
                  <Label
                    htmlFor='exclude-jp-holidays'
                    className='font-medium text-gray-700 text-sm'
                  >
                    祝日（日本）をリストから除外する
                  </Label>
                  <Switch
                    className='data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-muted-foreground'
                    id='exclude-jp-holidays'
                    checked={excludeJpHolidays}
                    onCheckedChange={setExcludeJpHolidays}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className='-mx-6 space-y-6'>
            <Separator />
            <div className='space-y-1 px-6'>
              <Button
                onClick={handleGenerateList}
                size='lg'
                className='w-full rounded-lg bg-blue-600 py-3 font-bold text-base text-white shadow-md transition-all duration-200 hover:bg-blue-700 sm:text-lg'
                disabled={isGenerateButtonDisabled}
              >
                リスト生成
              </Button>

              <Button
                onClick={resetSettings}
                variant='outline'
                size='lg'
                className='mt-2 w-full border border-gray-300 text-gray-500 transition hover:bg-gray-100'
              >
                <RotateCcw className='mr-2 h-4 w-4' />
                リセット
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentLayout>
  )
}
