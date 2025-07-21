'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  const { theme } = useTheme();

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
            Messages
          </h1>
          <p className={`text-sm mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Family budget discussions and notifications
          </p>
        </div>

        {/* Coming Soon */}
        <div className={`p-8 rounded-xl border text-center ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <MessageCircle className={`mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} size={64} />
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Messages Coming Soon
          </h2>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Family chat and budget notifications will be available here.
          </p>
        </div>
      </div>
    </div>
  );
}
