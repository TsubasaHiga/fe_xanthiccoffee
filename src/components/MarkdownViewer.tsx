import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { exportAsMarkdown, exportAsPDF } from '@/utils/exportUtils'
import { ChevronDown, Copy, Download, FileText } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { toast } from 'sonner'
import { ConfiguredMdEditor } from './ConfiguredMdEditor'
import { MdPreview } from './MdPreview'

// プロップの型定義
interface MarkdownViewerProps {
  readonly generatedList: string
  readonly copyToClipboard: (text: string) => void
  readonly exportMarkdown?: () => void
  readonly exportPDF?: (customContent?: string) => void | Promise<void>
  readonly onMount?: () => void
}

export function MarkdownViewer({
  generatedList,
  copyToClipboard,
  exportMarkdown,
  exportPDF,
  onMount
}: MarkdownViewerProps) {
  // 状態管理
  const [value, setValue] = useState<string>(generatedList)
  const [isEditing, setIsEditing] = useState(false)
  const [previewHeight, setPreviewHeight] = useState<number | null>(null)

  // DOM参照
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // generatedListの変更を反映
  useEffect(() => {
    setValue(generatedList)
  }, [generatedList])

  // プレビュー高さの測定
  useEffect(() => {
    if (!isEditing && previewRef.current) {
      const height = previewRef.current.scrollHeight
      setPreviewHeight(height)
    }
  }, [isEditing])

  // コピー処理
  const handleCopy = useCallback(() => {
    copyToClipboard(value)
  }, [value, copyToClipboard])

  // 編集モード切り替え
  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev)
  }, [])

  // コンポーネントマウント完了時の処理
  useLayoutEffect(() => {
    if (!onMount) return

    // DOMレンダリング完了を確実に待つ
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onMount()
        })
      })
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [onMount])

  // Markdownエクスポート処理
  const handleExportMarkdown = useCallback(() => {
    if (exportMarkdown) {
      exportMarkdown()
    } else {
      try {
        exportAsMarkdown(value)
        toast.success('Markdownファイルをダウンロードしました')
      } catch (error) {
        console.error('Markdown エクスポートに失敗しました:', error)
        toast.error('Markdown エクスポートに失敗しました', {
          style: { color: '#b91c1c' }
        })
      }
    }
  }, [value, exportMarkdown])

  // PDFエクスポート処理
  const handleExportPDF = useCallback(async () => {
    try {
      if (exportPDF) {
        await exportPDF(value)
      } else {
        await exportAsPDF(value)
        toast.success('PDFファイルをダウンロードしました')
      }
    } catch (error) {
      console.error('PDF エクスポートに失敗しました:', error)
      toast.error('PDF エクスポートに失敗しました', {
        style: { color: '#b91c1c' }
      })
    }
  }, [value, exportPDF])

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
        <div className='flex flex-wrap justify-between gap-2'>
          <div className='grid w-full grid-cols-[1fr_1fr] gap-2 sm:w-auto sm:grid-cols-2'>
            <Button
              onClick={handleCopy}
              size='sm'
              className='bg-blue-600 hover:bg-blue-700'
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
          {(exportMarkdown || exportPDF) && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex w-full items-center border border-gray-300 text-gray-700 transition hover:bg-gray-50 sm:w-auto'
                >
                  ダウンロードする
                  <ChevronDown className='ml-1 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {exportMarkdown && (
                  <DropdownMenuItem onSelect={handleExportMarkdown}>
                    <Download className='mr-2 h-4 w-4 text-blue-600' />
                    Markdown
                  </DropdownMenuItem>
                )}
                {exportPDF && (
                  <DropdownMenuItem onSelect={handleExportPDF}>
                    <FileText className='mr-2 h-4 w-4 text-red-600' />
                    PDF
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
