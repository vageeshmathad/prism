import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, helperText, leftIcon, rightIcon, label, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="label-text block text-secondary-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-text">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full rounded-md border border-border bg-surface-subtle text-primary-text placeholder:text-muted-text',
              'text-xs font-mono py-2 transition-colors outline-none',
              'focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary',
              'disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed',
              leftIcon ? 'pl-8' : 'px-3',
              rightIcon ? 'pr-8' : 'px-3',
              error && 'border-danger focus:border-danger focus:ring-danger bg-danger-subtle/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-muted-text">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input'
