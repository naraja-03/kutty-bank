import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useInitializeAuthQuery } from "../store/api/authApi";
import { loginSuccess, logout } from "../store/slices/authSlice";

export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

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

    if (!token) {
      dispatch(logout());
      return;
    }

    if (!isLoading) {
      if (error) {
        const status = (error as FetchBaseQueryError)?.status;
        if (status === 401 || status === 403) {
          dispatch(logout());
        }
        return;
      }

      if (user) {
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
