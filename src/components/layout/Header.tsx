'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell, Sun, Moon, Menu, X } from 'lucide-react';
import { Logo } from '../ui';

interface HeaderProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        {
            id: 1,
            title: 'Budget Alert',
            message: 'You have exceeded your grocery budget by ₹500',
            time: '2 min ago',
            type: 'warning'
        },
        {
            id: 2,
            title: 'Savings Goal',
            message: 'Great! You saved ₹2,000 this week',
            time: '1 hour ago',
            type: 'success'
        },
        {
            id: 3,
            title: 'Bill Reminder',
            message: 'Electricity bill due in 3 days',
            time: '3 hours ago',
            type: 'info'
        }
    ];

    return (
        <header className={`sticky top-0 z-50 border-b backdrop-blur-sm ${theme === 'dark'
            ? 'bg-gray-900/95 border-gray-800'
            : 'bg-white/95 border-gray-200'
            }`}>
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side - Menu button for mobile */}
                <div className="flex items-center gap-4">
                    {showMenuButton && (
                        <button
                            onClick={onMenuClick}
                            className={`lg:hidden p-2 rounded-lg ${theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-300'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    <Logo size='sm' className="block md:hidden" />
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                            ? 'hover:bg-gray-800 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-600'
                            }`}
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2 rounded-lg transition-colors relative ${theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-300'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                            title="Notifications"
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg border z-50 ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-700'
                                    : 'bg-white border-gray-200'
                                    }`}>
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Notifications
                                            </h3>
                                            <button
                                                onClick={() => setShowNotifications(false)}
                                                className={`p-1 rounded ${theme === 'dark'
                                                    ? 'hover:bg-gray-700 text-gray-400'
                                                    : 'hover:bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center">
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    No new notifications
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.type === 'warning' ? 'bg-yellow-500' :
                                                            notification.type === 'success' ? 'bg-green-500' :
                                                                'bg-blue-500'
                                                            }`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                                }`}>
                                                                {notification.title}
                                                            </p>
                                                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                                                }`}>
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                                        <button className={`w-full text-center text-sm font-medium py-2 rounded ${theme === 'dark'
                                            ? 'text-blue-400 hover:bg-gray-700'
                                            : 'text-blue-600 hover:bg-gray-50'
                                            }`}>
                                            View All Notifications
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
