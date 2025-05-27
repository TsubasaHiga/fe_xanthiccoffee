import { cloneElement, forwardRef, isValidElement } from 'react'
import type { ReactElement } from 'react'

interface ContentLayoutProps {
  children: ReactElement
}

export const ContentLayout = forwardRef<HTMLElement, ContentLayoutProps>(
  ({ children }, ref) => (
    <main
      ref={ref}
      className='w-full max-w-md sm:max-w-xl md:max-w-2xl md:rounded-2xl'
    >
      {isValidElement(children) && typeof children.type !== 'string'
        ? // @ts-expect-error: ref prop is not in type definition but is valid for forwardRef components
          cloneElement(children, { ref })
        : children}
    </main>
  )
)
