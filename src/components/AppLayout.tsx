'use client';

import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initializeAuth } from '../store/slices/authSlice';
import { WelcomeBackground } from './ui';
import AuthGuard from './AuthGuard';
import BottomNav from './navigation/BottomNav';
import SideNav from './navigation/SideNav';
import { useTheme } from '@/contexts/ThemeContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { theme } = useTheme();

  // Initialize auth on app startup
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const publicPaths = ['/welcome', '/'];
  const isPublicPage = publicPaths.includes(pathname);
  
  // Pages that should not have navigation
  const noNavPages = ['/welcome', '/', '/family-setup'];
  const shouldShowNav = !noNavPages.some(page => pathname?.startsWith(page));

  return (
    <>
      {isPublicPage ? (
        <WelcomeBackground>
          <div className="relative z-10 min-h-screen">{children}</div>
        </WelcomeBackground>
      ) : (
        <AuthGuard>
          {shouldShowNav ? (
            <div className={`min-h-screen flex ${
              theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
            }`}>
              {/* Desktop Sidebar */}
              <SideNav />
              
              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-auto">
                  <div className="pb-20 lg:pb-0">
                    {children}
                  </div>
                </main>
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="lg:hidden">
                <BottomNav />
              </div>
            </div>
          ) : (
            <WelcomeBackground>
              <div className="relative z-10 min-h-screen">{children}</div>
            </WelcomeBackground>
          )}
        </AuthGuard>
      )}
    </>
  );
}
