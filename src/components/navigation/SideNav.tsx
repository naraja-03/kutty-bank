'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  MessageCircle, 
  Plus, 
  Receipt, 
  Settings,
  Users,
  Brain,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AddTransactionModal, Logo } from '@/components/ui';
import { Transaction } from '@/store/api/transactionsApi';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href?: string;
  isModal?: boolean;
  category?: 'main' | 'more';
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    category: 'main'
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    href: '/messages',
    category: 'main'
  },
  {
    id: 'add',
    label: 'Add Transaction',
    icon: Plus,
    isModal: true,
    category: 'main'
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: Receipt,
    href: '/transactions',
    category: 'main'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    category: 'more'
  },
  {
    id: 'family',
    label: 'Family Management',
    icon: Users,
    href: '/family-management',
    category: 'more'
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Brain,
    href: '/ai-insights',
    category: 'more'
  }
];

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleNavClick = (href?: string, isModal?: boolean) => {
    if (isModal) {
      setIsAddModalOpen(true);
    } else if (href) {
      router.push(href);
    }
  };

  const handleTransactionSubmit = (transaction: Transaction) => {
    // Handle transaction submission here
    console.log('Transaction submitted:', transaction);
    // You can add API call or state management here
  };

  const isActive = (href?: string) => href && pathname === href;

  const mainItems = navItems.filter(item => item.category === 'main');
  const moreItems = navItems.filter(item => item.category === 'more');

  return (
    <div className={`hidden lg:flex flex-col h-full border-r transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-b from-white via-blue-50 to-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b transition-all duration-300 ${
        theme === 'dark'
          ? 'border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20'
          : 'border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50'
      }`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className={`font-bold text-xl bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-blue-400 to-purple-400 text-transparent bg-clip-text' 
                : 'from-blue-600 to-purple-600 text-transparent bg-clip-text'
            }`}>
              RightTrack
            </h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
            theme === 'dark'
              ? 'hover:bg-blue-800/30 text-blue-400 hover:text-blue-300'
              : 'hover:bg-blue-100 text-blue-600 hover:text-blue-700'
          }`}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Main Navigation */}
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                theme === 'dark' 
                  ? 'text-blue-300' 
                  : 'text-blue-600'
              }`}>
                Main
              </h3>
            )}
            {mainItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href, item.isModal)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    active
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">
                        {item.label}
                      </span>
                      <ChevronRight 
                        size={16} 
                        className={`ml-auto transition-opacity duration-200 ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* More Section */}
          <div className="pt-6 space-y-2">
            {!isCollapsed && (
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                theme === 'dark' 
                  ? 'text-purple-300' 
                  : 'text-purple-600'
              }`}>
                More
              </h3>
            )}
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href, item.isModal)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    active
                      ? theme === 'dark'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-500 text-white'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">
                        {item.label}
                      </span>
                      <ChevronRight 
                        size={16} 
                        className={`ml-auto transition-opacity duration-200 ${
                          active ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  );
}
