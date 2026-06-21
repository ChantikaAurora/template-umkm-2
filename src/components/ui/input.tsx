import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
export { Input };
