'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize authentication on component mount
  const { isInitializing } = useAuthInitialization();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run navigation logic after component is mounted and auth is not loading
    if (isMounted && !isLoading && !isInitializing) {
      if (requireAuth && !isAuthenticated) {
        router.push('/');
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, isInitializing, requireAuth, router, isMounted]);

  // Don't render anything until component is mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null;
  }

  // Show loading spinner while checking auth
  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if auth check fails
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
