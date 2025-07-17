'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Home, MessageCircle, Plus, Activity, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { logout } from '@/store/slices/authSlice';
import { openAddEntryModal } from '@/store/slices/uiSlice';
import { BottomNavProps, NavTab } from './types';

const tabs: NavTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
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
    id: 'family',
    label: 'Family',
    icon: Users,
    href: '/family',
  },
];

export default function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (activeTab) return activeTab;

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

  const handleFamilyLongPress = () => {
    if (confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      router.push('/login');
    }
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      dispatch(openAddEntryModal());
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-gray-800 shadow-2xl z-50">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 max-w-4xl mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentActiveTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'add') {
                  handleAddClick();
                } else {
                  handleTabClick(tab);
                }
              }}
              onContextMenu={e => {
                if (tab.id === 'family') {
                  e.preventDefault();
                  handleFamilyLongPress();
                }
              }}
              onDoubleClick={() => {
                if (tab.id === 'family') {
                  handleFamilyLongPress();
                }
              }}
              className={clsx(
                'flex flex-col items-center justify-center py-2 px-2 sm:px-3 lg:px-4 rounded-xl transition-all duration-200',
                'flex-1 max-w-[90px] min-w-[60px]',
                'hover:bg-white/10 active:scale-95 touch-manipulation',
                tab.id === 'add' ? 'bg-white/10' : '',
                isActive && tab.id !== 'add' ? 'text-white' : 'text-gray-400'
              )}
              aria-label={tab.id === 'family' ? `${tab.label} (double-tap to logout)` : tab.label}
            >
              <Icon
                size={22}
                className={clsx(
                  'mb-1 transition-colors duration-200',
                  tab.id === 'add' ? 'text-white' : isActive ? 'text-white' : 'text-gray-400'
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
