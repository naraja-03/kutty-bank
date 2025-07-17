'use client';

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '../store';
import {
  closeAddEntryModal,
  closeCustomBudgetModal,
  closePeriodSelector,
} from '../store/slices/uiSlice';
import { setPeriodFromSelector } from '../store/slices/threadsSlice';
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from '../store/api/transactionApi';
import AddEntryModal, { TransactionFormData } from './ui/AddEntryModal';
import CustomThreadModal from './ui/CustomThreadModal';
import PeriodSelector from './ui/PeriodSelector';
import GradientBackground from './ui/GradientBackground';
import AuthGuard from './AuthGuard';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isAddEntryModalOpen = useTypedSelector(state => state.ui.isAddEntryModalOpen);
  const editTransactionData = useTypedSelector(state => state.ui.editTransactionData);
  const isCustomBudgetModalOpen = useTypedSelector(state => state.ui.isCustomBudgetModalOpen);
  const customBudgetMode = useTypedSelector(state => state.ui.customBudgetMode);
  const customBudgetEditData = useTypedSelector(state => state.ui.customBudgetEditData);
  const isPeriodSelectorOpen = useTypedSelector(state => state.ui.isPeriodSelectorOpen);
  const currentUser = useTypedSelector(state => state.auth.user);
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  const publicPaths = ['/login', '/register'];
  const isPublicPage = publicPaths.includes(pathname);

  const getGradientVariant = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'dashboard';
    if (pathname === '/activity') return 'activity';
    if (pathname === '/family') return 'family';
    if (pathname === '/messages') return 'messages';
    if (pathname === '/login') return 'login';
    if (pathname === '/register') return 'register';
    return 'default';
  };

  const isEditMode = !!editTransactionData;
  const isLoading = isCreating || isUpdating;

  const handleSubmitTransaction = async (data: TransactionFormData) => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    try {
      if (isEditMode && editTransactionData) {
        await updateTransaction({
          id: editTransactionData.id,
          data: {
            amount: data.amount,
            category: data.category,
            type: data.type,
            note: data.note,
          },
        });
      } else {
        await createTransaction({
          amount: data.amount,
          category: data.category,
          type: data.type,
          userId: currentUser.id,
          budgetId: data.budgetId,
          note: data.note,
          date: data.date,
        });
      }
      dispatch(closeAddEntryModal());
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handlePeriodSelect = (period: {
    id: string;
    label: string;
    date: Date;
    value: number;
    isUnderControl: boolean;
    isActive: boolean;
  }) => {
    console.log('Selected period:', period);

    dispatch(
      setPeriodFromSelector({
        label: period.label,
        date: period.date,
        type: 'month' as const,
      })
    );

    dispatch(closePeriodSelector());
  };

  return (
    <>
      {isPublicPage ? (
        <GradientBackground variant="default">
          <div className="relative z-10 min-h-screen">{children}</div>
        </GradientBackground>
      ) : (
        <AuthGuard>
          <GradientBackground variant={getGradientVariant()}>
            <div className="relative z-10 min-h-screen">{children}</div>

            <AddEntryModal
              isOpen={isAddEntryModalOpen}
              onClose={() => dispatch(closeAddEntryModal())}
              onSubmit={handleSubmitTransaction}
              isLoading={isLoading}
              editData={editTransactionData || undefined}
            />

            <CustomThreadModal
              isOpen={isCustomBudgetModalOpen}
              onClose={() => dispatch(closeCustomBudgetModal())}
              mode={customBudgetMode}
              threadData={customBudgetEditData || undefined}
            />

            <PeriodSelector
              isOpen={isPeriodSelectorOpen}
              onClose={() => dispatch(closePeriodSelector())}
              onPeriodSelect={handlePeriodSelect}
            />
          </GradientBackground>
        </AuthGuard>
      )}
    </>
  );
}
