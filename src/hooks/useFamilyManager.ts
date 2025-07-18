import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentFamily, updateUser } from '../store/slices/authSlice';
import { useGetFamiliesQuery } from '../store/api/familyApi';
import { Family } from '../store/api/familyApi';

interface FamilyManagerResult {
  currentFamily: string | null;
  family: Family | null;
  isLoading: boolean;
  error: unknown;
  hasFamily: boolean;
  needsFamilyCreation: boolean;
}

export function useFamilyManager(): FamilyManagerResult {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: families = [],
    isLoading,
    error,
  } = useGetFamiliesQuery(user?.id, {
    skip: !user?.id,
  });

  // For single family approach: user should have exactly one family
  const family = families.length > 0 ? families[0] : null;
  const hasFamily = Boolean(family);
  const needsFamilyCreation = !hasFamily && !isLoading;

  // Auto-assign the user's only family
  useEffect(() => {
    if (family && (!user?.familyId || user.familyId !== family.id)) {
      dispatch(setCurrentFamily(family.id));
      dispatch(updateUser({ familyId: family.id }));
    }
  }, [family, user?.familyId, dispatch]);

  return {
    currentFamily: family?.id || null,
    family,
    isLoading,
    error,
    hasFamily,
    needsFamilyCreation,
  };
}
