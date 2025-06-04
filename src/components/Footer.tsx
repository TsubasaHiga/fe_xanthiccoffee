import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { EXTERNAL_LINKS } from '@/lib/externalLinks'
import { getAppVersion } from '@/lib/version'

export const Footer = () => {
  const version = getAppVersion()
  return (
    <footer className='mt-auto bg-white'>
      <div className='mx-auto max-w-4xl px-4 py-6'>
        <Card className='w-full items-center border-none bg-white/95 px-0 py-4 shadow-none'>
          <div className='flex w-full flex-col items-center gap-2'>
            <div className='flex flex-row items-center gap-1.5'>
              <span className='font-semibold text-base text-gray-800'>
                MarkDays
              </span>
              <Badge variant='default'>{version}</Badge>
            </div>
            <Separator className='my-2 w-24 bg-gray-200' />
            <div className='flex flex-wrap items-center gap-3 text-gray-600 text-xs'>
              <a
                className='underline underline-offset-2 transition-colors hover:text-blue-700'
                href={EXTERNAL_LINKS.cofus}
                target='_blank'
                rel='noreferrer noopener'
              >
                COFUS
              </a>
              <Separator
                orientation='vertical'
                className='h-4 w-px bg-gray-200'
              />
              <a
                className='underline underline-offset-2 transition-colors hover:text-blue-700'
                href={EXTERNAL_LINKS.changelog}
                target='_blank'
                rel='noreferrer noopener'
              >
                ChangeLog
              </a>
              <Separator
                orientation='vertical'
                className='h-4 w-px bg-gray-200'
              />
              <a
                className='underline underline-offset-2 transition-colors hover:text-blue-700'
                href={EXTERNAL_LINKS.issue}
                target='_blank'
                rel='noreferrer noopener'
              >
                Issue
              </a>
            </div>
            <p className='mt-2 text-center text-gray-450 text-xs'>
              © 2025 COFUS. All rights reserved.
            </p>
          </div>
        </Card>
      </div>
    </footer>
  )
}
