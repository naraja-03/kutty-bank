'use client';

import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initializeAuth } from '../store/slices/authSlice';
import { WelcomeBackground } from './ui';
import AuthGuard from './AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();

  // Initialize auth on app startup
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const publicPaths = ['/welcome', '/'];
  const isPublicPage = publicPaths.includes(pathname);

  return (
    <>
      {isPublicPage ? (
        <WelcomeBackground>
          <div className="relative z-10 min-h-screen">{children}</div>
        </WelcomeBackground>
      ) : (
        <AuthGuard>
          <WelcomeBackground>
            <div className="relative z-10 min-h-screen">{children}</div>
          </WelcomeBackground>
        </AuthGuard>
      )}
    </>
  );
}
