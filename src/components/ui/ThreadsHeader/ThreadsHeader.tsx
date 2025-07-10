'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, ChevronDown, LogOut, User } from 'lucide-react';
import { clsx } from 'clsx';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { ThreadsHeaderProps } from './types';
import LogoutModal from '../LogoutModal';
import { useSafeArea } from '../../../hooks/useSafeArea';

export default function ThreadsHeader({
  title,
  onLeftAction,
  leftIcon: LeftIcon = Menu,
  activeThread,
  showThreadSelector = false,
  onThreadSelectorClick,
  className
}: ThreadsHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const safeAreaInsets = useSafeArea();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
    setShowLogoutModal(false);
  };
  return (
    <header className={clsx(
      'sticky top-0 bg-black/20 backdrop-blur-2xl border-b border-white/10 z-40 shadow-lg',
      className
    )} style={{ paddingTop: safeAreaInsets.top }}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onLeftAction}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95"
              aria-label="Menu"
            >
              <LeftIcon size={20} className="text-white" />
            </button>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {showThreadSelector && activeThread && (
                <button
                  onClick={onThreadSelectorClick}
                  className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <span>{activeThread.label}</span>
                  <ChevronDown size={14} />
                </button>
              )}
            </div>
          </div>

          {}
          <div className="flex items-center space-x-3">
            {}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-950 to-black rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-800">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={16} className="text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {}
        {showThreadSelector && activeThread && (
          <div className="mt-3 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Current Period:</span>
              <span className="text-white font-medium">{activeThread.label}</span>
            </div>
            {activeThread.startDate && activeThread.endDate && (
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Range:</span>
                <span className="text-gray-300">
                  {activeThread.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {activeThread.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        userName={currentUser?.name}
      />
    </header>
  );
}
