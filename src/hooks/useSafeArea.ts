'use client';

import { useEffect, useState } from 'react';

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const useSafeArea = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const updateSafeArea = () => {
      if (typeof window !== 'undefined' && CSS.supports('padding-top: env(safe-area-inset-top)')) {
        const computedStyle = getComputedStyle(document.documentElement);
        
        setSafeAreaInsets({
          top: parseInt(computedStyle.getPropertyValue('--sat').replace('px', '')) || 0,
          right: parseInt(computedStyle.getPropertyValue('--sar').replace('px', '')) || 0,
          bottom: parseInt(computedStyle.getPropertyValue('--sab').replace('px', '')) || 0,
          left: parseInt(computedStyle.getPropertyValue('--sal').replace('px', '')) || 0,
        });
      }
    };

    updateSafeArea();
    
    // Update on resize/orientation change
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);
    
    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeAreaInsets;
};
