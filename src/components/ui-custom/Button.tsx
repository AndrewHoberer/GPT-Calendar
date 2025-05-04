// written by: Ammar Akif
// debugged by: Ammar Akif
// tested by: Hussnain Yasir 
import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading = false, fullWidth = false, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const content = isLoading ? (
      <>
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Loading</span>
        </span>
        <span className="opacity-0">{children}</span>
      </>
    ) : children;
    
    return (
      <Comp
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none overflow-hidden',
          
          // Variant styles
          variant === 'default' && 'bg-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/20 active:translate-y-[1px]',
          variant === 'outline' && 'border border-border bg-transparent hover:bg-secondary text-foreground active:translate-y-[1px]',
          variant === 'ghost' && 'bg-transparent hover:bg-secondary text-foreground active:translate-y-[1px]',
          variant === 'link' && 'bg-transparent text-primary underline-offset-4 hover:underline',
          variant === 'subtle' && 'bg-secondary text-foreground hover:bg-secondary/80 active:translate-y-[1px]',
          
          // Size styles
          size === 'sm' && 'text-xs px-3 py-1.5 h-8',
          size === 'md' && 'text-sm px-4 py-2 h-10',
          size === 'lg' && 'text-base px-6 py-3 h-12',
          
          // Width styles
          fullWidth && 'w-full',
          
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export default Button;
