'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  dismissible?: boolean;
  children: React.ReactNode;
  showAboveBottomNav?: boolean; // New prop to control z-index positioning
}

export default function SwipeableModal({
  isOpen,
  onClose,
  title,
  subtitle,
  dismissible = true,
  children,
  showAboveBottomNav = false
}: SwipeableModalProps) {
  const handleBackdropClick = () => {
    if (dismissible) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/50 flex items-end justify-center ${
            showAboveBottomNav ? 'z-[60]' : 'z-50'
          }`}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-gray-900 rounded-t-3xl w-full max-w-md mx-4 ${
              showAboveBottomNav ? 'mb-20' : 'mb-0'
            }`}
            onClick={handleContentClick}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            {title && (
              <div className="px-6 py-2">
                <div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  {subtitle && (
                    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
