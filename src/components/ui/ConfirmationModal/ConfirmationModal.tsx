import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
  isLoading?: boolean;
  closeOnOutsideClick?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
  closeOnOutsideClick = true
}: ConfirmationModalProps) => {
  const { theme } = useTheme();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && !isLoading && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    const iconClasses = "w-8 h-8 md:w-10 md:h-10";
    switch (type) {
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
      case 'danger':
        return <XCircle className={`${iconClasses} text-red-500`} />;
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-500`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-500`} />;
      default:
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
    }
  };

  const getConfirmVariant = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 focus:ring-red-500/20';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 focus:ring-green-500/20';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500/20';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Mobile Bottom Sheet */}
          <motion.div
            className="md:hidden fixed inset-x-0 bottom-0 z-50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={`
              ${theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
              } 
              border-t rounded-t-xl shadow-xl
            `}>
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`
                  w-10 h-1 rounded-full 
                  ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}
                `} />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  {getIcon()}
                </div>

                {/* Title */}
                <h3 className={`
                  text-lg font-semibold mb-3 
                  ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                `}>
                  {title}
                </h3>

                {/* Message */}
                <p className={`
                  text-sm mb-6 leading-relaxed 
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                `}>
                  {message}
                </p>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`
                      w-full px-4 py-3 rounded-lg text-white font-semibold 
                      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${getConfirmVariant()}
                    `}
                  >
                    {isLoading ? 'Processing...' : confirmText}
                  </button>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className={`
                      w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${theme === 'dark' 
                        ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' 
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {cancelText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Center Modal */}
          <motion.div
            className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className={`
                ${theme === 'dark' 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
                } 
                border rounded-xl shadow-2xl w-full max-w-md
              `}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  {getIcon()}
                </div>

                {/* Title */}
                <h3 className={`
                  text-xl font-semibold mb-3 
                  ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                `}>
                  {title}
                </h3>

                {/* Message */}
                <p className={`
                  text-sm mb-6 leading-relaxed 
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                `}>
                  {message}
                </p>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className={`
                      flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${theme === 'dark' 
                        ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-600' 
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                      }
                    `}
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`
                      flex-1 px-4 py-2.5 rounded-lg text-white font-semibold 
                      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${getConfirmVariant()}
                    `}
                  >
                    {isLoading ? 'Processing...' : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
