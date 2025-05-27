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
import { useDateListGenerator } from '@/hooks/useDateListGenerator'
import { Calendar, ChevronDown, Copy, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export function DateListGeneratorPage() {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    dateFormat,
    setDateFormat,
    generatedList,
    handleGenerateList,
    setPresetPeriod,
    setPresetMonths,
    copyToClipboard,
    resetSettings,
    isGenerateButtonDisabled,
    selectedPreset
  } = useDateListGenerator()

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-2 py-6 sm:px-4 sm:py-10'>
      <div className='pointer-events-none absolute inset-0 z-0'>
        {/* subtle geometric background pattern */}
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png')] opacity-10" />
      </div>
      <div className='z-10 mb-6 space-y-3 text-center sm:mb-10 sm:space-y-4'>
        <h1 className='font-extrabold text-3xl text-gray-800 tracking-tight sm:text-4xl md:text-5xl'>
          MarkDays
        </h1>
        <p className='font-medium text-gray-600 text-sm sm:text-base md:text-lg'>
          Markdown形式で日付と曜日のリストを一発生成！
          <br />
          スケジュール作成やタスク管理をもっとスムーズに。
        </p>
      </div>

      <Card className='z-10 mb-6 w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl sm:mb-8 sm:max-w-xl md:max-w-2xl md:rounded-2xl'>
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
              className='rounded-lg border border-gray-300 bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
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
                className='rounded-lg border border-gray-300 bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
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
                className='rounded-lg border border-gray-300 bg-gray-50 text-gray-800 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
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
                className='flex h-auto w-full items-center justify-between p-3 text-gray-700 transition hover:bg-gray-100'
              >
                <span className='font-medium text-sm'>詳細オプション</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='p-3 pt-3'>
              <div className='space-y-2'>
                <Label htmlFor='date-format' className='text-gray-700'>
                  日付フォーマット
                </Label>
                <Input
                  id='date-format'
                  type='text'
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  placeholder='例: M/D（dd）, YYYY-MM-DD, MM月DD日（ddd）'
                  className='rounded-lg border border-gray-300 bg-white text-gray-800 transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                />
                <p className='text-gray-500 text-xs'>
                  dayjs形式を使用（例: M/D（dd）→ 12/25（日）,
                  YYYY-MM-DD（ddd）→ 2024-12-25（Sun））
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <div className='space-y-1'>
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
        </CardContent>
      </Card>

      {generatedList && (
        <Card className='z-10 mb-8 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl sm:max-w-xl md:max-w-2xl'>
          <CardHeader>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='font-bold text-base text-gray-800 sm:text-lg'>
                  生成されたリスト
                </CardTitle>
                <CardDescription className='text-gray-500 text-xs sm:text-sm'>
                  以下のマークダウンをコピーしてご利用ください
                </CardDescription>
              </div>
              <Button
                onClick={copyToClipboard}
                variant='outline'
                size='sm'
                className='mt-2 border border-blue-300 text-blue-600 transition hover:bg-blue-50 sm:mt-0'
              >
                <Copy className='mr-2 h-4 w-4' />
                コピー
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className='max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-gray-800 text-xs shadow-inner sm:p-6 sm:text-base'>
              {generatedList}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
