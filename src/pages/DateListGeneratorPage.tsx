import { ContentLayout } from '@/components/ContentLayout'
import { DateSettings } from '@/components/DateSettings'
import { Badge } from '@/components/ui/badge'
import {
  DateListSettingsProvider,
  useDateListSettings
} from '@/contexts/DateListSettingsContext'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'

// Lazy loading for MarkdownViewer
const MarkdownViewer = lazy(() =>
  import('@/components/MarkdownViewer').then((module) => ({
    default: module.MarkdownViewer
  }))
)

function DateListGeneratorContent() {
  const settings = useDateListSettings()
  const generatedListRef = useRef<HTMLDivElement | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [shouldScrollOnMount, setShouldScrollOnMount] = useState(false)

  // スクロール処理
  const scrollToViewer = () => {
    generatedListRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'start'
    })
  }

  // リスト生成とスクロール処理
  const handleGenerateListWithScroll = () => {
    const wasFirstGeneration = settings.isFirstGeneration

    // 同期的に実行してUIの即座な更新を実現
    settings.handleGenerateList()

    if (wasFirstGeneration) {
      setShouldScrollOnMount(true)
    } else {
      // 2回目以降は少し遅延させてスクロール
      setTimeout(scrollToViewer, 100)
    }
  }

  // MarkdownViewer遅延読み込み完了時の処理
  const handleMarkdownMount = () => {
    settings.notifyLazyLoadingComplete()

    if (shouldScrollOnMount) {
      scrollToViewer()
      setShouldScrollOnMount(false)
    }
  }

  // ビューアーの表示制御
  useEffect(() => {
    const hasGeneratedList = Boolean(settings.generatedList)
    setShowViewer(hasGeneratedList)
  }, [settings.generatedList])

  return (
    <>
      <DateSettings handleGenerateList={handleGenerateListWithScroll} />
      {showViewer && settings.generatedList && (
        <ContentLayout ref={generatedListRef} className='scroll-m-2'>
          <Suspense fallback={null}>
            <MarkdownViewer
              generatedList={settings.generatedList}
              copyToClipboard={settings.copyToClipboard}
              exportMarkdown={settings.exportMarkdown}
              exportPDF={settings.exportPDF}
              onMount={handleMarkdownMount}
            />
          </Suspense>
        </ContentLayout>
      )}
    </>
  )
}

export function DateListGeneratorPage() {
  return (
    <DateListSettingsProvider>
      <div className='relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-2 py-6 sm:px-4 sm:py-10'>
        <div className='pointer-events-none absolute inset-0 z-0'>
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png')] opacity-10" />
        </div>
        <div className='z-10 mb-6 space-y-3 text-center sm:mb-10 sm:space-y-4'>
          <h1 className='font-[Inter] font-extrabold text-gray-800 tracking-tight'>
            <span className='relative text-4xl md:text-5xl'>
              MarkDays
              <Badge
                variant='outline'
                className='-top-0 absolute right-0 rounded-none border-none p-0 font-medium font-sans text-[10px] tracking-tight md:text-xs md:tracking-wide'
              >
                マークデイズ
              </Badge>
            </span>
          </h1>
          <p className='font-medium text-gray-600 text-sm sm:text-base md:text-lg'>
            Markdown形式で日付と曜日のリストを一発生成！
            <br />
            スケジュール作成やタスク管理をもっとスムーズに。
          </p>
        </div>
        <DateListGeneratorContent />
      </div>
    </DateListSettingsProvider>
  )
}
