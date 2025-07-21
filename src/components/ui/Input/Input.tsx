import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  showPasswordToggle?: boolean;
  animated?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  showPasswordToggle = false,
  animated = true,
  className = '',
  type: propType = 'text',
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState(propType);
  const { theme } = useTheme();

  // Handle password visibility toggle
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    setType(showPassword ? 'password' : 'text');
  };

  const baseClasses = 'w-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: theme === 'dark' 
      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-purple-400  focus:bg-white/10'
      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500  focus:bg-white',
    filled: theme === 'dark'
      ? 'bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400  focus:bg-gray-800/70'
      : 'bg-gray-50 border border-purple-300 text-gray-900 placeholder-gray-500 focus:border-purple-500  focus:bg-white',
    outline: theme === 'dark'
      ? 'bg-transparent border-2 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 '
      : 'bg-transparent border-2 border-purple-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 '
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-lg',
    lg: 'px-4 py-3 text-base rounded-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4 lg:w-5 lg:h-5',
    lg: 'w-5 h-5'
  };

  const hasLeftIcon = icon && iconPosition === 'left';
  const hasRightIcon = (icon && iconPosition === 'right') || (showPasswordToggle && propType === 'password');
  
  const inputClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${hasLeftIcon ? 'pl-10 lg:pl-12' : ''}
    ${hasRightIcon ? 'pr-10 lg:pr-12' : ''}
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {hasLeftIcon && (
          <div className={`absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 z-10 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {typeof icon === 'string' ? (
              <span className={iconSizes[size]}>{icon}</span>
            ) : (
              <div className={iconSizes[size]}>{icon}</div>
            )}
          </div>
        )}

        {/* Input Field */}
        {animated ? (
          <motion.input
            ref={ref}
            type={showPasswordToggle && propType === 'password' ? type : propType}
            className={inputClasses}
            disabled={disabled}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            name={props.name}
            id={props.id}
          />
        ) : (
          <input
            ref={ref}
            type={showPasswordToggle && propType === 'password' ? type : propType}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
        )}

        {/* Right Icon / Password Toggle */}
        {hasRightIcon && (
          <div className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 z-10">
            {showPasswordToggle && propType === 'password' ? (
              <button
                type="button"
                onClick={handlePasswordToggle}
                disabled={disabled}
                className={`transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? (
                  <EyeOff className={iconSizes[size]} />
                ) : (
                  <Eye className={iconSizes[size]} />
                )}
              </button>
            ) : icon && iconPosition === 'right' ? (
              <div className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {typeof icon === 'string' ? (
                  <span className={iconSizes[size]}>{icon}</span>
                ) : (
                  <div className={iconSizes[size]}>{icon}</div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
