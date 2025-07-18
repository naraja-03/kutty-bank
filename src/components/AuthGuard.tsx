'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  // Check if user is anonymous (guest) - only check user state, no localStorage
  const isAnonymous = user?.isAnonymous || false;

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated && !isAnonymous) {
        router.push('/welcome');
      } else if (!requireAuth && (isAuthenticated || isAnonymous)) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router, isAnonymous]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated && !isAnonymous) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
