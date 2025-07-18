'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Wallet, Target, Calendar, Filter, Plus, Hash } from 'lucide-react';
import { clsx } from 'clsx';
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from '../../../store/api/transactionApi';
import {
  openThreadSidebar,
  closeThreadSidebar,
  selectThreadFromList,
  ThreadPeriod,
} from '../../../store/slices/threadsSlice';
import { openEditEntryModal, openPeriodSelector } from '../../../store/slices/uiSlice';
import { setCurrentFamily, updateUser } from '../../../store/slices/authSlice';
import { RootState } from '../../../store';
import ThreadsHeader from '../ThreadsHeader';
import BottomNav from '../BottomNav';
import BottomSheet from '../BottomSheet';
import SwipeableTransactionCard from '../SwipeableTransactionCard';
import FamilyModal from '../FamilyModal';
import { DashboardProps, QuickAction } from './types';
import { calculateBudgetProgress, BudgetPeriod } from '../../../lib/budgetCalculations';
import { useCreateFamilyMutation } from '../../../store/api/familyApi';
import { useUpdateUserActiveFamilyMutation } from '../../../store/api/authApi';
import { useFamilyManager } from '../../../hooks/useFamilyManager';

const quickActions: QuickAction[] = [
  { id: 'income', label: 'Income', icon: TrendingUp, value: '₹0', color: 'green' },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown, value: '₹0', color: 'red' },
  { id: 'balance', label: 'Balance', icon: Wallet, value: '₹0', color: 'neutral' },
  { id: 'goal', label: 'Savings Goal', icon: Target, value: '₹0', color: 'purple' },
];

