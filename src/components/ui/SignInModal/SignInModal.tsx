'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SignInModal({ 
  isOpen, 
  onClose, 
  title = "Sign In Required",
  message = "You need to sign in to save your budget data and access all features."
}: SignInModalProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
    onClose();
  };

  const handleRegister = () => {
    router.push('/register');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gray-900 rounded-t-3xl w-full max-w-md mx-4 mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-2">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <p className="text-gray-300 mb-6 leading-relaxed">
                {message}
              </p>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSignIn}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
                
                <button
                  onClick={handleRegister}
                  className="w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Continue as guest note */}
              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Continue without saving
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
