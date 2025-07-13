'use client';

import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '../store';
import AuthGuard from './AuthGuard';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentUser = useTypedSelector(state => state.auth.user);

  console.log("currentUsercurrentUser", currentUser);


  const publicPaths = ['/login', '/register'];
  const isPublicPage = publicPaths.includes(pathname);


  return (
    <>
      {isPublicPage ? (
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      ) : (
        <AuthGuard>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </AuthGuard>
      )}
    </>
  );
}