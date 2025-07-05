'use client';

import { Calendar, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { ThreadPeriod, DEFAULT_THREADS } from './types';

interface ThreadSelectorProps {
  activeThread: ThreadPeriod;
  onThreadChange: (thread: ThreadPeriod) => void;
  className?: string;
}

export default function ThreadSelector({
  activeThread,
  onThreadChange,
  className
}: ThreadSelectorProps) {
  const getDateRange = (thread: ThreadPeriod) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (thread.value) {
      case 'week':
        return {
          start: startOfWeek,
          end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        };
      case 'month':
        return {
          start: startOfMonth,
          end: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0)
        };
      case 'quarter':
        return {
          start: startOfQuarter,
          end: new Date(startOfQuarter.getFullYear(), startOfQuarter.getMonth() + 3, 0)
        };
      case 'year':
        return {
          start: startOfYear,
          end: new Date(startOfYear.getFullYear() + 1, 0, 0)
        };
      default:
        return {
          start: thread.startDate || new Date(),
          end: thread.endDate || new Date()
        };
    }
  };

  const formatDateRange = (thread: ThreadPeriod) => {
    const { start, end } = getDateRange(thread);
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className={clsx('bg-gray-900 border border-gray-800 rounded-xl p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-gray-400" />
          <h3 className="font-semibold text-white">Time Period</h3>
        </div>
        <span className="text-xs text-gray-400">
          {formatDateRange(activeThread)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DEFAULT_THREADS.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onThreadChange(thread)}
            className={clsx(
              'p-3 rounded-lg text-sm font-medium transition-colors text-left',
              activeThread.id === thread.id
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            )}
          >
            <div className="flex items-center space-x-2">
              <span>{thread.label}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onThreadChange({
          id: 'custom',
          label: 'Custom Range',
          value: 'custom'
        })}
        className={clsx(
          'w-full mt-2 p-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2',
          activeThread.value === 'custom'
            ? 'bg-white text-black'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        )}
      >
        <Calendar size={16} />
        <span>Custom Range</span>
      </button>
    </div>
  );
}
