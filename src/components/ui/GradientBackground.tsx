'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 
    | 'dashboard' 
    | 'activity' 
    | 'family' 
    | 'messages' 
    | 'settings' 
    | 'ai-insights' 
    | 'welcome' 
    | 'default';
}

export default function GradientBackground({ 
  children, 
  variant = 'default' 
}: GradientBackgroundProps) {
  const { theme } = useTheme();

  const getGradientClasses = () => {
    const baseClasses = "min-h-screen transition-all duration-300";
    
    if (theme === 'dark') {
      switch (variant) {
        case 'dashboard':
          return `${baseClasses} bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900`;
        case 'activity':
          return `${baseClasses} bg-gradient-to-br from-gray-900 via-green-900 to-gray-900`;
        case 'family':
          return `${baseClasses} bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900`;
        case 'messages':
          return `${baseClasses} bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900`;
        case 'settings':
          return `${baseClasses} bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900`;
        case 'ai-insights':
          return `${baseClasses} bg-gradient-to-br from-gray-900 via-cyan-900 to-gray-900`;
        case 'welcome':
          return `${baseClasses} bg-gradient-to-br from-black via-gray-900 to-black`;
        default:
          return `${baseClasses} bg-gray-900`;
      }
    } else {
      switch (variant) {
        case 'dashboard':
          return `${baseClasses} bg-gradient-to-br from-blue-50 via-white to-blue-50`;
        case 'activity':
          return `${baseClasses} bg-gradient-to-br from-green-50 via-white to-green-50`;
        case 'family':
          return `${baseClasses} bg-gradient-to-br from-purple-50 via-white to-purple-50`;
        case 'messages':
          return `${baseClasses} bg-gradient-to-br from-indigo-50 via-white to-indigo-50`;
        case 'settings':
          return `${baseClasses} bg-gradient-to-br from-slate-50 via-white to-slate-50`;
        case 'ai-insights':
          return `${baseClasses} bg-gradient-to-br from-cyan-50 via-white to-cyan-50`;
        case 'welcome':
          return `${baseClasses} bg-gradient-to-br from-gray-50 via-white to-gray-50`;
        default:
          return `${baseClasses} bg-white`;
      }
    }
  };

  return (
    <div className={getGradientClasses()}>
      {children}
    </div>
  );
}
