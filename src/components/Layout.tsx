import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className='grid min-h-screen grid-rows-[1fr_auto] bg-gray-50'>
      {children}
    </div>
  )
}
