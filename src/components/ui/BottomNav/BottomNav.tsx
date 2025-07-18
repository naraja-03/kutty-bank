'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  Plus, 
  Activity, 
  Menu,
  Settings,
  Users,
  Sparkles,
  X,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { logout } from '@/store/slices/authSlice';
import { openAddEntryModal } from '@/store/slices/uiSlice';
import { BottomNavProps, NavTab } from './types';

const defaultTabs: NavTab[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    href: '/messages',
  },
  {
    id: 'add',
    label: 'Add',
    icon: Plus,
    href: '#',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    href: '/activity',
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: Menu,
    href: '#',
  },
];

const menuOptions = [
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    href: '/family',
    description: 'Manage family members'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'App preferences'
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Sparkles,
    href: '/ai-insights',
    description: 'Coming soon'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    href: '#',
    description: 'Sign out of app'
  },
];

export default function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getActiveTab = () => {
    if (activeTab) return activeTab;
    const currentPath = pathname.split('/')[1];
    return defaultTabs.find(tab => tab.id === currentPath)?.id || 'dashboard';
  };

  const currentActiveTab = getActiveTab();

  const handleTabClick = (tab: NavTab) => {
    if (tab.id === 'add') {
      handleAddClick();
    } else if (tab.id === 'menu') {
      setIsMenuOpen(true);
    } else {
      if (onTabChange) {
        onTabChange(tab.id);
      }
      router.push(tab.href);
    }
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      dispatch(openAddEntryModal());
    }
  };

  const handleMenuOptionClick = (option: typeof menuOptions[0]) => {
    setIsMenuOpen(false);
    
    if (option.id === 'logout') {
      dispatch(logout());
      router.push('/welcome');
    } else if (option.id === 'ai-insights') {
      // Future feature - show coming soon message
      alert('AI Insights coming soon!');
    } else {
      router.push(option.href);
    }
  };

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.velocity.y < -500 || info.offset.y < -100) {
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      {/* Main Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-gray-800/50 shadow-2xl z-30"
        onPanEnd={handlePanEnd}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          {defaultTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentActiveTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={clsx(
                  'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200',
                  'flex-1 max-w-[70px]',
                  'hover:bg-white/10 active:scale-95 touch-manipulation',
                  tab.id === 'add' ? 'bg-white text-black' : '',
                  isActive && tab.id !== 'add' && tab.id !== 'menu' ? 'text-white' : 'text-gray-400'
                )}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon
                  size={20}
                  className={clsx(
                    'transition-colors duration-200',
                    tab.id === 'add' ? 'text-black' : 
                    isActive && tab.id !== 'menu' ? 'text-white' : 'text-gray-400'
                  )}
                />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Slide-up Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
              }}
              className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-gray-800/50 rounded-t-3xl z-40"
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pb-4">
                <h3 className="text-lg font-bold text-white">Menu</h3>
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full bg-white/10 text-gray-400 hover:text-white"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Menu Options */}
              <div className="px-6 pb-8 space-y-3">
                {menuOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleMenuOptionClick(option)}
                      className={clsx(
                        'w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200',
                        'hover:bg-white/10 active:scale-95',
                        option.id === 'logout' ? 'text-red-400 hover:bg-red-500/10' : 'text-white'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={clsx(
                        'p-2 rounded-lg',
                        option.id === 'logout' ? 'bg-red-500/20' : 'bg-white/10'
                      )}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-400">{option.description}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Safe Area */}
              <div className="h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
