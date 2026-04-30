'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className, showLabel = true }: ProgressBarProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <Progress value={value} className="h-1.5" />
      {showLabel && (
        <p className="text-xs text-muted-foreground text-right">{Math.round(value)}%</p>
      )}
    </div>
  )
}
