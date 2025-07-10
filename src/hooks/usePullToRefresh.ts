'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const touchStartY = useRef<number | null>(null);
  const scrollElement = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    if (!enabled || isRefreshing) return;
    
    const element = scrollElement.current || document.documentElement;
    const isAtTop = element.scrollTop === 0;
    
    if (isAtTop) {
      touchStartY.current = touchEvent.touches[0].clientY;
    }
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    if (!enabled || isRefreshing || touchStartY.current === null) return;
    
    const currentY = touchEvent.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    
    if (deltaY > 0) {
      e.preventDefault();
      const distance = Math.min(deltaY / resistance, threshold * 1.5);
      setPullDistance(distance);
      setIsPulling(true);
    }
  }, [enabled, isRefreshing, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || isRefreshing || !isPulling) return;
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setIsPulling(false);
    touchStartY.current = null;
  }, [enabled, isRefreshing, isPulling, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    const element = scrollElement.current || document;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  const setScrollElement = useCallback((element: HTMLElement | null) => {
    scrollElement.current = element;
  }, []);

  return {
    isRefreshing,
    pullDistance,
    isPulling,
    setScrollElement,
    progress: Math.min(pullDistance / threshold, 1)
  };
};
