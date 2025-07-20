'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi';
import { setAnonymousUser, loginSuccess } from '@/store/slices/authSlice';
import { useFamilySetupRedirect } from '@/hooks/useFamilySetupRedirect';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  WelcomeBackground, 
  WelcomeHero, 
  WelcomeMobileHeader, 
  AuthForm, 
  FullPageLoading,
  Button,
  type AuthFormData 
} from '@/components/ui';

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // Use the family setup redirect hook for automatic routing
  useFamilySetupRedirect();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading screen while mounting
  if (!mounted) {
    return <FullPageLoading message="Initializing..." />;
  }

  const handleContinueAnonymously = () => {
    setIsAnonymousLoading(true);
    dispatch(setAnonymousUser());
    setTimeout(() => {
      setIsAnonymousLoading(false);
      // The useFamilySetupRedirect hook will automatically redirect to family-setup
      // since anonymous users don't have a familyId
    }, 1000);
  };

  const handleAuthSubmit = async (data: AuthFormData) => {
    setError('');

    if (!data.email || !data.password || (!data.isLogin && !data.name)) {
      setError('Please fill in all fields');
      return;
    }

    if (!data.isLogin && data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (data.isLogin) {
        const result = await login({
          email: data.email,
          password: data.password,
        }).unwrap();

        if (result.token && result.user) {
          dispatch(loginSuccess({ token: result.token, user: result.user }));
          // The useFamilySetupRedirect hook will handle routing based on user's familyId
        }
      } else {
        const result = await register({
          name: data.name!,
          email: data.email,
          password: data.password,
        }).unwrap();

        if (result.token && result.user) {
          dispatch(loginSuccess({ token: result.token, user: result.user }));
          // The useFamilySetupRedirect hook will handle routing based on user's familyId
        }
      }
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'data' in err && 
        err.data && typeof err.data === 'object' && 'message' in err.data
        ? (err.data as { message: string }).message
        : 'Authentication failed. Please try again.';
      setError(errorMessage);
    }
  };

  const isLoading = isLoginLoading || isRegisterLoading;

  return (
    <WelcomeBackground>
      {/* Theme Toggle Button - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="p-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-gray-600" />}
        </Button>
      </div>

      <div className="min-h-screen flex flex-col xl:flex-row">
        {/* Desktop Hero Section */}
        <WelcomeHero />

        {/* Auth Section */}
        <div className="w-full xl:w-2/5 flex flex-col justify-center items-center p-4 lg:p-6 xl:p-8 min-h-screen xl:min-h-auto">
          
          {/* Mobile/Tablet Header */}
          <WelcomeMobileHeader />

          {/* Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <AuthForm
              onSubmit={handleAuthSubmit}
              onAnonymousAccess={handleContinueAnonymously}
              isLoading={isLoading}
              isAnonymousLoading={isAnonymousLoading}
              error={error}
            />
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-4 lg:mt-6 px-6 w-full"
          >
            <p className="text-gray-500 text-xs lg:text-sm">
              By continuing, you agree to our{' '}
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                Terms & Privacy Policy
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </WelcomeBackground>
  );
}
