'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi';
import { setAnonymousUser, loginSuccess } from '@/store/slices/authSlice';

export default function WelcomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleContinueAnonymously = () => {
    setIsAnonymousLoading(true);
    // Set anonymous user state (memory only)
    dispatch(setAnonymousUser());
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Form submitted:', { isLogin, formData });

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (isLogin) {
        console.log('Attempting login...');
        const result = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();

        console.log('Login successful:', result);

        dispatch(
          loginSuccess({
            user: result.user,
            token: result.token,
          })
        );

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', result.token);
          localStorage.removeItem('isAnonymous');
        }

        router.push('/dashboard');
      } else {
        console.log('Attempting registration...');
        const result = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.email.split('@')[0], // Generate username from email
        }).unwrap();

        console.log('Registration successful:', result);

        dispatch(
          loginSuccess({
            user: result.user,
            token: result.token,
          })
        );

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', result.token);
          localStorage.removeItem('isAnonymous');
        }

        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error('Authentication error:', err);
      const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Authentication failed';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                <Image
                  src="/icon-glass.svg"
                  alt="RighTrack Logo"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              RighTrack
            </h1>
            <p className="text-gray-400 text-base">
              Track expenses beautifully
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={handleContinueAnonymously}
            disabled={isAnonymousLoading}
            className="w-full mb-4 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnonymousLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading dashboard...</span>
              </>
            ) : (
              <>
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center mb-4"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="px-3 text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
          >
            <div className="flex mb-4 bg-white/5 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                disabled={isLoginLoading || isRegisterLoading}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isLogin
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                disabled={isLoginLoading || isRegisterLoading}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${!isLogin
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoginLoading || isRegisterLoading}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoginLoading || isRegisterLoading}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoginLoading || isRegisterLoading}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoginLoading || isRegisterLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoginLoading || isRegisterLoading}
                className="w-full bg-white text-black py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {(isLoginLoading || isRegisterLoading) && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center pb-4 px-6"
        >
          <p className="text-gray-500 text-xs">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
