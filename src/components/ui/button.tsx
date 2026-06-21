'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default:     'bg-violet-600 text-white hover:bg-violet-700 shadow-sm',
  secondary:   'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline:     'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  ghost:       'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  link:        'text-violet-600 underline-offset-4 hover:underline p-0 h-auto',
  success:     'bg-green-600 text-white hover:bg-green-700',
  navy:        'bg-[#080B14] text-white hover:bg-slate-900',
  whatsapp:    'bg-green-500 text-white hover:bg-green-600',
  gradient:    'bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 shadow-sm',
};

const sizeVariants = {
  sm:      'h-8 px-3 text-xs rounded-lg',
  default: 'h-10 px-4 text-sm rounded-xl',
  lg:      'h-11 px-6 text-base rounded-xl',
  xl:      'h-12 px-8 text-base rounded-xl font-semibold',
  icon:    'h-9 w-9 rounded-lg',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizeVariants;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button };
