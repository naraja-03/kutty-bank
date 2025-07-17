'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { loginSuccess } from '@/store/slices/authSlice';

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState('raja@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

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

      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token,
        })
      );

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 shadow-lg overflow-hidden relative">
              <Image src="/icon-glass.svg" alt="Rightrack Logo" fill className="object-cover" />
            </div>
            <p className="text-gray-400 text-sm">Family Budget Tracker</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white text-center mb-1">Welcome Back</h2>
              <p className="text-gray-400 text-center text-sm">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all text-sm"
                    placeholder="Enter email or username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-8 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <a
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
