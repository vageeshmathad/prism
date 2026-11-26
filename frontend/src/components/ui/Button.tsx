import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none rounded-md focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1 disabled:opacity-50 disabled:pointer-events-none'

    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-primary-hover shadow-2xs active:bg-primary-dark',
      secondary:
        'bg-surface-secondary text-primary-text hover:bg-slate-200 border border-border active:bg-slate-300',
      outline:
        'bg-surface text-primary-text border border-border hover:bg-surface-subtle hover:border-slate-300 shadow-2xs',
      ghost:
        'text-secondary-text hover:text-primary-text hover:bg-surface-secondary',
      danger:
        'bg-danger text-white hover:bg-danger-hover shadow-2xs active:bg-red-800',
    }

    const sizeStyles = {
      sm: 'h-7 px-2.5 text-xs gap-1.5',
      md: 'h-8 px-3.5 text-xs gap-1.5 font-semibold',
      lg: 'h-9 px-4 text-sm gap-2 font-semibold',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
