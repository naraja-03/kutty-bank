'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  progress: number;
}

export default function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  isPulling,
  progress
}: PullToRefreshIndicatorProps) {
  const shouldShow = isPulling || isRefreshing;
  const isReady = progress >= 1;

  if (!shouldShow) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ 
        transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
        opacity: Math.min(progress * 2, 1)
      }}
    >
      <div className="bg-black/80 backdrop-blur-md rounded-full p-3 mt-4 border border-white/20 shadow-lg">
        <RotateCcw 
          size={20} 
          className={clsx(
            'text-white transition-all duration-200',
            {
              'animate-spin': isRefreshing,
              'text-green-400': isReady && !isRefreshing,
              'text-gray-400': !isReady && !isRefreshing
            }
          )}
          style={{
            transform: isRefreshing ? 'none' : `rotate(${progress * 180}deg)`
          }}
        />
      </div>
    </div>
  );
}
