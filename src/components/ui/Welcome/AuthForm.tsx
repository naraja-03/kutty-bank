import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface AuthFormProps {
  onSubmit: (data: AuthFormData) => Promise<void>;
  onAnonymousAccess: () => void;
  isLoading?: boolean;
  isAnonymousLoading?: boolean;
  error?: string;
  className?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  isLogin: boolean;
}

export const AuthForm = ({
  onSubmit,
  onAnonymousAccess,
  isLoading = false,
  isAnonymousLoading = false,
  error,
  className = ''
}: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const { theme } = useTheme();

  const handleAuthToggle = (loginState: boolean) => {
    setIsLogin(loginState);
    // Clear form fields when switching
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      isLogin
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-purple-500/10 ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border border-purple-500/30' 
          : 'bg-white/98 border border-purple-300/80'
      } ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      
      {/* Title - Show on all screen sizes */}
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {isLogin ? 'Sign in to continue your journey' : 'Join thousands of users taking control'}
        </p>
      </div>

      {/* Auth Toggle */}
      <div className={`flex mb-6 rounded-2xl p-1 border ${
        theme === 'dark' 
          ? 'bg-gray-800/80 border-purple-500/30' 
          : 'bg-gray-100/80 border-purple-300/50'
      }`}>
        <button
          type="button"
          onClick={() => handleAuthToggle(true)}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            isLogin
              ? theme === 'dark'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-500/50'
                : 'bg-white text-gray-900 shadow-lg shadow-purple-200/50 border border-purple-300/50'
              : theme === 'dark'
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleAuthToggle(false)}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            !isLogin
              ? theme === 'dark'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-500/50'
                : 'bg-white text-gray-900 shadow-lg shadow-purple-200/50 border border-purple-300/50'
              : theme === 'dark'
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Field (Sign Up Only) */}
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                icon={<User className="w-4 h-4 lg:w-5 lg:h-5" />}
                variant="filled"
                required={!isLogin}
                disabled={isLoading}
                animated={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <Input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          icon={<Mail className="w-4 h-4 lg:w-5 lg:h-5" />}
          variant="filled"
          required
          disabled={isLoading}
          animated={false}
        />

        {/* Password Field */}
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          icon={<Lock className="w-4 h-4 lg:w-5 lg:h-5" />}
          variant="filled"
          showPasswordToggle
          required
          disabled={isLoading}
          animated={false}
        />

        {/* Confirm Password Field (Sign Up Only) */}
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="confirm-password-field"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                icon={<Lock className="w-4 h-4 lg:w-5 lg:h-5" />}
                variant="filled"
                required={!isLogin}
                disabled={isLoading}
                animated={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs lg:text-sm text-center p-3 lg:p-4 rounded-lg border ${
              error.includes('successful') || error.includes('Welcome')
                ? 'text-green-400 bg-green-500/10 border-green-500/20'
                : 'text-red-400 bg-red-500/10 border-red-500/20'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          loadingText={isLogin ? 'Signing In...' : 'Creating Account...'}
          icon={<ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />}
          disabled={isLoading}
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-3 lg:my-4 flex items-center">
        <div className={`flex-1 border-t ${
          theme === 'dark' ? 'border-purple-500/30' : 'border-purple-300'
        }`}></div>
        <span className={`px-4 text-xs lg:text-sm ${
          theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
        }`}>OR</span>
        <div className={`flex-1 border-t ${
          theme === 'dark' ? 'border-purple-500/30' : 'border-purple-300'
        }`}></div>
      </div>

      {/* Anonymous Access */}
      <Button
        type="button"
        variant="outline"
        size="md"
        fullWidth
        onClick={onAnonymousAccess}
        isLoading={isAnonymousLoading}
        loadingText="Loading..."
        icon={<ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />}
        disabled={isLoading || isAnonymousLoading}
      >
        Continue as Guest
      </Button>
    </motion.div>
  );
};
