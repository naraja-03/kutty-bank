import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useInitializeAuthQuery } from "../store/api/authApi";
import { loginSuccess, logout } from "../store/slices/authSlice";

export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Get token directly to avoid async timing issues
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  // Only need isHydrated for SSR safety
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const shouldSkip = !isHydrated;

  const {
    data: user,
    isLoading,
    error,
  } = useInitializeAuthQuery(undefined, {
    skip: shouldSkip,
  });

  useEffect(() => {
    if (!isHydrated) return;

    // No token case - clear state
    if (!token) {
      dispatch(logout());
      return;
    }

    // Only take action when loading is complete
    if (!isLoading) {
      if (error) {
        // Only logout on actual auth errors, not network errors
        const status = (error as FetchBaseQueryError)?.status;
        if (status === 401 || status === 403) {
          dispatch(logout());
        }
        return;
      }

      if (user) {
        // Valid user data, ensure Redux state is updated
        dispatch(loginSuccess({ user, token }));
      }
    }
  }, [user, isLoading, error, dispatch, token, isHydrated]);

  return {
    isInitializing: !isHydrated || isLoading,
    isAuthenticated: !!user,
    user,
  };
};
