import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 text-sm font-medium text-text-light dark:text-text-dark"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-text-muted-light dark:text-text-muted-dark">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clsx(
              'flex h-12 w-full rounded-lg border bg-background-light dark:bg-background-dark/50',
              'px-4 py-3 text-base text-text-light dark:text-text-dark',
              'placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-golden-honey/50 focus:border-golden-honey',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-danger focus:ring-danger/50'
                : 'border-border-light dark:border-border-dark',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-text-muted-light dark:text-text-muted-dark">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-danger flex items-center gap-1">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
