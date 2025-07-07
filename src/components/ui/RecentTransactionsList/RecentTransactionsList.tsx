'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import SwipeableTransactionCard from '../SwipeableTransactionCard';
import { RecentTransactionsListProps } from './types';

export default function RecentTransactionsList({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  onReply,
  formatTime,
  formatAmount,
  dropdownOpen,
  setDropdownOpen,
  className
}: RecentTransactionsListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p>No transactions yet</p>
        <p className="text-sm">Start tracking your expenses!</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Recent Transactions</h3>
        <button 
          onClick={() => router.push('/activity')}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 3).map((transaction) => (
          <SwipeableTransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            formatTime={formatTime}
            formatAmount={formatAmount}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            enableSwipe={true}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
}
