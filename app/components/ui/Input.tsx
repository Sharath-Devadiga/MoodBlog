import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2',
          'text-sm text-gray-200 placeholder:text-gray-500',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50',
          'focus-visible:border-orange-500/50 disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200',
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };