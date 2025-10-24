
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50',
          'disabled:pointer-events-none disabled:opacity-50',
          'cursor-pointer',
          {
            'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 shadow-md hover:shadow-lg': variant === 'default',
            'bg-zinc-800 text-gray-200 hover:bg-zinc-700 border border-white/10': variant === 'secondary',
            'border border-white/20 text-gray-200 hover:bg-white/5': variant === 'outline',
            'text-gray-300 hover:bg-white/5': variant === 'ghost',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };