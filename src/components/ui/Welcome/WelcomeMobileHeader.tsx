import { motion } from 'framer-motion';
import { Logo } from '../Logo';
import { useTheme } from '@/contexts/ThemeContext';

export interface WelcomeMobileHeaderProps {
  className?: string;
}

export const WelcomeMobileHeader = ({ className = '' }: WelcomeMobileHeaderProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`xl:hidden text-center mb-4 lg:mb-6 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-3">
        <Logo size="md" animate className="mx-auto" />
      </div>
      <h1 className={`text-xl lg:text-2xl font-bold mb-1 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">RightTrack</span>
      </h1>
      <p className={`text-sm ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        Your personal finance companion
      </p>
    </motion.div>
  );
};
