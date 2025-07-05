'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, MessageCircle, Plus, Activity, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { BottomNavProps, NavTab } from './types';

const tabs: NavTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
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
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    href: '/activity'
  },
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    href: '/family'
  }
];

export default function BottomNav({ 
  activeTab, 
  onTabChange, 
  onAddClick 
}: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const getActiveTab = () => {
    if (activeTab) return activeTab;
    
    // Auto-detect active tab from pathname
    const currentPath = pathname.split('/')[1];
    return tabs.find(tab => tab.id === currentPath)?.id || 'dashboard';
  };

  const currentActiveTab = getActiveTab();

  const handleTabClick = (tab: NavTab) => {
    if (onTabChange) {
      onTabChange(tab.id);
    }
    router.push(tab.href);
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = currentActiveTab === tab.id;
          
          return (
            <div key={tab.id} className="flex-1 flex justify-center">
              {/* Add button in the middle */}
              {index === 2 && (
                <button
                  onClick={handleAddClick}
                  className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 active:scale-95"
                  aria-label="Add transaction"
                >
                  <Plus size={24} className="text-black" />
                </button>
              )}
              
              {/* Regular tab buttons */}
              {index !== 2 && (
                <button
                  onClick={() => handleTabClick(tab)}
                  className={clsx(
                    'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors duration-200',
                    'hover:bg-gray-800 active:scale-95',
                    isActive ? 'text-white' : 'text-gray-500'
                  )}
                  aria-label={tab.label}
                >
                  <Icon 
                    size={20} 
                    className={clsx(
                      'mb-1 transition-colors duration-200',
                      isActive ? 'text-white' : 'text-gray-500'
                    )} 
                  />
                  <span className="text-xs font-medium">
                    {tab.label}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
