'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Calendar, TrendingUp, TrendingDown, Clock, Hash, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { openCustomBudgetModal, openEditCustomBudgetModal } from '@/store/slices/uiSlice';
import { useGetBudgetsQuery } from '@/store/api/budgetsApi';
import { addCustomBudgetThread } from '@/store/slices/threadsSlice';
import { RootState } from '@/store';
import { ThreadSidebarProps, SavedThread } from './types';

export default function ThreadSidebar({
  isOpen,
  onClose,
  threads,
  activeThread,
  onThreadSelect
}: ThreadSidebarProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  

  const { data: budgets = [] } = useGetBudgetsQuery(
    user ? { userId: user.id, familyId: user.familyId } : { userId: '', familyId: '' },
    { skip: !user }
  );


  useEffect(() => {
    if (budgets.length > 0) {
      budgets.forEach(budget => {
        if (budget.isCustom) {
          const existingThread = threads.find(thread => thread.id === budget.id);
          if (!existingThread) {
            dispatch(addCustomBudgetThread({
              id: budget.id,
              label: budget.label,
              description: budget.description,
              targetAmount: budget.targetAmount
            }));
          }
        }
      });
    }
  }, [budgets, threads, dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleNewThread = () => {
    dispatch(openCustomBudgetModal('create'));
    onClose();
  };

  const handleEditThread = (thread: SavedThread) => {
    dispatch(openEditCustomBudgetModal({
      id: thread.id,
      name: thread.label,
      description: thread.description || '',
      targetAmount: thread.targetAmount || 0,
      startDate: thread.startDate || new Date(),
      endDate: thread.endDate || new Date(),
    }));
    onClose();
  };

  const getThreadIcon = (thread: { value: string }) => {
    switch (thread.value) {
      case 'daily':
        return <Clock size={16} className="text-green-400" />;
      case 'week':
        return <Calendar size={16} className="text-blue-400" />;
      case 'month':
        return <Calendar size={16} className="text-green-400" />;
      case 'quarter':
        return <Calendar size={16} className="text-purple-400" />;
      case 'year':
        return <Calendar size={16} className="text-orange-400" />;
      case 'custom':
        return <Hash size={16} className="text-pink-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-start">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 -translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 -translate-x-full"
            >
              <Dialog.Panel className="w-80 h-full bg-black border-r border-gray-800 p-6 text-white shadow-xl transform transition-all">
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title className="text-xl font-bold">Threads</Dialog.Title>
                    <p className="text-sm text-gray-400">Time periods & ranges</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                
                <button
                  onClick={handleNewThread}
                  className="w-full mb-6 bg-white text-black py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                  <span>New Custom Thread</span>
                </button>

                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    Available Threads
                  </h3>
                  
                  {threads.map((thread) => {
                    const isActive = activeThread.id === thread.id;
                    const savedThread = thread as SavedThread;
                    
                    return (
                      <div
                        key={thread.id}
                        className={clsx(
                          'w-full p-4 rounded-xl border text-left transition-all duration-200 relative',
                          isActive 
                            ? 'bg-gray-800 border-white shadow-lg' 
                            : 'bg-gray-900/95 border-gray-800 hover:border-gray-700 hover:bg-gray-800'
                        )}
                      >
                        <button
                          onClick={() => onThreadSelect(thread)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getThreadIcon(thread)}
                              <span className="font-medium text-white">{thread.label}</span>
                            </div>
                            {isActive && (
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-400 mb-2">
                            {thread.value === 'custom' && thread.startDate && thread.endDate ? (
                              `${thread.startDate.toLocaleDateString()} - ${thread.endDate.toLocaleDateString()}`
                            ) : (
                              `${thread.value.charAt(0).toUpperCase() + thread.value.slice(1)} Period`
                            )}
                          </div>

                          
                          {savedThread.totalTransactions !== undefined && (
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1">
                                <Hash size={12} className="text-gray-500" />
                                <span className="text-gray-400">
                                  {savedThread.totalTransactions} transactions
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {savedThread.totalAmount >= 0 ? (
                                  <TrendingUp size={12} className="text-green-400" />
                                ) : (
                                  <TrendingDown size={12} className="text-red-400" />
                                )}
                                <span className={clsx(
                                  'font-medium',
                                  savedThread.totalAmount >= 0 ? 'text-green-400' : 'text-red-400'
                                )}>
                                  {formatCurrency(Math.abs(savedThread.totalAmount))}
                                </span>
                              </div>
                            </div>
                          )}

                          
                          {savedThread.isCustom && savedThread.targetAmount && savedThread.targetAmount > 0 && (
                            <div className="text-xs text-blue-400 mt-1">
                              Target: {formatCurrency(savedThread.targetAmount)}
                            </div>
                          )}

                          
                          {savedThread.isCustom && savedThread.description && (
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {savedThread.description}
                            </div>
                          )}
                        </button>

                        
                        {savedThread.isCustom && (
                          <div className="absolute top-3 right-3">
                            <Menu as="div" className="relative">
                              <MenuButton className="p-1 text-gray-400 hover:text-white transition-colors">
                                <MoreVertical size={16} />
                              </MenuButton>
                              <MenuItems className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditThread(savedThread);
                                      }}
                                      className={clsx(
                                        'w-full px-3 py-2 text-left text-sm flex items-center gap-2',
                                        active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                      )}
                                    >
                                      <Edit size={14} />
                                      Edit
                                    </button>
                                  )}
                                </MenuItem>
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        console.log('Delete thread:', savedThread.id);
                                      }}
                                      className={clsx(
                                        'w-full px-3 py-2 text-left text-sm flex items-center gap-2',
                                        active ? 'bg-red-600 text-white' : 'text-red-400'
                                      )}
                                    >
                                      <Trash2 size={14} />
                                      Delete
                                    </button>
                                  )}
                                </MenuItem>
                              </MenuItems>
                            </Menu>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                
                <div className="mt-8 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    Create custom threads to track specific time periods and compare your financial progress.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
