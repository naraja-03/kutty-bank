'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { CommonModal, ConfirmationModal, Button } from '@/components/ui';
import { Settings, Sun, Moon } from 'lucide-react';

export default function ComponentDemo() {
  const { theme, toggleTheme } = useTheme();
  const [isCommonModalOpen, setIsCommonModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'warning' | 'danger' | 'success' | 'info'>('warning');

  const handleConfirm = () => {
    console.log('Action confirmed!');
    setIsConfirmModalOpen(false);
  };

  const openConfirmModal = (type: 'warning' | 'danger' | 'success' | 'info') => {
    setConfirmationType(type);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Modal Components Demo</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Theme Info */}
        <div className={`p-4 rounded-lg mb-8 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <p className="text-sm">
            Current theme: <span className="font-semibold">{theme}</span>
          </p>
          <p className="text-xs mt-1 opacity-75">
            Switch between light and dark modes to see the modals adapt
          </p>
        </div>

        {/* CommonModal Demo */}
        <div className={`p-6 rounded-lg mb-6 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            CommonModal Component
          </h2>
          <p className="text-sm mb-4 opacity-75">
            Responsive modal that shows as bottom sheet on mobile and center popup on desktop
          </p>
          <Button onClick={() => setIsCommonModalOpen(true)}>
            Open Common Modal
          </Button>
        </div>

        {/* ConfirmationModal Demo */}
        <div className={`p-6 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">ConfirmationModal Component</h2>
          <p className="text-sm mb-4 opacity-75">
            Confirmation dialogs with different types and appropriate icons
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => openConfirmModal('warning')}
            >
              Warning
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => openConfirmModal('danger')}
            >
              Danger
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => openConfirmModal('success')}
            >
              Success
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => openConfirmModal('info')}
            >
              Info
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CommonModal
        isOpen={isCommonModalOpen}
        onClose={() => setIsCommonModalOpen(false)}
        title="Settings"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Theme Settings</h3>
            <p className="text-sm opacity-75 mb-3">
              Choose your preferred theme for the application
            </p>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => theme === 'light' && toggleTheme()}
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm opacity-75">
              This modal automatically adapts to mobile (bottom sheet) and desktop (center popup) layouts.
            </p>
          </div>
        </div>
      </CommonModal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        type={confirmationType}
        title={`${confirmationType.charAt(0).toUpperCase() + confirmationType.slice(1)} Action`}
        message={`This is a ${confirmationType} confirmation dialog. Are you sure you want to proceed with this action?`}
        confirmText="Yes, Continue"
        cancelText="Cancel"
      />
    </div>
  );
}
