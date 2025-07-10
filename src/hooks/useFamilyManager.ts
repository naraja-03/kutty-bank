import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentFamily, updateUser } from '../store/slices/authSlice';
import { useGetFamiliesQuery } from '../store/api/familyApi';
import { Family } from '../store/api/familyApi';

interface FamilyManagerResult {
  currentFamily: string | null;
  families: Family[];
  isLoading: boolean;
  error: unknown;
  hasValidFamily: boolean;
  needsFamilySelection: boolean;
  switchToValidFamily: () => void;
  clearInvalidFamily: () => void;
}

export function useFamilyManager(): FamilyManagerResult {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { 
    data: families = [], 
    isLoading, 
    error 
  } = useGetFamiliesQuery(user?.id, {
    skip: !user?.id
  });

  const currentFamilyId = user?.familyId;
  
  const hasValidFamily = Boolean(currentFamilyId && families.some(family => family.id === currentFamilyId));
  
  const needsFamilySelection = !hasValidFamily && !isLoading;

  const switchToValidFamily = useCallback(() => {
    if (families.length > 0 && !hasValidFamily) {
      const firstValidFamily = families[0];
      dispatch(setCurrentFamily(firstValidFamily.id));
      dispatch(updateUser({ familyId: firstValidFamily.id }));
    }
  }, [families, hasValidFamily, dispatch]);

  const clearInvalidFamily = useCallback(() => {
    if (currentFamilyId && !hasValidFamily) {
      dispatch(updateUser({ familyId: undefined, role: undefined }));
    }
  }, [currentFamilyId, hasValidFamily, dispatch]);

  useEffect(() => {
    if (!isLoading && families.length > 0 && currentFamilyId) {
      const familyExists = families.some(family => family.id === currentFamilyId);
      if (!familyExists) {
        clearInvalidFamily();
      }
    }
  }, [families, currentFamilyId, isLoading, clearInvalidFamily]);

  return {
    currentFamily: hasValidFamily ? currentFamilyId || null : null,
    families,
    isLoading,
    error,
    hasValidFamily,
    needsFamilySelection,
    switchToValidFamily,
    clearInvalidFamily
  };
}
