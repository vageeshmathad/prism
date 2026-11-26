import React from 'react'
import { cn } from '@/lib/utils'

export interface MetricDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  subtext?: string
  delta?: string
  grade?: 'A' | 'B' | 'C' | 'D'
  context?: string
  icon?: React.ReactNode
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  className,
  label,
  value,
  subtext,
  delta,
  grade,
  context,
  icon,
  ...props
}) => {
  const gradeClasses = {
    A: 'sonar-badge-a',
    B: 'sonar-badge-b',
    C: 'sonar-badge-c',
    D: 'sonar-badge-c',
  }

  return (
    <div
      className={cn(
        'p-3 sm:p-3.5 rounded-lg bg-surface border border-border shadow-subtle flex flex-col justify-between space-y-2',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="label-text block">{label}</span>
        {icon && <span className="text-secondary-text shrink-0">{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-primary-text">
            {value}
          </span>
          {subtext && <span className="secondary-text font-mono">{subtext}</span>}
        </div>

        {grade && (
          <span className={cn('sonar-badge w-6 h-6 text-xs', gradeClasses[grade])}>
            {grade}
          </span>
        )}
      </div>

      {(delta || context) && (
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-text pt-1 border-t border-border-subtle">
          {delta && <span className="font-medium text-secondary-text">{delta}</span>}
          {context && <span>{context}</span>}
        </div>
      )}
    </div>
  )
}

MetricDisplay.displayName = 'MetricDisplay'
