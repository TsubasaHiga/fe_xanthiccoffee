import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className='grid min-h-screen grid-rows-[1fr_auto] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'>
      {children}
    </div>
  )
}
