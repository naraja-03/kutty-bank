'use client';

import React from 'react';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SwipeableModal from '../SwipeableModal';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    dismissible?: boolean; // New prop to control if modal can be closed
}

export default function SignInModal({
    isOpen,
    onClose,
    title = "Sign In Required",
    message = "You need to sign in to save your budget data and access all features.",
    dismissible = true // Default to true for backward compatibility
}: SignInModalProps) {
    const router = useRouter();

    const handleSignIn = () => {
        router.push('/welcome');
        onClose();
    };


    return (
        <SwipeableModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            dismissible={dismissible}
            showAboveBottomNav={true}
        >
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
                    <span>Sign In / Create Account</span>
                </button>

            </div>

            {/* Continue as guest note */}
            {dismissible && (
                <div className="mt-4 text-center">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                        Continue without saving
                    </button>
                </div>
            )}
        </SwipeableModal>
    );
}
