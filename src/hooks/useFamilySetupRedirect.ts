'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useFamilySetupRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const isAnonymous = user?.isAnonymous || false;

  useEffect(() => {
    console.log('useFamilySetupRedirect - Auth state:', {
      isAuthenticated,
      isAnonymous,
      isLoading,
      user: user ? {
        id: user.id,
        name: user.name,
        familyId: user.familyId,
        isAnonymous: user.isAnonymous
      } : null
    });

    // Add a small delay to ensure auth state is fully updated
    const timeoutId = setTimeout(() => {
      if (!isLoading && (isAuthenticated || isAnonymous)) {
        const needsFamilySetup = !user?.familyId;
        
        console.log('useFamilySetupRedirect - Checking redirect:', {
          needsFamilySetup,
          userFamilyId: user?.familyId
        });
        
        if (needsFamilySetup) {
          console.log('useFamilySetupRedirect - Redirecting to /family-setup');
          router.push('/family-setup');
        } else {
          console.log('useFamilySetupRedirect - User has familyId, redirecting to /dashboard');
          router.push('/dashboard');
        }
      }
    }, 100); // Small delay to ensure state is updated

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isAnonymous, user, isLoading, router]);

  return {
    needsFamilySetup: !user?.familyId && !isLoading,
    isLoading,
    user
  };
};
