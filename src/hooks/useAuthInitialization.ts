import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useInitializeAuthQuery } from "../store/api/authApi";
import { loginSuccess, logout } from "../store/slices/authSlice";

export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Handle hydration and token loading
  useEffect(() => {
    setIsHydrated(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const shouldSkip = !isHydrated || !token;

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
      // No token, dispatch logout to ensure clean state
      dispatch(logout());
      return;
    }

    if (!isLoading) {
      if (user && token) {
        // User is authenticated, dispatch loginSuccess
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
