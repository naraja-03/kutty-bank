'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { loginSuccess } from '@/store/slices/authSlice';

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState('raja@example.com'); // Can be email or username
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginInput || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await login({ email: loginInput, password }).unwrap();
      
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', result.token);
      }
      
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      setError(error?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPassword: string) => {
    setLoginInput(quickEmail);
    setPassword(quickPassword);
    setError('');

    try {
      const result = await login({ email: quickEmail, password: quickPassword }).unwrap();
      
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', result.token);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      setError(error?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="min-h-full flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-2xl mb-6 shadow-lg">
                <span className="text-2xl font-bold text-gray-900">K</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">KuttyBank</h1>
              <p className="text-gray-400">Family Budget Tracker</p>
            </div>

            {/* Login Form */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-center">Sign in to your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address or Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
                      placeholder="Enter email or username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Quick Login Options */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-4 text-center">Quick Login (Demo)</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleQuickLogin('raja@example.com', 'password123')}
                    className="w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-between">
                      <span>Login as Raja</span>
                      <span className="text-xs text-gray-400">Admin</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickLogin('suriya@example.com', 'password123')}
                    className="w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-xl text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-between">
                      <span>Login as Suriya</span>
                      <span className="text-xs text-gray-400">Member</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6">
              <p className="text-gray-400">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
