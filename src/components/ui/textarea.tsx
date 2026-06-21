import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
export { Textarea };
