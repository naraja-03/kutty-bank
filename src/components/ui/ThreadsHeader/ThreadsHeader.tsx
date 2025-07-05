'use client';

import { Menu, Plus, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { ThreadsHeaderProps } from './types';

export default function ThreadsHeader({
  title,
  onLeftAction,
  onRightAction,
  leftIcon: LeftIcon = Menu,
  rightIcon: RightIcon = Plus,
  activeThread,
  showThreadSelector = false,
  onThreadSelectorClick,
  className
}: ThreadsHeaderProps) {
  return (
    <header className={clsx(
      'sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-40',
      className
    )}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLeftAction}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Menu"
            >
              <LeftIcon size={20} className="text-white" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {showThreadSelector && activeThread && (
                <button
                  onClick={onThreadSelectorClick}
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span>{activeThread.label}</span>
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onRightAction}
              className="p-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-lg"
              aria-label="Add"
            >
              <RightIcon size={20} />
            </button>
          </div>
        </div>

        {/* Thread Info Bar */}
        {showThreadSelector && activeThread && (
          <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Current Period:</span>
              <span className="text-white font-medium">{activeThread.label}</span>
            </div>
            {activeThread.startDate && activeThread.endDate && (
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Range:</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
