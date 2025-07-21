import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  className?: string;
}

export const CommonModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  className = ''
}: CommonModalProps) => {
  const { theme } = useTheme();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
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
            className="lg:hidden fixed inset-x-0 bottom-0 z-50"
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
              border-t rounded-t-xl shadow-xl max-h-[90vh] overflow-hidden
              ${className}
            `}>
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className={`
                  w-10 h-1 rounded-full 
                  ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}
                `} />
              </div>

              {/* Header */}
              {(title || showCloseButton) && (
                <div className={`
                  flex items-end justify-end px-4 py-3 
                  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} 
                  border-b
                `}>
                  {title && (
                    <h3 className={`
                      text-lg font-semibold 
                      ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                    `}>
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={`
                        p-2 rounded-lg transition-colors 
                        ${theme === 'dark' 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-4 overflow-y-auto max-h-[70vh]">
                {children}
              </div>
            </div>
          </motion.div>

          {/* Desktop Center Modal */}
          <motion.div
            className="hidden lg:flex fixed inset-0 z-50 items-center justify-center p-4"
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
                border rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
                ${className}
              `}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className={`
                  flex items-center justify-between px-6 py-4 
                  ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} 
                  border-b
                `}>
                  {title && (
                    <h3 className={`
                      text-xl font-semibold 
                      ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                    `}>
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={`
                        p-2 rounded-lg transition-colors 
                        ${theme === 'dark' 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
