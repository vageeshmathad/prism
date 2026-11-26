import React from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  className,
  title,
  description,
  icon,
  badge,
  actions,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-2.5', className)}
      {...props}
    >
      <div>
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary shrink-0">{icon}</span>}
          <h2 className="section-heading">{title}</h2>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="secondary-text font-mono text-muted-text mt-0.5">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">{actions}</div>}
    </div>
  )
}

SectionHeader.displayName = 'SectionHeader'
