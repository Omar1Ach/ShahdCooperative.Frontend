import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'default';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors';

    const variants = {
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      danger: 'bg-danger/10 text-danger border border-danger/20',
      info: 'bg-info/10 text-info border border-info/20',
      primary: 'bg-golden-honey/10 text-golden-honey border border-golden-honey/20',
      default:
        'bg-border-light dark:bg-border-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    const dotColor = {
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-danger',
      info: 'bg-info',
      primary: 'bg-golden-honey',
      default: 'bg-text-muted-light dark:bg-text-muted-dark',
    };

    return (
      <span ref={ref} className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
        {dot && <span className={clsx('size-2 rounded-full', dotColor[variant])} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
