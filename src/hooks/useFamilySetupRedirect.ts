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
    if (!isLoading && (isAuthenticated || isAnonymous)) {
      // Check if user needs family setup
      const needsFamilySetup = !user?.familyId;
      
      if (needsFamilySetup) {
        router.push('/family-setup');
      }
    }
  }, [isAuthenticated, isAnonymous, user?.familyId, isLoading, router]);

  return {
    needsFamilySetup: !user?.familyId && !isLoading,
    isLoading,
    user
  };
};
