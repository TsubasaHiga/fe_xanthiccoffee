import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Copy } from 'lucide-react'

export function GeneratedListCard({
  generatedList,
  copyToClipboard
}: {
  generatedList: string
  copyToClipboard: () => void
}) {
  return (
    <Card className='z-10 mb-8 rounded-2xl border border-gray-200 bg-white shadow-xl sm:max-w-xl md:max-w-2xl'>
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
            onClick={copyToClipboard}
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
        <pre className='max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-gray-800 text-xs shadow-inner sm:p-6 sm:text-base'>
          {generatedList}
        </pre>
      </CardContent>
    </Card>
  )
}
