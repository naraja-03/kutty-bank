'use client';

import { ReactNode } from 'react';
import { useSafeArea } from '../hooks/useSafeArea';

interface SafeAreaProviderProps {
  children: ReactNode;
  className?: string;
}

export default function SafeAreaProvider({ children, className = '' }: SafeAreaProviderProps) {
  const safeArea = useSafeArea();
  
  return (
    <div 
      className={`${className}`}
      style={{
        paddingTop: `max(${safeArea.top}px, env(safe-area-inset-top, 0px))`,
        paddingLeft: `max(${safeArea.left}px, env(safe-area-inset-left, 0px))`,
        paddingRight: `max(${safeArea.right}px, env(safe-area-inset-right, 0px))`,
        // Don't add bottom padding here as it will interfere with bottom nav
      }}
    >
      {children}
    </div>
  );
}
