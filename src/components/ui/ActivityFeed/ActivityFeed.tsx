'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useGetTransactionsQuery } from '../../../store/api/transactionApi';
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
import { ActivityFeedProps } from './types';

export default function ActivityFeed({ className }: ActivityFeedProps) {
  const dispatch = useDispatch();
  const { activeThread, allThreads, isThreadSidebarOpen, isCustomThreadModalOpen } = useSelector((state: RootState) => state.threads);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [limit, setLimit] = useState(20);
  
  const { 
    data: transactions, 
    isLoading, 
    error, 
    refetch 
  } = useGetTransactionsQuery({ limit, offset: 0 });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMore = () => {
    setLimit(prev => prev + 20);
  };

  // Simulate real-time updates (in a real app, this would be Firebase)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isRefreshing) {
        refetch();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isLoading, isRefreshing, refetch]);

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
        title="Activity"
        onLeftAction={handleOpenThreadSidebar}
        onRightAction={handleOpenCustomThreadModal}
        activeThread={activeThread}
        showThreadSelector={true}
        onThreadSelectorClick={handleOpenThreadSidebar}
      />

      {/* Content */}
      <div className="pb-40">
        {/* Refresh Button */}
        <div className="px-4 py-4 border-b border-gray-800">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50',
              isRefreshing && 'cursor-not-allowed'
            )}
          >
            <RefreshCw
              size={16}
              className={clsx(
                'text-gray-400',
                isRefreshing && 'animate-spin'
              )}
            />
            <span className="text-sm text-gray-300">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>

        {/* Activity Feed */}
        {isLoading && !transactions ? (
          <div className="space-y-4 px-4 py-6">
            {[...Array(10)].map((_, i) => (
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
        ) : error ? (
          <div className="text-center py-8 text-red-400">
            <p>Error loading transactions</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-2 px-4 py-2">
            {transactions.map((transaction) => (
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
            
            {/* Load More Button */}
            {transactions.length >= limit && (
              <div className="text-center py-4">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Activity size={48} className="mx-auto mb-4 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Your activity feed will appear here</p>
          </div>
        )}
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
