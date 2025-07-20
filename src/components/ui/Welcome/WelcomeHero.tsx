import { motion } from 'framer-motion';
import { Sparkles, Shield, Globe } from 'lucide-react';
import { Logo } from '../Logo';
import { useTheme } from '@/contexts/ThemeContext';

export interface WelcomeHeroProps {
  className?: string;
}

export const WelcomeHero = ({ className = '' }: WelcomeHeroProps) => {
  const { theme } = useTheme();

  return (
    <motion.div
      className={`hidden xl:flex xl:w-3/5 flex-col justify-center items-center p-8 xl:p-12 relative ${className}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center max-w-xl">
        {/* Logo/Icon */}
        <motion.div
          className="mb-6 xl:mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Logo size="xl" animate className="mx-auto" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className={`text-3xl xl:text-4xl font-bold mb-4 xl:mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Master Your
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
            Financial Future
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={`text-sm xl:text-base mb-6 xl:mb-8 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Take control of your finances with intelligent budgeting,
          real-time tracking, and personalized insights.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 gap-3 xl:gap-4 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <FeatureCard
            icon={<Sparkles className="w-4 h-4 text-purple-400" />}
            title="Smart Analytics"
            description="AI-powered insights"
            bgColor="bg-purple-500/20"
          />
          <FeatureCard
            icon={<Shield className="w-4 h-4 text-blue-400" />}
            title="Bank-Level Security"
            description="Your data is protected"
            bgColor="bg-blue-500/20"
          />
          <FeatureCard
            icon={<Globe className="w-4 h-4 text-green-400" />}
            title="Cross-Platform"
            description="Mobile, tablet & desktop"
            bgColor="bg-green-500/20"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const FeatureCard = ({ icon, title, description, bgColor }: FeatureCardProps) => {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border ${theme === 'dark' ? 'border-white/10' : 'border-gray-300/50'
      }`}>
      <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div className="text-left">
        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xs xl:text-sm`}>{title}</h3>
        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
    </div>
  );
};
