'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { loginSuccess } from '@/store/slices/authSlice';
<<<<<<< Updated upstream
=======
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import PullToRefreshIndicator from '../../components/ui/PullToRefreshIndicator/PullToRefreshIndicator';
>>>>>>> Stashed changes

export default function LoginPage() {
  const [email, setEmail] = useState('raja@example.com'); 
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      
      // Store user data in Redux
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }));

      // Store token in localStorage
      localStorage.setItem('token', result.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      setError(error?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleQuickLogin = async (quickEmail: string, quickPassword: string) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError('');

    try {
      const result = await login({ email: quickEmail, password: quickPassword }).unwrap();
      
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }));

      localStorage.setItem('token', result.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { error?: string } };
      setError(error?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-gray-900">K</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">KuttyBank</h1>
            <p className="text-gray-400 text-sm">Family Budget Tracker</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Sign in to your account</p>
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 backdrop-blur-sm"
                    placeholder="Enter your email"
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
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 backdrop-blur-sm"
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
                className="w-full bg-gradient-to-r from-white to-gray-200 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:from-gray-100 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Quick Login Options */}
            {false && <div className="mt-8 pt-6 border-t border-white/10">
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
            </div>}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <a href="/register" className="text-white hover:text-gray-300 font-medium transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
  );
}
