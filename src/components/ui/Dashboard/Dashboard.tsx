'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Wallet, Target, Calendar, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useGetTransactionStatsQuery, useGetTransactionsQuery, useDeleteTransactionMutation } from '../../../store/api/transactionApi';
import { 
//   setActiveThread, 
  openThreadSidebar, 
  closeThreadSidebar,
  selectThreadFromList,
  ThreadPeriod
} from '../../../store/slices/threadsSlice';
import { openEditEntryModal, openPeriodSelector } from '../../../store/slices/uiSlice';
import { RootState } from '../../../store';
import ThreadsHeader from '../ThreadsHeader';
import ThreadSidebar from '../ThreadSidebar';
import BottomNav from '../BottomNav';
import SwipeableTransactionCard from '../SwipeableTransactionCard';
import { DashboardProps, QuickAction } from './types';

const quickActions: QuickAction[] = [
  { id: 'income', label: 'Income', icon: TrendingUp, value: '₹0', color: 'green' },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown, value: '₹0', color: 'red' },
  { id: 'balance', label: 'Balance', icon: Wallet, value: '₹0', color: 'blue' },
  { id: 'goal', label: 'Savings Goal', icon: Target, value: '₹0', color: 'purple' },
];

export default function Dashboard({ className }: DashboardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activeThread, allThreads, isThreadSidebarOpen } = useSelector((state: RootState) => state.threads);
  
  const { data: stats, isLoading: statsLoading } = useGetTransactionStatsQuery();
  const { data: transactionData, isLoading: transactionsLoading, refetch } = useGetTransactionsQuery({ 
    limit: 3, // Show only 3 transactions on dashboard
    offset: 0 
  });

  const [deleteTransaction] = useDeleteTransactionMutation();

  // State for dropdown management
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Extract transactions array from the response
  const transactions = transactionData?.transactions || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getUpdatedQuickActions = () => {
    if (!stats) return quickActions;
    
    return quickActions.map(action => {
      switch (action.id) {
        case 'income':
          return { ...action, value: formatCurrency(stats.monthlyIncome || 0) };
        case 'expenses':
          return { ...action, value: formatCurrency(stats.monthlyExpense || 0) };
        case 'balance':
          return { ...action, value: formatCurrency(stats.monthlyBalance || 0) };
        case 'goal':
          return { ...action, value: formatCurrency((stats.monthlyBalance || 0) * 0.2) }; // 20% of balance as goal
        default:
          return action;
      }
    });
  };

  const getSavingsProgress = () => {
    if (!stats) return 0;
    // Use a more realistic savings goal calculation
    const monthlyIncome = stats.monthlyIncome || 0;
    const monthlyExpense = stats.monthlyExpense || 0;
    const savingsGoal = monthlyIncome * 0.2; // 20% of income as savings goal
    const actualSavings = monthlyIncome - monthlyExpense;
    
    if (savingsGoal === 0) return 0;
    return Math.min(Math.max((actualSavings / savingsGoal) * 100, 0), 100);
  };

  // Transaction handlers
  const handleEditTransaction = (id: string) => {
    // Find the transaction in the recent transactions
    const transaction = transactionData?.transactions.find(t => t.id === id);
    if (transaction) {
      dispatch(openEditEntryModal({
        id: transaction.id,
        amount: transaction.amount,
        date: new Date(transaction.timestamp).toISOString().split('T')[0],
        category: transaction.category,
        type: transaction.type,
        note: transaction.note
      }));
    }
    setDropdownOpen(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id).unwrap();
      setShowDeleteModal(null);
      setDropdownOpen(null);
      refetch(); // Refresh the transactions list
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleReply = () => {
    // Navigate to messages tab
    router.push('/messages');
  };

//   const handleThreadChange = (thread: ThreadPeriod) => {
//     dispatch(setActiveThread(thread));
//   };

  const handleOpenThreadSidebar = () => {
    dispatch(openThreadSidebar());
  };

  const handleOpenPeriodSelector = () => {
    dispatch(openPeriodSelector());
  };

  const handleCloseThreadSidebar = () => {
    dispatch(closeThreadSidebar());
  };

  const handleSelectThread = (thread: ThreadPeriod) => {
    dispatch(selectThreadFromList(thread.id));
    dispatch(closeThreadSidebar());
  };

  return (
    <div className={clsx('h-screen text-white flex flex-col', className)}>
      {/* Header */}
      <ThreadsHeader
        title="Dashboard"
        onLeftAction={handleOpenThreadSidebar}
        activeThread={activeThread}
        showThreadSelector={true}
        onThreadSelectorClick={handleOpenPeriodSelector}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 pb-20 w-full">
        {/* Time Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-400">Filtered by</span>
            <span className="text-sm font-medium text-white">{activeThread.label}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar size={12} />
            <span>
              {activeThread.startDate && activeThread.endDate
                ? `${activeThread.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${activeThread.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'Current Period'
              }
            </span>
          </div>
        </div>

        {/* Quick Actions - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {getUpdatedQuickActions().map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className={clsx(
                  'bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl',
                  action.color === 'green' && 'bg-gradient-to-br from-green-950/30 to-green-900/15 border-green-600/20',
                  action.color === 'red' && 'bg-gradient-to-br from-red-950/30 to-red-900/15 border-red-600/20',
                  action.color === 'blue' && 'bg-gradient-to-br from-blue-950/30 to-blue-900/15 border-blue-600/20',
                  action.color === 'purple' && 'bg-gradient-to-br from-purple-950/30 to-purple-900/15 border-purple-600/20'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    size={20}
                    className={clsx(
                      action.color === 'green' && 'text-green-400',
                      action.color === 'red' && 'text-red-400',
                      action.color === 'blue' && 'text-blue-400',
                      action.color === 'purple' && 'text-purple-400'
                    )}
                  />
                  <span className="text-xs text-gray-400 font-medium">
                    {action.id === 'income' && '+12.5%'}
                    {action.id === 'expenses' && '-8.2%'}
                    {action.id === 'balance' && 'Available'}
                    {action.id === 'goal' && 'Target'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg md:text-xl font-bold text-white">{action.value}</p>
                  <p className="text-gray-400 text-xs md:text-sm">{action.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings Progress */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center text-white text-sm">
              <Target size={14} className="mr-2 text-purple-400" />
              Savings Progress
            </h3>
            <span className="text-xs text-gray-400">{getSavingsProgress().toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-purple-900 to-purple-800 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getSavingsProgress()}%` }}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Recent Transactions</h3>
            <button 
              onClick={() => router.push('/activity')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All
            </button>
          </div>

          {statsLoading || transactionsLoading ? (
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
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <SwipeableTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={(id: string) => setShowDeleteModal(id)}
                  onReply={handleReply}
                  formatTime={formatTime}
                  formatAmount={formatAmount}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  enableSwipe={true}
                  compact={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start tracking your expenses!</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Transaction</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTransaction(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thread Sidebar */}
      <ThreadSidebar
        isOpen={isThreadSidebarOpen}
        onClose={handleCloseThreadSidebar}
        threads={allThreads}
        activeThread={activeThread}
        onThreadSelect={handleSelectThread}
      />
      
      <BottomNav />
    </div>
  );
}
