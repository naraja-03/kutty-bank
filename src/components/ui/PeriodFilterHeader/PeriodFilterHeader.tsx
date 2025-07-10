'use client';

import { Calendar, Filter } from 'lucide-react';
import { PeriodFilterHeaderProps } from './types';

export default function PeriodFilterHeader({
  activeThread,
  className
}: PeriodFilterHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <Filter size={16} className="text-gray-400" />
        <span className="text-sm text-gray-400">Filtered by</span>
        <span className="text-sm font-medium text-white">{activeThread.label}</span>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        <Calendar size={12} />
        <span>
          {activeThread.startDate && activeThread.endDate
            ? `${activeThread.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${activeThread.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'Current Period'
          }
        </span>
      </div>
    </div>
  );
}
