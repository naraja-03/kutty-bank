'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';
import { RootState } from '@/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [router, isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated logo */}
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative w-32 h-32 animate-float">
          {/* Main logo */}
          <div className="w-full h-full relative">
            <Image 
              src="/logo without bg.png" 
              alt="Rightrack Logo" 
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
          
          {/* Shining effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine-custom"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-gray-400 text-lg animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
