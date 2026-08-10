import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'pink' | 'secondary' | 'amber' | 'emerald' | 'slate' | 'rose' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'pink',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    secondary: 'bg-[#FBCFE8] text-pink-900 border-pink-300 font-semibold',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    outline: 'bg-white text-slate-600 border-slate-200 border'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs font-medium'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-transparent font-medium tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
