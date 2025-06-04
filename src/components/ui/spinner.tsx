import { Loader2 } from 'lucide-react'

export function Spinner({
  className = '',
  size = 20
}: { className?: string; size?: number }) {
  return (
    <Loader2
      className={`animate-spin text-white ${className}`}
      size={size}
      strokeWidth={2.5}
      aria-hidden='true'
    />
  )
}
