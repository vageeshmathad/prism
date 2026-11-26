import React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  badge?: React.ReactNode
  breadcrumb?: React.ReactNode
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  className,
  title,
  description,
  badge,
  breadcrumb,
  actions,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {breadcrumb && <div className="mb-1 text-xs">{breadcrumb}</div>}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="page-title">{title}</h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="secondary-text font-mono text-secondary-text mt-0.5">{description}</p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">{actions}</div>}
    </div>
  )
}

PageHeader.displayName = 'PageHeader'
