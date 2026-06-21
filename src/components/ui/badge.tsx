import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default:     'bg-violet-600 text-white border-transparent',
  secondary:   'bg-slate-100 text-slate-700 border-slate-200',
  destructive: 'bg-red-100 text-red-700 border-red-200',
  success:     'bg-green-100 text-green-700 border-green-200',
  warning:     'bg-amber-100 text-amber-700 border-amber-200',
  outline:     'text-slate-600 border-slate-200 bg-white',
  violet:      'bg-violet-100 text-violet-700 border-violet-200',
  navy:        'bg-[#080B14] text-white border-transparent',
  green:       'bg-green-600 text-white border-transparent',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
