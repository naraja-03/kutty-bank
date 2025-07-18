'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';

interface UseAuthenticatedAPIOptions {
  redirectTo?: string;
  allowAnonymous?: boolean;
  skipRedirect?: boolean;
}

export function useAuthenticatedAPI(options: UseAuthenticatedAPIOptions = {}) {
  const {
    redirectTo = '/welcome',
    allowAnonymous = true,
    skipRedirect = false
  } = options;

  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const shouldRedirect = !skipRedirect && (
    !isAuthenticated || 
    (!allowAnonymous && user?.isAnonymous)
  );

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [shouldRedirect, router, redirectTo]);

  return {
    isAuthenticated,
    user,
    isAnonymous: user?.isAnonymous || false,
    canMakeAPICall: isAuthenticated && (allowAnonymous || !user?.isAnonymous),
    shouldRedirect
  };
}

export default useAuthenticatedAPI;
