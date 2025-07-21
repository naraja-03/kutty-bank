'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, User, Bell, Shield, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Switch between light and dark mode',
          icon: theme === 'dark' ? Moon : Sun,
          action: (
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )
        }
      ]
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Profile Settings',
          description: 'Manage your personal information',
          icon: User,
          action: (
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Coming Soon
            </span>
          )
        },
        {
          id: 'notifications',
          label: 'Notifications',
          description: 'Configure your notification preferences',
          icon: Bell,
          action: (
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Coming Soon
            </span>
          )
        }
      ]
    },
    {
      title: 'Security',
      items: [
        {
          id: 'privacy',
          label: 'Privacy & Security',
          description: 'Manage your privacy and security settings',
          icon: Shield,
          action: (
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Coming Soon
            </span>
          )
        }
      ]
    },
    {
      title: 'App',
      items: [
        {
          id: 'mobile',
          label: 'Mobile App',
          description: 'Download our mobile app for better experience',
          icon: Smartphone,
          action: (
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Coming Soon
            </span>
          )
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen p-4 lg:p-6 ${
      theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-2xl lg:text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your app preferences and account settings
          </p>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group) => (
            <div
              key={group.title}
              className={`p-6 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <h2 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {group.title}
              </h2>
              
              <div className="space-y-4">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}>
                          <Icon 
                            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} 
                            size={20} 
                          />
                        </div>
                        <div>
                          <h3 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div>
                        {item.action}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Version Info */}
        <div className={`mt-8 p-4 rounded-lg text-center ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            RightTrack Budget App v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
