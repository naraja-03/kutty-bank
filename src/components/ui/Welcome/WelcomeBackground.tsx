import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export interface WelcomeBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const WelcomeBackground = ({ children, className = '' }: WelcomeBackgroundProps) => {
  const { theme } = useTheme();
  
  const backgroundClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-black to-blue-900/20'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <div className={`min-h-screen ${backgroundClass} relative overflow-hidden ${className}`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(119,198,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <div className={`absolute top-10 left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-gradient-to-r from-purple-300 to-pink-300'
        }`}></div>
        <div className={`absolute top-40 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000 ${
          theme === 'dark' ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-300 to-cyan-300'
        }`}></div>
        <div className={`absolute bottom-10 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000 ${
          theme === 'dark' ? 'bg-pink-500' : 'bg-gradient-to-r from-indigo-300 to-purple-300'
        }`}></div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400/30 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400/20 rounded-full"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
