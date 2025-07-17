'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, User, UserPlus } from 'lucide-react';
import { useRegisterMutation } from '@/store/api/authApi';
import { loginSuccess } from '@/store/slices/authSlice';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();


  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (formData.name && !formData.username) {
      const baseUsername = formData.name.toLowerCase().replace(/\s+/g, '_');
      const randomNumbers = Math.floor(Math.random() * 900) + 100;
      const generatedUsername = `${baseUsername}${randomNumbers}`;
      setFormData(prev => ({ ...prev, username: generatedUsername }));
    }
  }, [formData.name, formData.username]);

  if (!mounted) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        username: formData.username,
        email: formData.username,
        password: formData.password
      }).unwrap();

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
      setError(error?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-8 mt-10">

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 shadow-lg overflow-hidden relative">
                <Image 
                  src="/logo without bg.png" 
                  alt="Rightrack Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-gray-400">Family Budget Tracker</p>
            </div>


            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
                <p className="text-gray-400 text-center">Join your family budget tracker</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email as Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
                      placeholder="Create a password"
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


                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6" />
                      Create Account
                    </>
                  )}
                </button>
              </form>


              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  By creating an account, you agree to our{' '}
                  <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>


            <div className="text-center py-6">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
