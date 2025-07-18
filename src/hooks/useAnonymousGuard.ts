'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';

export const useAnonymousGuard = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const isAnonymous = user?.isAnonymous || false;
  
  const requireAuth = (action: () => void, message?: string) => {
    if (isAnonymous) {
      // Show alert and redirect to sign in
      if (typeof window !== 'undefined') {
        const shouldSignIn = window.confirm(
          message || 'You need to sign in to save data. Would you like to sign in now?'
        );
        if (shouldSignIn) {
          router.push('/welcome');
        }
      }
      return false;
    }
    
    // User is authenticated, execute the action
    action();
    return true;
  };
  
  const showSignInPrompt = (message?: string) => {
    if (isAnonymous && typeof window !== 'undefined') {
      const shouldSignIn = window.confirm(
        message || 'You need to sign in to access this feature. Would you like to sign in now?'
      );
      if (shouldSignIn) {
        router.push('/welcome');
      }
    }
  };
  
  return {
    isAnonymous,
    requireAuth,
    showSignInPrompt,
  };
};
