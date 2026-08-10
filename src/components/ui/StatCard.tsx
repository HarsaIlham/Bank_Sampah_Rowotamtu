import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  colorBg?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorBg = 'bg-pink-100 text-[#EC4899]',
  className
}) => {
  return (
    <Card className={cn('relative overflow-hidden hover-lift border-pink-100/90', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {trend && (
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
              {trend}
            </span>
          )}
        </div>
        <div className={cn('p-3 rounded-xl shrink-0', colorBg)}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
