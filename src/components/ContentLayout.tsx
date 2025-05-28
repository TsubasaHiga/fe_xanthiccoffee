import { cloneElement, forwardRef, isValidElement } from 'react'
import type { ReactElement } from 'react'
import { cn } from '../lib/utils'

interface ContentLayoutProps {
  children: ReactElement
  className?: string
}

export const ContentLayout = forwardRef<HTMLDivElement, ContentLayoutProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-md sm:max-w-xl md:max-w-3xl md:rounded-2xl',
        className
      )}
    >
      {isValidElement(children) && typeof children.type !== 'string'
        ? // @ts-expect-error: ref prop is not in type definition but is valid for forwardRef components
          cloneElement(children, { ref })
        : children}
    </div>
  )
)
