'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
  maxHeight?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  className,
  maxHeight = 'max-h-[90vh]',
}: BottomSheetProps) {
  const handleSwipeDown = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 && info.velocity.y > 0) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
        onClick={onClose}
      >
        <div className="fixed bottom-0 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleSwipeDown}
            className={clsx(
              'w-full bg-gradient-to-br from-gray-900 to-black rounded-t-3xl min-h-[50vh] flex flex-col overflow-hidden border border-white/10 shadow-2xl',
              maxHeight,
              className
            )}
            onClick={(e) => e.stopPropagation()}
            layout
            style={{ marginBottom: '80px' }} // Add margin to clear bottom nav
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-12 h-1 bg-gray-500 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-white/20 flex-shrink-0">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">
                  {title}
                </h2>
                {subtitle && <p className="text-sm text-white/70 mt-1">{subtitle}</p>}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 pt-0 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
