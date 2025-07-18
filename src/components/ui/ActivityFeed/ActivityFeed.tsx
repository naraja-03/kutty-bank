'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from '../../../store/api/transactionApi';
import { ChevronDown, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { openEditEntryModal } from '../../../store/slices/uiSlice';
import { RootState } from '../../../store';
import BottomSheet from '../BottomSheet';
import SwipeableTransactionCard from '../SwipeableTransactionCard';
import BottomNav from '../BottomNav';

interface ActivityFeedProps {
  className?: string;
}

export default function ActivityFeed({ className }: ActivityFeedProps) {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const dispatch = useDispatch();
  const { activeThread } = useSelector((state: RootState) => state.threads);
  const { user } = useSelector((state: RootState) => state.auth);

  const currentBudgetId = activeThread?.isCustomBudget ? activeThread.budgetId : 'daily';

  const shouldFetchTransactions = Boolean(user?.familyId);

  const {
    data: transactionData,
    isLoading,
    refetch,
  } = useGetTransactionsQuery(
    {
      limit: 50,
      offset: 0,
      budgetId: currentBudgetId,
    },
    {
      skip: !shouldFetchTransactions,
    }
  );

  const [deleteTransaction] = useDeleteTransactionMutation();

  const transactions = useMemo(() => {
    const txns = transactionData?.transactions || [];

    return [...txns].reverse();
  }, [transactionData]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [transactions]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
        setShowScrollToBottom(!isAtBottom);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (transactions.length > 0 && !isLoading) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [transactions.length, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setDropdownOpen(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const handleEditTransaction = (transactionId: string) => {
    const transaction = transactionData?.transactions.find(t => t.id === transactionId);
    if (transaction) {
      dispatch(
        openEditEntryModal({
          id: transaction.id,
          amount: transaction.amount,
          date: new Date(transaction.createdAt).toISOString().split('T')[0],
          category: transaction.category,
          type: transaction.type,
          note: transaction.note,
        })
      );
    }
    setDropdownOpen(null);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId).unwrap();
      setShowDeleteModal(null);
      setDropdownOpen(null);
      refetch();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleReply = () => {
    router.push('/messages');
  };

  return (
    <div className={clsx('flex flex-col h-screen text-white', className)}>
      <div className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-gray-800/50 z-10 flex-shrink-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity size={20} />
              <h1 className="text-xl font-bold">Activities</h1>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
        <div className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                    <div className="h-16 bg-gray-800 rounded-2xl w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
              <p className="text-gray-400 mb-6 max-w-sm">
                Your transaction activity will appear here. Start by adding your first income or
                expense!
              </p>
            </div>
          )}

          {!isLoading &&
            transactions.length > 0 &&
            transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="animate-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SwipeableTransactionCard
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={(id: string) => {
                    setShowDeleteModal(id);
                    setDropdownOpen(null);
                  }}
                  onReply={handleReply}
                  formatTime={formatTime}
                  formatAmount={formatAmount}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  enableSwipe={true}
                  compact={false}
                />
              </div>
            ))}
        </div>
      </div>

      <BottomSheet
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Delete Transaction"
        subtitle="Are you sure you want to delete this transaction? This action cannot be undone."
      >
        <div className="flex space-x-3 mt-4">
          <button
            onClick={() => setShowDeleteModal(null)}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => showDeleteModal && handleDeleteTransaction(showDeleteModal)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </BottomSheet>

      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-40 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out border border-gray-700"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      <BottomNav />
    </div>
  );
}
