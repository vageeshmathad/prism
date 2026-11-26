import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-mono font-medium rounded border select-none leading-none'

  const variantStyles = {
    neutral: 'bg-surface-secondary text-secondary-text border-border',
    primary: 'bg-primary-subtle text-primary border-primary-border',
    success: 'bg-success-subtle text-success-text border-success-border',
    warning: 'bg-warning-subtle text-warning-text border-warning-border',
    error: 'bg-danger-subtle text-danger-text border-danger-border',
    info: 'bg-info-subtle text-info-text border-info-border',
  }

  const dotColors = {
    neutral: 'bg-slate-400',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-danger',
    info: 'bg-info',
  }

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
  }

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  )
}

Badge.displayName = 'Badge'
