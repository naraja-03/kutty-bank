'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  MessageCircle, 
  Plus, 
  TrendingUp, 
  Menu,
  X,
  Settings,
  Users,
  Brain,
  LogOut
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AddTransactionModal } from '@/components/ui';
import { Transaction, useAddTransactionMutation, useGetTransactionsQuery } from '@/store/api/transactionsApi';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/dashboard'
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    href: '/messages'
  },
  {
    id: 'add',
    label: 'Add',
    icon: Plus,
    isModal: true
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: TrendingUp,
    href: '/transactions'
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: Menu,
    isExpandable: true
  }
];

const moreItems = [
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    href: '/family-management',
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
    icon: Brain,
    href: '/ai-insights',
    description: 'Coming soon'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    href: '/logout',
    description: 'Sign out of app'
  }
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addTransaction, { }] = useAddTransactionMutation();
  const { refetch } = useGetTransactionsQuery();

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isExpandable) {
      setIsMenuExpanded(!isMenuExpanded);
    } else if (item.isModal) {
      setIsAddModalOpen(true);
    } else if (item.href) {
      router.push(item.href);
      setIsMenuExpanded(false);
    }
  };

  const handleMoreItemClick = (item: typeof moreItems[0]) => {
    if (item.href) {
      router.push(item.href);
      setIsMenuExpanded(false);
    }
  };

  const handleTransactionSubmit = async (transaction: Transaction) => {
    try {
      await addTransaction(transaction).unwrap();
      setIsAddModalOpen(false);
      refetch();
    } catch (e) {
      // Optionally show error
      console.error('Failed to add transaction', e);
    }
  };

  const isActive = (href?: string) => href && pathname === href;

  return (
    <>
      {/* Expanded Menu Overlay */}
      {isMenuExpanded && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuExpanded(false)}
          />
          
          {/* Menu Modal */}
          <div className={`fixed inset-0 z-50 flex items-end ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className={`w-full rounded-t-3xl backdrop-blur-sm border-t ${
              theme === 'dark'
                ? 'bg-gray-900/95 border-gray-700'
                : 'bg-white/95 border-gray-200'
            } animate-slide-up`}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={() => setIsMenuExpanded(false)}
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-6 space-y-4">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMoreItemClick(item)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                        isActive(item.href)
                          ? theme === 'dark'
                            ? 'bg-blue-600/20 border border-blue-500/30'
                            : 'bg-blue-50 border border-blue-200'
                          : theme === 'dark'
                            ? 'hover:bg-gray-800/50'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        item.id === 'logout' 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold ${
                          item.id === 'logout' 
                            ? 'text-red-600 dark:text-red-400'
                            : theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Safe area padding for iPhone */}
              <div className="h-8"></div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isExpandable ? isMenuExpanded : isActive(item.href);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  active
                    ? theme === 'dark'
                      ? 'text-blue-400'
                      : 'text-blue-600'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${
                  active
                    ? theme === 'dark'
                      ? 'bg-blue-600/20'
                      : 'bg-blue-50'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Safe area padding */}
        <div className="h-safe-area-inset-bottom"></div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleTransactionSubmit}
      />

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
