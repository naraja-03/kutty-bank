'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useGetTransactionsQuery, useDeleteTransactionMutation } from '../../../store/api/transactionApi';
import { 
//   setActiveThread, 
  openThreadSidebar, 
  closeThreadSidebar,
  selectThreadFromList,
  ThreadPeriod
} from '../../../store/slices/threadsSlice';
import { openEditEntryModal, openPeriodSelector } from '../../../store/slices/uiSlice';
import { setCurrentFamily, updateUser } from '../../../store/slices/authSlice';
import { RootState } from '../../../store';
import ThreadsHeader from '../ThreadsHeader';
import ThreadSidebar from '../ThreadSidebar';
import FamilyModal from '../FamilyModal';
import QuickActionsGrid from '../QuickActionsGrid';
import SavingsProgressCard from '../SavingsProgressCard';
import RecentTransactionsList from '../RecentTransactionsList';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import PeriodFilterHeader from '../PeriodFilterHeader';
import { DashboardProps } from './types';
import { 
  calculateBudgetProgress, 
  BudgetPeriod
} from '../../../lib/budgetCalculations';
import { formatAmount, formatCurrency, formatTime } from '../../../lib/formatters';
import { useCreateFamilyMutation } from '../../../store/api/familyApi';
import { useUpdateUserActiveFamilyMutation } from '../../../store/api/authApi';
import { useFamilyManager } from '../../../hooks/useFamilyManager';

export default function Dashboard({ className }: DashboardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { activeThread, allThreads, isThreadSidebarOpen } = useSelector((state: RootState) => state.threads);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedPeriod] = useState<BudgetPeriod>('month');
  
  // Use the family manager hook for professional family state management
  const {
    currentFamily,
    families,
    isLoading: familyLoading,
    needsFamilySelection,
    hasValidFamily
  } = useFamilyManager();
  
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  
  // Determine budgetId for filtering based on active thread
  const currentBudgetId = activeThread?.isCustomBudget ? activeThread.budgetId : 'daily';
  
  // Only call transaction APIs when family is selected
  const shouldFetchTransactions = hasValidFamily && !needsFamilySelection;
  
  // Get all transactions for calculations
  const { data: transactionData, isLoading: transactionsLoading, refetch } = useGetTransactionsQuery({ 
    limit: 100, // Get more transactions for accurate calculations
    offset: 0,
    budgetId: currentBudgetId
  }, {
    skip: !shouldFetchTransactions
  });

  // Get recent transactions for display
  const { data: recentTransactionData } = useGetTransactionsQuery({ 
    limit: 5, // Show only 5 transactions on dashboard
    offset: 0,
    budgetId: currentBudgetId
  }, {
    skip: !shouldFetchTransactions
  });

  const [deleteTransaction] = useDeleteTransactionMutation();

  const [createFamily] = useCreateFamilyMutation();
  const [updateUserActiveFamily] = useUpdateUserActiveFamilyMutation();
  
  // Show family modal when user needs family selection
  React.useEffect(() => {
    if (needsFamilySelection && !familyLoading) {
      setShowFamilyModal(true);
    } else {
      setShowFamilyModal(false);
    }
  }, [needsFamilySelection, familyLoading]);

  // Calculate budget progress using frontend logic
  const budgetProgress = transactionData?.transactions 
    ? calculateBudgetProgress(
        transactionData.transactions.map(t => ({
          id: t.id,
          amount: t.amount,
          type: t.type,
          createdAt: t.createdAt.toString(),
          category: t.category,
          note: t.note
        })),
        selectedPeriod,
        10000 // Default target amount - should come from family settings
      )
    : {
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        progress: 0,
        isOverBudget: false
      };

  // State for dropdown management
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Extract transactions array from the response
  const transactions = recentTransactionData?.transactions || [];

  // Calculate formatted values for quick actions
  const familySavingsTarget = currentFamily ? 
    (families.find(f => f.id === currentFamily)?.budgetCap || budgetProgress.totalIncome * 0.2) :
    budgetProgress.totalIncome * 0.2;

  const getSavingsProgress = () => {
    // Use family savings target or fallback to 20% of income
    const monthlyIncome = budgetProgress.totalIncome;
    const monthlyExpense = budgetProgress.totalExpenses;
    const familySavingsTarget = currentFamily ? 
      (families.find(f => f.id === currentFamily)?.budgetCap || monthlyIncome * 0.2) :
      monthlyIncome * 0.2;
    const actualSavings = monthlyIncome - monthlyExpense;
    
    if (familySavingsTarget === 0) return 0;
    return Math.min(Math.max((actualSavings / familySavingsTarget) * 100, 0), 100);
  };

  // Transaction handlers
  const handleEditTransaction = (id: string) => {
    // Find the transaction in the recent transactions
    const transaction = transactionData?.transactions.find(t => t.id === id);
    if (transaction) {
      dispatch(openEditEntryModal({
        id: transaction.id,
        amount: transaction.amount,
        date: new Date(transaction.createdAt).toISOString().split('T')[0],
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

  // Family modal handlers
  const handleSelectFamily = async (familyId: string) => {
    try {
      // Update Redux state immediately
      dispatch(setCurrentFamily(familyId));
      dispatch(updateUser({ familyId }));
      
      // Save to backend
      if (user?.id) {
        await updateUserActiveFamily({ userId: user.id, familyId }).unwrap();
      }
      
      setShowFamilyModal(false);
    } catch (error) {
      console.error('Error updating active family:', error);
      // Still close modal even if backend update fails (Redux state is updated)
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
      // Set the newly created family as current family
      dispatch(setCurrentFamily(newFamily.id));
      dispatch(updateUser({ 
        familyId: newFamily.id,
        families: [...(user?.families || []), newFamily.id]
      }));
      
      // Save to backend
      if (user?.id) {
        await updateUserActiveFamily({ userId: user.id, familyId: newFamily.id }).unwrap();
      }
      
      setShowFamilyModal(false);
    } catch (error) {
      console.error('Error creating family:', error);
    }
  };

  const handleCloseFamilyModal = () => {
    // Only allow closing if user has a valid family
    if (currentFamily) {
      setShowFamilyModal(false);
    }
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
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 pb-20 w-full main-container">
        {/* Time Filter */}
        <PeriodFilterHeader activeThread={activeThread} />

        {/* Quick Actions - Responsive Grid */}
        <QuickActionsGrid
          totalIncome={formatCurrency(budgetProgress.totalIncome)}
          totalExpenses={formatCurrency(budgetProgress.totalExpenses)}
          netAmount={formatCurrency(budgetProgress.netAmount)}
          savingsTarget={formatCurrency(familySavingsTarget)}
        />

        {/* Savings Progress */}
        <SavingsProgressCard progress={getSavingsProgress()} />

        {/* Recent Transactions */}
        <RecentTransactionsList
          transactions={transactions}
          isLoading={transactionsLoading}
          onEdit={handleEditTransaction}
          onDelete={(id: string) => {setShowDeleteModal(id); setDropdownOpen(null);}}
          onReply={handleReply}
          formatTime={formatTime}
          formatAmount={formatAmount}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          className="space-y-4"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => showDeleteModal && handleDeleteTransaction(showDeleteModal)}
      />

      {/* Family Setup Modal */}
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

      {/* Thread Sidebar */}
      <ThreadSidebar
        isOpen={isThreadSidebarOpen}
        onClose={handleCloseThreadSidebar}
        threads={allThreads}
        activeThread={activeThread}
        onThreadSelect={handleSelectThread}
      />
    </div>
  );
}
