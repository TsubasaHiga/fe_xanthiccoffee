import { Skeleton } from '@/components/ui/skeleton'
import { Suspense, forwardRef, lazy } from 'react'

// 動的インポートでMdEditorを遅延読み込み
const MdEditor = lazy(async () => {
  const [{ MdEditor }, { config }, { lineNumbers }] = await Promise.all([
    import('md-editor-rt'),
    import('md-editor-rt'),
    import('@codemirror/view')
  ])

  // 必要な設定も動的に読み込み時に実行
  try {
    const { default: JP_JP } = await import(
      '@vavt/cm-extension/dist/locale/jp-JP'
    )

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
  } catch (error) {
    console.warn('Failed to load jp-JP locale, using default config:', error)
    config({
      codeMirrorExtensions(_theme, extensions) {
        return [...extensions, lineNumbers()]
      }
    })
  }

  return { default: MdEditor }
})

// CSS も動的に読み込み
const loadMdEditorStyles = () => {
  if (!document.querySelector('link[href*="md-editor-rt"]')) {
    import('md-editor-rt/lib/style.css')
  }
}

// ローディングコンポーネント
const EditorSkeleton = () => (
  <div className='grid h-full grid-rows-[40px_1fr] space-y-2'>
    <Skeleton className='w-full rounded-lg' />
    <Skeleton className='w-full rounded-lg' />
  </div>
)

// Props型を簡略化
interface DynamicMdEditorProps {
  value: string
  onChange: (value: string) => void
  id?: string
  style?: React.CSSProperties
  placeholder?: string
  previewTheme?: string
  language?: string
  toolbars?: string[]
  noUploadImg?: boolean
  preview?: boolean
  showToolbarName?: boolean
  showCodeRowNumber?: boolean
  scrollAuto?: boolean
  theme?: string
  codeTheme?: string
  onLoad?: () => void
  minHeight?: number
}

export const DynamicMdEditor = forwardRef<HTMLDivElement, DynamicMdEditorProps>(
  ({ onLoad, minHeight, ...props }, ref) => {
    // スタイルを読み込み
    loadMdEditorStyles()

    return (
      <Suspense fallback={<EditorSkeleton />}>
        <MdEditor
          data-testid='md-editor'
          {...(props as Record<string, unknown>)}
          ref={ref}
        />
      </Suspense>
    )
  }
)
