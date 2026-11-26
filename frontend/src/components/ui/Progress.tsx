import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 to 100
  max?: number
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  label?: string
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  label,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const heightStyles = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  }

  const barColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }

  // Automatic variant depending on score if primary requested
  const resolvedColor =
    variant === 'primary' && percentage !== undefined
      ? percentage >= 80
        ? 'bg-success'
        : percentage >= 65
        ? 'bg-warning'
        : 'bg-danger'
      : barColors[variant]

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="text-secondary-text">{label}</span>}
          {showValue && <span className="font-semibold text-primary-text">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', heightStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-out', resolvedColor)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

Progress.displayName = 'Progress'
