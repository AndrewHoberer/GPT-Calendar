
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true, className }) => {
  const iconSize = {
    sm: 20,
    md: 24,
    lg: 32,
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Calendar 
          size={iconSize} 
          className="text-primary relative z-10" 
        />
        <div className="absolute top-0 left-0 w-full h-full bg-primary opacity-10 blur-md rounded-full animate-pulse-soft" />
      </div>
      {withText && (
        <span className={cn('font-medium', textSize)}>
          Smart<span className="text-primary font-semibold">Calendar</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
