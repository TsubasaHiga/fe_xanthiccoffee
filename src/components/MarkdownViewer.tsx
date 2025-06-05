import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Copy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ConfiguredMdEditor } from './ConfiguredMdEditor'
import { MdPreview } from './MdPreview'

export function MarkdownViewer({
  generatedList,
  copyToClipboard,
  onMount
}: {
  generatedList: string
  copyToClipboard: (text: string) => void
  onMount?: () => void
}) {
  const [value, setValue] = useState<string>(generatedList)
  const [isEditing, setIsEditing] = useState(false)
  const [previewHeight, setPreviewHeight] = useState<number | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Reflect changes in generatedList
  useEffect(() => {
    setValue(generatedList)
  }, [generatedList])

  // Measure preview height
  useEffect(() => {
    if (!isEditing && previewRef.current) {
      const height = previewRef.current.scrollHeight
      setPreviewHeight(height)
    }
  }, [isEditing])

  // Copy function
  const handleCopy = useCallback(() => {
    copyToClipboard(value)
  }, [value, copyToClipboard])

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev)
  }

  useEffect(() => {
    if (onMount) onMount()
  }, [onMount])

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
          ref={previewRef}
          data-color-mode='light'
          className='grid grid-cols-1 grid-rows-1'
          style={{
            minHeight: previewHeight ? `${previewHeight}px` : undefined
          }}
        >
          {isEditing ? (
            <ConfiguredMdEditor
              value={value}
              onChange={setValue}
              id='generated-list-md-editor-rt'
              style={{
                background: '#f9fafb',
                borderRadius: '0.5rem',
                height: '100%',
                width: '100%',
                fontVariantNumeric: 'tabular-nums'
              }}
              placeholder='ここにマークダウンを編集できます'
              previewTheme='github'
              language='jp-JP'
              toolbars={[
                'bold',
                'italic',
                'strikeThrough',
                '-',
                'unorderedList',
                'orderedList',
                'task',
                '-',
                'code'
              ]}
              ref={editorRef}
              preview={false}
              showCodeRowNumber={false}
              scrollAuto={true}
              theme='light'
              codeTheme='github'
              noKatex={true}
              noMermaid={true}
              noHighlight={true}
              noImgZoomIn={true}
              noUploadImg={true}
            />
          ) : (
            <div className='rounded-md border border-gray-200 bg-white px-6 py-8 shadow-inner'>
              <MdPreview
                value={value}
                className='prose-ul:ps-0 prose-ul:pl-1!'
                style={{
                  background: 'transparent',
                  fontVariantNumeric: 'tabular-nums'
                }}
                language='jp-JP'
                previewTheme='github'
                noKatex={true}
                noMermaid={true}
                noHighlight={true}
                noImgZoomIn={true}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
