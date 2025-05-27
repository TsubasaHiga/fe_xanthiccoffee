import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className='mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-2 md:px-4'>
      {children}
    </main>
  )
}
