export const Footer = () => {
  return (
    <footer className='mt-auto border-t bg-white py-8'>
      <div className='mx-auto max-w-4xl px-4'>
        <div className='text-center text-gray-600 text-sm'>
          <p>
            Copyright{' '}
            <a
              className='underline hover:no-underline'
              href='https://cofus.work'
              target='_blank'
              rel='noreferrer noopener'
            >
              COFUS
            </a>{' '}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
