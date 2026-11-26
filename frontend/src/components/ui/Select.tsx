import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={selectId} className="label-text block text-secondary-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none rounded-md border border-border bg-surface-subtle text-primary-text',
              'text-xs font-mono py-2 pl-3 pr-8 transition-colors outline-none cursor-pointer',
              'focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary',
              'disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed',
              error && 'border-danger focus:border-danger focus:ring-danger',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-muted-text">
            <ChevronDown size={14} />
          </div>
        </div>
        {error ? (
          <p className="text-[11px] text-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-muted-text">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Select.displayName = 'Select'
