'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full"
            >
              <Dialog.Panel
                className={clsx(
                  'w-full transform overflow-hidden rounded-t-3xl bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl transition-all flex flex-col',
                  maxHeight,
                  className
                )}
              >
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                  <div className="w-12 h-1 bg-white/40 rounded-full" />
                </div>

                <div className="flex items-start justify-between px-6 py-4 border-b border-white/20 flex-shrink-0">
                  <div className="flex-1">
                    <Dialog.Title className="text-xl font-semibold text-white">
                      {title}
                    </Dialog.Title>
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

                <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
