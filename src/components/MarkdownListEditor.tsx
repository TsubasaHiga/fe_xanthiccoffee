import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Copy } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { MdEditor } from './MdEditor'

export function MarkdownListEditor({
  generatedList,
  copyToClipboard
}: {
  generatedList: string
  copyToClipboard: (text: string) => void
}) {
  const [value, setValue] = useState<string>(generatedList)
  const [isEditing, setIsEditing] = useState(false)

  // generatedListの変更を反映
  useEffect(() => {
    setValue(generatedList)
  }, [generatedList])

  // コピー
  const handleCopy = useCallback(() => {
    copyToClipboard(value)
  }, [value, copyToClipboard])

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
  }

  return (
    <Card
      data-testid='generated-list-card'
      className='z-10 mb-8 gap-4 rounded-2xl border border-gray-200 bg-white shadow-xl'
    >
      <CardHeader>
        <div className='flex flex-col gap-2'>
          <CardTitle className='font-bold text-base text-gray-800 sm:text-lg'>
            生成されたリスト
          </CardTitle>
          <CardDescription className='text-gray-500 text-xs sm:text-sm'>
            以下のマークダウンをコピーしてご利用ください。必要に応じて編集も可能です。
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex gap-2'>
          <Button
            onClick={handleCopy}
            variant='outline'
            size='sm'
            className='border border-blue-300 text-blue-600 transition hover:bg-blue-50'
          >
            <Copy className='mr-2 h-4 w-4' />
            コピー
          </Button>
          <Button
            onClick={handleEditToggle}
            variant='outline'
            size='sm'
            className='border border-gray-300 text-gray-700 transition hover:bg-gray-50'
          >
            {isEditing ? 'プレビューに戻す' : '編集する'}
          </Button>
        </div>
        <div
          data-testid='generated-list'
          data-color-mode='light'
          className='grid min-h-[400px] grid-cols-1 grid-rows-1'
        >
          <MdEditor
            value={value}
            onChange={isEditing ? (val) => setValue(val || '') : undefined}
            preview={isEditing ? 'edit' : 'preview'}
            readOnly={!isEditing}
            className='rounded-md! border border-gray-200 bg-white shadow-inner! overflow-hidden'
          />
        </div>
      </CardContent>
    </Card>
  )
}
