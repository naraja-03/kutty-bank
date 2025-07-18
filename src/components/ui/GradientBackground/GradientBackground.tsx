'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: string; // Simplified to just accept any string
}

export default function GradientBackground({
  children,
  className,
}: GradientBackgroundProps) {
  return (
    <div className={clsx('min-h-screen bg-black', className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
