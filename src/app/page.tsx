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
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-20 h-20 animate-float">
          <div className="w-full h-full relative">
            <Image
              src="/icon-glass.svg"
              alt="Rightrack Logo"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine-custom"></div>
        </div>

        <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
