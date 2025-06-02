import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { MdEditor, MdPreview, config } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { lineNumbers } from '@codemirror/view'
import JP_JP from '@vavt/cm-extension/dist/locale/jp-JP'
import { Copy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

config({
  editorConfig: {
    languageUserDefined: {
      'jp-JP': JP_JP
    }
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()]
  }
})

export function GeneratedListCardV3({
  generatedList,
  copyToClipboard
}: {
  generatedList: string
  copyToClipboard: (text: string) => void
}) {
  const [value, setValue] = useState<string>(generatedList)
  const [isEditing, setIsEditing] = useState(false)
  const editorRef = useRef<typeof MdEditor>(null)

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
      className='z-10 mb-8 rounded-2xl border border-gray-200 bg-white shadow-xl'
    >
      <CardHeader>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-10'>
          <div>
            <CardTitle className='font-bold text-base text-gray-800 sm:text-lg'>
              生成されたリスト
            </CardTitle>
            <CardDescription className='text-gray-500 text-xs sm:text-sm'>
              以下のマークダウンをコピーしてご利用ください
            </CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <CardContent>
        <div data-testid='generated-list' data-color-mode='light'>
          {isEditing ? (
            <MdEditor
              value={value}
              onChange={setValue}
              id='generated-list-md-editor-rt'
              style={{
                background: '#f9fafb',
                borderRadius: '0.5rem',
                height: 'auto',
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
                'code',
                'preview',
                'fullscreen'
              ]}
              ref={editorRef}
              noUploadImg={true}
              preview={false}
              showToolbarName={false}
              showCodeRowNumber={false}
              scrollAuto={true}
              theme='light'
              codeTheme='github'
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
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
