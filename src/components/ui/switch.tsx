import { cn } from '@/lib/utils'
import { Switch as PrimitiveSwitch } from '@radix-ui/react-switch'
import * as React from 'react'

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof PrimitiveSwitch> {}

export const Switch = React.forwardRef<
  React.ElementRef<typeof PrimitiveSwitch>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <PrimitiveSwitch
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600',
      className
    )}
    {...props}
  >
    <span
      className={cn(
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </PrimitiveSwitch>
))
Switch.displayName = 'Switch'
