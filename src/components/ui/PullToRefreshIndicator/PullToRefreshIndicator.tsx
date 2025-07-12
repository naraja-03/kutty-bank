import React from 'react';
import { RotateCw } from 'lucide-react';
import { clsx } from 'clsx';

interface PullToRefreshIndicatorProps {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export default function PullToRefreshIndicator({
  isPulling,
  pullDistance,
  isRefreshing,
  threshold,
}: PullToRefreshIndicatorProps) {
  if (!isPulling && !isRefreshing) {
    return null;
  }

  const progress = Math.min(pullDistance / threshold, 1);
  const isReady = progress >= 1;
  
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-200"
      style={{
        height: `${Math.max(pullDistance, isRefreshing ? 80 : 0)}px`,
        opacity: isPulling || isRefreshing ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-center space-y-2 text-white">
        <div
          className={clsx(
            'p-3 rounded-full transition-all duration-200',
            isReady || isRefreshing
              ? 'bg-green-500/20 border-2 border-green-400'
              : 'bg-white/10 border-2 border-white/30'
          )}
        >
          <RotateCw
            size={24}
            className={clsx(
              'transition-all duration-200',
              isRefreshing && 'animate-spin',
              isReady ? 'text-green-400' : 'text-white',
              !isRefreshing && `rotate-[${progress * 360}deg]`
            )}
            style={{
              transform: !isRefreshing ? `rotate(${progress * 360}deg)` : undefined,
            }}
          />
        </div>
        
        <div className="text-center">
          <p
            className={clsx(
              'text-sm font-medium transition-colors duration-200',
              isReady ? 'text-green-400' : 'text-white'
            )}
          >
            {isRefreshing
              ? 'Refreshing...'
              : isReady
              ? 'Release to refresh'
              : 'Pull to refresh'
            }
          </p>
          
          {/* Progress indicator */}
          <div className="w-16 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-200 rounded-full',
                isReady ? 'bg-green-400' : 'bg-white'
              )}
              style={{
                width: `${Math.min(progress * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}