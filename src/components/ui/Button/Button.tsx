import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { LoadingSpinner } from '../Loading';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  animated?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  animated = true,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 focus:ring-purple-500/20 shadow-lg hover:shadow-xl',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500/20 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-500',
    outline: 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white focus:ring-purple-500/20',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5 focus:ring-white/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm lg:text-base',
    lg: 'px-6 py-3 text-base lg:text-lg'
  };

  const isDisabled = disabled || isLoading;
  const displayText = isLoading && loadingText ? loadingText : children;

  const buttonContent = (
    <>
      {isLoading && <LoadingSpinner size="sm" color="border-current" />}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span>{displayText}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </>
  );

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  if (animated) {
    const MotionButton = motion.button;
    return (
      <MotionButton
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        onClick={props.onClick}
        type={props.type}
        form={props.form}
        name={props.name}
        value={props.value}
      >
        {buttonContent}
      </MotionButton>
    );
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = 'Button';
