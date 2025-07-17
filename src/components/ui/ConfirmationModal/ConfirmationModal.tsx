'use client';

import { ReactNode } from 'react';
import { AlertTriangle, Trash2, LogOut, Check } from 'lucide-react';
import BottomSheet from '../BottomSheet';

export type ConfirmationVariant = 'danger' | 'warning' | 'success' | 'info';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-500/30',
    iconColor: 'text-red-400',
    confirmBg: 'bg-red-500/80 border border-red-400/40 hover:bg-red-500/90',
    confirmText: 'Delete'
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-yellow-500/30',
    iconColor: 'text-yellow-400',
    confirmBg: 'bg-yellow-500/80 border border-yellow-400/40 hover:bg-yellow-500/90',
    confirmText: 'Continue'
  },
  success: {
    icon: Check,
    iconBg: 'bg-green-500/30',
    iconColor: 'text-green-400',
    confirmBg: 'bg-green-500/80 border border-green-400/40 hover:bg-green-500/90',
    confirmText: 'Confirm'
  },
  info: {
    icon: LogOut,
    iconBg: 'bg-blue-500/30',
    iconColor: 'text-blue-400',
    confirmBg: 'bg-blue-500/80 border border-blue-400/40 hover:bg-blue-500/90',
    confirmText: 'Confirm'
  }
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseButton={false}
      maxHeight="max-h-[50vh]"
    >
      <div className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

        {/* Message */}
        <div className="text-gray-300 mb-8 text-sm leading-relaxed">
          {message}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white/10 border border-white/30 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 ${config.confirmBg} rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Icon className="w-4 h-4" />
                {confirmText || config.confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