export default function Dashboard({ className }: DashboardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activeThread, allThreads, isThreadSidebarOpen } = useSelector(
    (state: RootState) => state.threads
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedPeriod] = useState<BudgetPeriod>('month');

  const {
    currentFamily,
    families,
    isLoading: familyLoading,
    needsFamilySelection,
    hasValidFamily,
  } = useFamilyManager();

  const [showFamilyModal, setShowFamilyModal] = useState(false);

  const currentBudgetId = activeThread?.isCustomBudget ? activeThread.budgetId : 'daily';

  const shouldFetchTransactions = hasValidFamily && !needsFamilySelection;

  const {
    data: transactionData,
    isLoading: transactionsLoading,
    refetch,
  } = useGetTransactionsQuery(
    {
      limit: 100,
      offset: 0,
      budgetId: currentBudgetId,
    },
    {
      skip: !shouldFetchTransactions,
    }
  );

  const { data: recentTransactionData } = useGetTransactionsQuery(
    {
      limit: 5,
      offset: 0,
      budgetId: currentBudgetId,
    },
    {
      skip: !shouldFetchTransactions,
    }
  );

  const [deleteTransaction] = useDeleteTransactionMutation();

  const [createFamily] = useCreateFamilyMutation();
  const [updateUserActiveFamily] = useUpdateUserActiveFamilyMutation();

  React.useEffect(() => {
    if (needsFamilySelection && !familyLoading) {
      setShowFamilyModal(true);
    } else {
      setShowFamilyModal(false);
    }
  }, [needsFamilySelection, familyLoading]);

  const budgetProgress = transactionData?.transactions
    ? calculateBudgetProgress(
        transactionData.transactions.map(t => ({
          id: t.id,
          amount: t.amount,
          type: t.type,
          createdAt: t.createdAt.toString(),
          category: t.category,
          note: t.note,
        })),
        selectedPeriod,
        10000
      )
    : {
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        progress: 0,
        isOverBudget: false,
      };

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const transactions = recentTransactionData?.transactions || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getUpdatedQuickActions = () => {
    return quickActions.map(action => {
      switch (action.id) {
        case 'income':
          return { ...action, value: formatCurrency(budgetProgress.totalIncome) };
        case 'expenses':
          return { ...action, value: formatCurrency(budgetProgress.totalExpenses) };
        case 'balance':
          return { ...action, value: formatCurrency(budgetProgress.netAmount) };
        case 'goal':
          return { ...action, value: formatCurrency(budgetProgress.totalIncome * 0.2) };
        default:
          return action;
      }
    });
  };

  const getSavingsProgress = () => {
    const monthlyIncome = budgetProgress.totalIncome;
    const monthlyExpense = budgetProgress.totalExpenses;
    const savingsGoal = monthlyIncome * 0.2;
    const actualSavings = monthlyIncome - monthlyExpense;

    if (savingsGoal === 0) return 0;
    return Math.min(Math.max((actualSavings / savingsGoal) * 100, 0), 100);
  };

  const handleEditTransaction = (id: string) => {
    const transaction = transactionData?.transactions.find(t => t.id === id);
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

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id).unwrap();
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

  const handleSelectFamily = async (familyId: string) => {
    try {
      dispatch(setCurrentFamily(familyId));
      dispatch(updateUser({ familyId }));

      if (user?.id) {
        await updateUserActiveFamily({ userId: user.id, familyId }).unwrap();
      }

      setShowFamilyModal(false);
    } catch (error) {
      console.error('Error updating active family:', error);

      setShowFamilyModal(false);
    }
  };

  const handleCreateFamily = async (familyData: {
    name: string;
    targetSavingPerMonth: number;
    members: Array<{
      email: string;
      name: string;
      role: 'admin' | 'member' | 'viewer';
    }>;
  }) => {
    try {
      const newFamily = await createFamily(familyData).unwrap();

      dispatch(setCurrentFamily(newFamily.id));
      dispatch(
        updateUser({
          familyId: newFamily.id,
          families: [...(user?.families || []), newFamily.id],
        })
      );

      if (user?.id) {
        await updateUserActiveFamily({ userId: user.id, familyId: newFamily.id }).unwrap();
      }

      setShowFamilyModal(false);
    } catch (error) {
      console.error('Error creating family:', error);
    }
  };

  const handleCloseFamilyModal = () => {
    if (currentFamily) {
      setShowFamilyModal(false);
    }
  };

  return (
    <div className={clsx('h-screen text-white flex flex-col', className)}>
      <ThreadsHeader
        title="Dashboard"
        onLeftAction={handleOpenThreadSidebar}
        activeThread={activeThread}
        showThreadSelector={true}
        onThreadSelectorClick={handleOpenPeriodSelector}
      />

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 pb-20 w-full">
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
                : 'Current Period'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {getUpdatedQuickActions().map(action => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className={clsx(
                  'bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl',
                  action.color === 'green' &&
                    'bg-gradient-to-br from-green-950/30 to-green-900/15 border-green-600/20',
                  action.color === 'red' &&
                    'bg-gradient-to-br from-red-950/30 to-red-900/15 border-red-600/20',
                  action.color === 'blue' &&
                    'bg-gradient-to-br from-blue-950/30 to-blue-900/15 border-blue-600/20',
                  action.color === 'neutral' &&
                    'bg-gradient-to-br from-slate-950/40 to-slate-800/20 border-slate-500/25',
                  action.color === 'purple' &&
                    'bg-gradient-to-br from-purple-950/30 to-purple-900/15 border-purple-600/20'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    size={20}
                    className={clsx(
                      action.color === 'green' && 'text-green-400',
                      action.color === 'red' && 'text-red-400',
                      action.color === 'blue' && 'text-blue-400',
                      action.color === 'neutral' && 'text-slate-300',
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

          {transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse"
                >
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
              {transactions.slice(0, 3).map(transaction => (
                <SwipeableTransactionCard
                  key={transaction.id}
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

      <BottomSheet
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Delete Transaction"
        subtitle="Are you sure you want to delete this transaction?"
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

      {showFamilyModal && (
        <FamilyModal
          isOpen={showFamilyModal}
          onClose={handleCloseFamilyModal}
          onSelectFamily={handleSelectFamily}
          onCreateFamily={handleCreateFamily}
          families={families}
          isLoading={familyLoading}
          canDismiss={!!currentFamily}
        />
      )}

      <BottomSheet
        isOpen={isThreadSidebarOpen}
        onClose={handleCloseThreadSidebar}
        title="Budget Periods"
        subtitle="Select time periods & ranges"
      >
        <div className="space-y-4">
          <button
            onClick={() => {
              console.log('New Custom Budget Period clicked');
            }}
            className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} />
            <span>New Custom Budget</span>
          </button>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Available Budget Periods
            </h3>

            {allThreads.map(thread => {
              const isActive = activeThread.id === thread.id;
              
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
                  <button onClick={() => handleSelectThread(thread)} className="w-full text-left">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {thread.value === 'week' && <Calendar size={16} className="text-blue-400" />}
                        {thread.value === 'month' && <Calendar size={16} className="text-green-400" />}
                        {thread.value === 'year' && <Calendar size={16} className="text-orange-400" />}
                        {thread.value === 'custom' && <Hash size={16} className="text-pink-400" />}
                        <span className="font-medium text-white">{thread.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>

                    <div className="text-xs text-gray-400 mb-2">
                      {thread.value === 'custom' && thread.startDate && thread.endDate
                        ? `${thread.startDate.toLocaleDateString()} - ${thread.endDate.toLocaleDateString()}`
                        : `${thread.value.charAt(0).toUpperCase() + thread.value.slice(1)} Period`}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      <BottomNav />
    </div>
  );
}
