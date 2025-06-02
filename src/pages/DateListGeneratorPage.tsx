import { ContentLayout } from '@/components/ContentLayout'
import { DateListSettingsCard } from '@/components/DateListSettingsCard'
import { GeneratedListCardV3 } from '@/components/GeneratedListCardV3'
import {
  DateListSettingsProvider,
  useDateListSettings
} from '@/contexts/DateListSettingsContext'
import { useEffect, useRef } from 'react'

function DateListGeneratorContent() {
  const settings = useDateListSettings()
  const generatedListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (settings.generatedList && generatedListRef.current) {
      generatedListRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [settings.generatedList])

  return (
    <>
      <DateListSettingsCard />
      {settings.generatedList && (
        <ContentLayout ref={generatedListRef}>
          <GeneratedListCardV3
            generatedList={settings.generatedList}
            copyToClipboard={settings.copyToClipboard}
          />
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
          <h1 className='font-[Inter] font-extrabold text-3xl text-gray-800 tracking-tight sm:text-4xl md:text-5xl'>
            MarkDays
          </h1>
          <p className='font-medium text-gray-600 text-sm sm:text-base md:text-lg'>
            Markdown形式で日付と曜日のリストを一発生成！
            <br />
            スケジュール作成やタスク管理をもっとスムーズに。
          </p>
        </div>
        <DateListGeneratorContent />
        <footer className='z-10 mt-8 text-center text-gray-500 text-xs'>
          © 2024 MarkDays
        </footer>
      </div>
    </DateListSettingsProvider>
  )
}
