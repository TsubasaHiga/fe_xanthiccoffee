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
    isGenerateButtonDisabled
  } = useDateListGenerator()

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  return (
    <div className='container mx-auto max-w-4xl px-4 py-10'>
      <div className='mb-8 space-y-4 text-center'>
        <h1 className='font-bold text-4xl text-gray-900'>MarkDays</h1>
        <p className='text-gray-600'>
          Markdown形式で日付と曜日のリストを一発生成！
          <br />
          スケジュール作成やタスク管理をもっとスムーズに。
        </p>
      </div>

      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              <div>
                <CardTitle>設定</CardTitle>
                <CardDescription>
                  タイトルと期間を設定してリストを生成してください
                </CardDescription>
              </div>
            </div>
            <Button onClick={resetSettings} variant='outline' size='sm'>
              <RotateCcw className='mr-2 h-4 w-4' />
              リセット
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>タイトル</Label>
            <Input
              id='title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='タイトルを入力'
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='start-date'>開始日</Label>
              <Input
                id='start-date'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='end-date'>終了日</Label>
              <Input
                id='end-date'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Label>期間プリセット</Label>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPresetPeriod(7)}
                disabled={!startDate}
              >
                1週間
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPresetPeriod(14)}
                disabled={!startDate}
              >
                2週間
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPresetMonths(1)}
                disabled={!startDate}
              >
                1ヶ月
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPresetMonths(2)}
                disabled={!startDate}
              >
                2ヶ月
              </Button>
            </div>
          </div>

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className='rounded-lg border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex h-auto w-full items-center justify-between p-3'
              >
                <span className='font-medium text-sm'>詳細オプション</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='p-3 pt-3'>
              <div className='space-y-2'>
                <Label htmlFor='date-format'>日付フォーマット</Label>
                <Input
                  id='date-format'
                  type='text'
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  placeholder='例: M/D（dd）, YYYY-MM-DD, MM月DD日（ddd）'
                />
                <p className='text-gray-500 text-xs'>
                  dayjs形式を使用（例: M/D（dd）→ 12/25（日）,
                  YYYY-MM-DD（ddd）→ 2024-12-25（Sun））
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={handleGenerateList}
            className='w-full'
            disabled={isGenerateButtonDisabled}
          >
            リスト生成
          </Button>
        </CardContent>
      </Card>

      {generatedList && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>生成されたリスト</CardTitle>
                <CardDescription>
                  以下のマークダウンをコピーしてご利用ください
                </CardDescription>
              </div>
              <Button onClick={copyToClipboard} variant='outline' size='sm'>
                <Copy className='mr-2 h-4 w-4' />
                コピー
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className='overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-4 font-mono text-sm'>
              {generatedList}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
