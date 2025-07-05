'use client';

import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Wallet, Target, Calendar, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useGetTransactionStatsQuery, useGetTransactionsQuery } from '../../../store/api/transactionApi';
import { 
//   setActiveThread, 
  openThreadSidebar, 
  closeThreadSidebar,
  openCustomThreadModal,
  closeCustomThreadModal,
  selectThreadFromList,
  createCustomThread,
  ThreadPeriod
} from '../../../store/slices/threadsSlice';
import { RootState } from '../../../store';
import TransactionPost from '../TransactionPost';
import ThreadsHeader from '../ThreadsHeader';
import ThreadSidebar from '../ThreadSidebar';
// import ThreadBottomBar from '../ThreadBottomBar';
import CustomThreadModal from '../CustomThreadModal';
import { DashboardProps, QuickAction } from './types';

const quickActions: QuickAction[] = [
  { id: 'income', label: 'Income', icon: TrendingUp, value: '₹0', color: 'green' },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown, value: '₹0', color: 'red' },
  { id: 'balance', label: 'Balance', icon: Wallet, value: '₹0', color: 'blue' },
  { id: 'goal', label: 'Savings Goal', icon: Target, value: '₹0', color: 'purple' },
];

export default function Dashboard({ className }: DashboardProps) {
  const dispatch = useDispatch();
  const { activeThread, allThreads, isThreadSidebarOpen, isCustomThreadModalOpen } = useSelector((state: RootState) => state.threads);
  
  const { data: stats, isLoading: statsLoading } = useGetTransactionStatsQuery();
  const { data: transactions, isLoading: transactionsLoading } = useGetTransactionsQuery({ 
    limit: 10, 
    offset: 0 
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUpdatedQuickActions = () => {
    if (!stats) return quickActions;
    
    return quickActions.map(action => {
      switch (action.id) {
        case 'income':
          return { ...action, value: formatCurrency(stats.monthlyIncome) };
        case 'expenses':
          return { ...action, value: formatCurrency(stats.monthlyExpenses) };
        case 'balance':
          return { ...action, value: formatCurrency(stats.balance) };
        case 'goal':
          return { ...action, value: formatCurrency(stats.balance * 0.2) }; // 20% of balance as goal
        default:
          return action;
      }
    });
  };

  const getSavingsProgress = () => {
    if (!stats) return 0;
    const goal = stats.balance * 0.2;
    return Math.min((stats.balance / goal) * 100, 100);
  };

//   const handleThreadChange = (thread: ThreadPeriod) => {
//     dispatch(setActiveThread(thread));
//   };

  const handleOpenThreadSidebar = () => {
    dispatch(openThreadSidebar());
  };

  const handleCloseThreadSidebar = () => {
    dispatch(closeThreadSidebar());
  };

  const handleOpenCustomThreadModal = () => {
    dispatch(openCustomThreadModal());
  };

  const handleCloseCustomThreadModal = () => {
    dispatch(closeCustomThreadModal());
  };

  const handleSelectThread = (thread: ThreadPeriod) => {
    dispatch(selectThreadFromList(thread.id));
    dispatch(closeThreadSidebar());
  };

  const handleCreateCustomThread = (label: string, startDate: Date, endDate: Date) => {
    dispatch(createCustomThread({ label, startDate, endDate }));
    dispatch(closeCustomThreadModal());
  };

  return (
    <div className={clsx('min-h-screen bg-black text-white', className)}>
      {/* Header */}
      <ThreadsHeader
        title="Dashboard"
        onLeftAction={handleOpenThreadSidebar}
        onRightAction={handleOpenCustomThreadModal}
        activeThread={activeThread}
        showThreadSelector={true}
        onThreadSelectorClick={handleOpenThreadSidebar}
      />

      {/* Main Content */}
      <div className="px-4 py-6 pb-40">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {getUpdatedQuickActions().map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                className="bg-gray-900 rounded-xl p-4 border border-gray-800"
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
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{action.value}</p>
                  <p className="text-gray-400 text-sm">{action.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings Progress */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center">
              <Target size={16} className="mr-2 text-purple-400" />
              Savings Progress
            </h3>
            <span className="text-sm text-gray-400">{getSavingsProgress()}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getSavingsProgress()}%` }}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              View All
            </button>
          </div>

          {statsLoading || transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <TransactionPost
                    userName={transaction.userName}
                    profileImage={transaction.profileImage}
                    amount={transaction.amount}
                    category={transaction.category}
                    timestamp={transaction.timestamp}
                    type={transaction.type}
                    note={transaction.note}
                    image={transaction.imageUrl}
                    className="!bg-transparent !border-none"
                  />
                </div>
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

      {/* Thread Sidebar */}
      <ThreadSidebar
        isOpen={isThreadSidebarOpen}
        onClose={handleCloseThreadSidebar}
        threads={allThreads}
        activeThread={activeThread}
        onThreadSelect={handleSelectThread}
        onNewThread={handleOpenCustomThreadModal}
      />

      {/* Custom Thread Modal */}
      <CustomThreadModal
        isOpen={isCustomThreadModalOpen}
        onClose={handleCloseCustomThreadModal}
        onCreateThread={handleCreateCustomThread}
      />

      {/* Thread Bottom Bar */}
      {/* <ThreadBottomBar
        activeThread={activeThread}
        onThreadChange={handleThreadChange}
        onCustomThread={handleOpenCustomThreadModal}
      /> */}
    </div>
  );
}
