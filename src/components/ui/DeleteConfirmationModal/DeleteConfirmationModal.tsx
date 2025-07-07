'use client';

import { DeleteConfirmationModalProps } from './types';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Transaction',
  message = 'Are you sure you want to delete this transaction? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  className
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-gray-700 ${className || ''}`}>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
