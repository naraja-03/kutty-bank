'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'light' | 'dashboard' | 'activity' | 'family' | 'messages';
  withPattern?: boolean;
}

export default function GradientBackground({ 
  children, 
  className, 
  variant = 'default',
  withPattern = false 
}: GradientBackgroundProps) {
  const getBackgroundClasses = () => {
    switch (variant) {
      case 'dark':
        return 'bg-gradient-to-br from-black via-gray-950 to-black';
      case 'light':
        return 'bg-gradient-to-br from-gray-950 via-black to-gray-950';
      case 'dashboard':
        return 'bg-gradient-to-br from-black via-gray-950 to-black';
      case 'activity':
        return 'bg-gradient-to-br from-black via-gray-950 to-black';
      case 'family':
        return 'bg-gradient-to-br from-black via-gray-950 to-black';
      case 'messages':
        return 'bg-gradient-to-br from-black via-gray-950 to-black';
      default:
        return 'bg-gradient-to-br from-black via-gray-950 to-black';
    }
  };

  return (
    <div className={clsx(
      'min-h-screen relative',
      getBackgroundClasses(),
      className
    )}>
      {/* Optional Pattern Overlay */}
      {withPattern && (
        <div 
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      )}
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Orb */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
        
        {/* Bottom Left Orb */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/3 to-purple-500/3 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: '2s' }} />
        
        {/* Center Orb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/2 to-green-500/2 rounded-full blur-3xl animate-pulse"
             style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
