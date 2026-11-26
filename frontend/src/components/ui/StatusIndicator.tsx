import React from 'react'
import { cn } from '@/lib/utils'

export type StatusType = 'online' | 'offline' | 'running' | 'passed' | 'warning' | 'failed' | 'pending'

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType
  label?: string
  variant?: 'dot' | 'pill'
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  className,
  status,
  label,
  variant = 'pill',
  ...props
}) => {
  const statusConfig: Record<StatusType, { label: string; dotColor: string; pillStyles: string }> = {
    online: {
      label: 'Online',
      dotColor: 'bg-emerald-500',
      pillStyles: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    offline: {
      label: 'Offline',
      dotColor: 'bg-slate-400',
      pillStyles: 'bg-slate-50 text-slate-600 border-slate-200',
    },
    running: {
      label: 'Running',
      dotColor: 'bg-blue-500 animate-pulse',
      pillStyles: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    passed: {
      label: 'Passed',
      dotColor: 'bg-emerald-500',
      pillStyles: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    warning: {
      label: 'Warning',
      dotColor: 'bg-amber-500',
      pillStyles: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    failed: {
      label: 'Failed',
      dotColor: 'bg-rose-500',
      pillStyles: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    pending: {
      label: 'Pending',
      dotColor: 'bg-slate-400',
      pillStyles: 'bg-slate-50 text-slate-600 border-slate-200',
    },
  }

  const current = statusConfig[status] || statusConfig.offline
  const displayLabel = label || current.label

  if (variant === 'dot') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-mono', className)} {...props}>
        <span className={cn('w-2 h-2 rounded-full shrink-0', current.dotColor)} aria-hidden="true" />
        <span className="text-secondary-text">{displayLabel}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase border select-none',
        current.pillStyles,
        className
      )}
      {...props}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', current.dotColor)} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  )
}

StatusIndicator.displayName = 'StatusIndicator'
