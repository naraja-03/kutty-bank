'use client';

import { Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { ThreadBottomBarProps, ThreadPeriod } from './types';

const QUICK_THREADS: ThreadPeriod[] = [
  {
    id: 'this-week',
    label: 'This Week',
    value: 'week'
  },
  {
    id: 'this-month',
    label: 'This Month',
    value: 'month'
  },
  {
    id: 'this-quarter',
    label: 'Quarter',
    value: 'quarter'
  },
  {
    id: 'this-year',
    label: 'This Year',
    value: 'year'
  }
];

export default function ThreadBottomBar({
  activeThread,
  onThreadChange,
  onCustomThread,
  onPrevious,
  onNext,
  className
}: ThreadBottomBarProps) {
  const getThreadIcon = (thread: ThreadPeriod) => {
    switch (thread.value) {
      case 'week':
        return '📅';
      case 'month':
        return '📆';
      case 'quarter':
        return '📊';
      case 'year':
        return '🗓️';
      case 'custom':
        return '⚡';
      default:
        return '⏰';
    }
  };

  const getThreadColor = (thread: ThreadPeriod) => {
    switch (thread.value) {
      case 'week':
        return 'bg-blue-500';
      case 'month':
        return 'bg-green-500';
      case 'quarter':
        return 'bg-purple-500';
      case 'year':
        return 'bg-orange-500';
      case 'custom':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDateRange = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return 'Current Period';
    
    const start = format(startDate, 'MMM dd');
    const end = format(endDate, 'MMM dd');
    
    return `${start} - ${end}`;
  };

  const scrollToThread = (threadId: string) => {
    const element = document.getElementById(`thread-${threadId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  return (
    <div className={clsx(
      'fixed bottom-20 left-0 right-0 bg-black/95 backdrop-blur-md z-30',
      className
    )}>
      {/* Main Thread Bar */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
          )}

          {/* Thread Selector */}
          <div className="flex-1 mx-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {QUICK_THREADS.map((thread) => {
                const isActive = activeThread.id === thread.id || activeThread.value === thread.value;
                
                return (
                  <button
                    key={thread.id}
                    onClick={() => onThreadChange(thread)}
                    className={clsx(
                      'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center space-x-1.5',
                      isActive
                        ? 'bg-white text-black shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <span className="text-sm">{getThreadIcon(thread)}</span>
                    <span className="whitespace-nowrap">{thread.label}</span>
                  </button>
                );
              })}
              
              {/* Custom Thread Button */}
              <button
                onClick={onCustomThread}
                className={clsx(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 border border-dashed',
                  activeThread.value === 'custom'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg scale-105'
                    : 'bg-transparent text-purple-400 border-purple-600 hover:bg-purple-600 hover:text-white'
                )}
              >
                <Sparkles size={12} />
                <span className="whitespace-nowrap">Custom</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          {onNext && (
            <button
              onClick={onNext}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Thread Info Bar */}
      <div className="px-4 py-2 bg-gray-900/95/50 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={clsx(
              'w-2 h-2 rounded-full',
              getThreadColor(activeThread)
            )} />
            <span className="text-sm font-medium text-white">
              {activeThread.label}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{formatDateRange(activeThread.startDate, activeThread.endDate)}</span>
          </div>
        </div>
      </div>

      {/* Thread Indicators */}
      <div className="flex justify-center py-2">
        <div className="flex space-x-1">
          {QUICK_THREADS.map((thread) => {
            const isActive = activeThread.id === thread.id || activeThread.value === thread.value;
            return (
              <button
                key={`indicator-${thread.id}`}
                onClick={() => {
                  onThreadChange(thread);
                  scrollToThread(thread.id);
                }}
                className={clsx(
                  'w-1.5 h-1.5 rounded-full transition-all duration-200',
                  isActive ? 'bg-white scale-125' : 'bg-gray-600 hover:bg-gray-500'
                )}
              />
            );
          })}
          <button
            onClick={onCustomThread}
            className={clsx(
              'w-1.5 h-1.5 rounded-full transition-all duration-200',
              activeThread.value === 'custom' ? 'bg-purple-400 scale-125' : 'bg-gray-600 hover:bg-purple-500'
            )}
          />
        </div>
      </div>
    </div>
  );
}
