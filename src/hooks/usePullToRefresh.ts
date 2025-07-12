import { useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    // Only start if we're at the top of the page
    if (window.scrollY > 0) return;
    
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled || isRefreshing || startY === 0) return;
    
    // Only allow pull if we're at the top of the page
    if (window.scrollY > 0) return;
    
    const newCurrentY = e.touches[0].clientY;
    const diff = newCurrentY - startY;
    
    // Only track downward movement
    if (diff > 0) {
      // Apply resistance to make it feel more natural
      const distance = Math.min(diff / resistance, threshold * 1.5);
      
      setPullDistance(distance);
      setCurrentY(newCurrentY);
      
      if (!isPulling && distance > 10) {
        setIsPulling(true);
      }
      
      // Prevent default scrolling when pulling
      e.preventDefault();
    }
  }, [enabled, isRefreshing, startY, threshold, resistance, isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || isRefreshing || startY === 0) return;
    
    const shouldRefresh = pullDistance >= threshold;
    
    if (shouldRefresh && isPulling) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error during pull to refresh:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    // Reset all states
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
    setCurrentY(0);
  }, [enabled, isRefreshing, startY, pullDistance, threshold, isPulling, onRefresh]);

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}