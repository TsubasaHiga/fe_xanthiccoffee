import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { MdEditor, config } from 'md-editor-rt'
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
  const editorRef = useRef<typeof MdEditor>(null)

  // generatedListの変更を反映
  useEffect(() => {
    setValue(generatedList)
  }, [generatedList])

  // コピー
  const handleCopy = useCallback(() => {
    copyToClipboard(value)
  }, [value, copyToClipboard])

  return (
    <Card className='z-10 mb-8 rounded-2xl border border-gray-200 bg-white shadow-xl'>
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
            onClick={handleCopy}
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
        <div data-color-mode='light'>
          <MdEditor
            value={value}
            onChange={setValue}
            id='generated-list-md-editor-rt'
            style={{
              fontFamily:
                'Noto Sans JP, Inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
              fontSize: '1rem',
              color: '#1f2937',
              background: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.03)',
              height: 'auto'
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
            preview={true}
            showToolbarName={false}
            showCodeRowNumber={false}
            scrollAuto={true}
            theme='light'
            codeTheme='atom'
          />
        </div>
      </CardContent>
    </Card>
  )
}
