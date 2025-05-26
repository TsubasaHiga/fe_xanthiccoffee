export const Footer = () => {
  return (
    <footer className='mt-auto border-gray-200 border-t bg-white/90 backdrop-blur-sm'>
      <div className='mx-auto max-w-4xl px-4 py-6'>
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='flex items-center gap-2 text-gray-500 text-sm'>
            <span className='font-semibold tracking-wide'>MarkDays</span>
            <span className='text-gray-300'>|</span>
            <a
              className='font-medium text-blue-600 underline underline-offset-2 transition hover:text-blue-800'
              href='https://cofus.work'
              target='_blank'
              rel='noreferrer noopener'
            >
              COFUS
            </a>
          </div>
          <p className='text-gray-400 text-xs'>
            © 2025 COFUS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
