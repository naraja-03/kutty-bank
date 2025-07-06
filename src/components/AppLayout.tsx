'use client';

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '../store';
import { closeAddEntryModal, closeCustomThreadModal } from '../store/slices/uiSlice';
import { useCreateTransactionMutation, useUpdateTransactionMutation } from '../store/api/transactionApi';
import AddEntryModal, { TransactionFormData } from '../components/ui/AddEntryModal';
import CustomThreadModal from '../components/ui/CustomThreadModal';
import GradientBackground from '../components/ui/GradientBackground';
import AuthGuard from './AuthGuard';
import PWARegister from './PWARegister';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isAddEntryModalOpen = useTypedSelector(state => state.ui.isAddEntryModalOpen);
  const editTransactionData = useTypedSelector(state => state.ui.editTransactionData);
  const isCustomThreadModalOpen = useTypedSelector(state => state.ui.isCustomThreadModalOpen);
  const customThreadMode = useTypedSelector(state => state.ui.customThreadMode);
  const customThreadEditData = useTypedSelector(state => state.ui.customThreadEditData);
  const currentUser = useTypedSelector(state => state.auth.user);
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();

  // Public pages that don't require authentication
  const publicPaths = ['/login', '/register'];
  const isPublicPage = publicPaths.includes(pathname);

  // Get gradient variant based on current path
  const getGradientVariant = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'dashboard';
    if (pathname === '/activity') return 'activity';
    if (pathname === '/family') return 'family';
    if (pathname === '/messages') return 'messages';
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
        // Update existing transaction
        await updateTransaction({
          id: editTransactionData.id,
          data: {
            amount: data.amount,
            category: data.category,
            type: data.type,
            note: data.note,
          }
        });
      } else {
        // Create new transaction
        await createTransaction({
          amount: data.amount,
          category: data.category,
          type: data.type,
          userId: currentUser.id,
          note: data.note,
          date: data.date,
        });
      }
      dispatch(closeAddEntryModal());
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  return (
    <>
      <PWARegister />
      {isPublicPage ? (
        <GradientBackground variant="default">
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </GradientBackground>
      ) : (
        <AuthGuard>
          <GradientBackground variant={getGradientVariant()}>
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
            
            {/* Global Modals */}
            <AddEntryModal
              isOpen={isAddEntryModalOpen}
              onClose={() => dispatch(closeAddEntryModal())}
              onSubmit={handleSubmitTransaction}
              isLoading={isLoading}
              editData={editTransactionData || undefined}
            />
            
            <CustomThreadModal
              isOpen={isCustomThreadModalOpen}
              onClose={() => dispatch(closeCustomThreadModal())}
              mode={customThreadMode}
              threadData={customThreadEditData || undefined}
            />
          </GradientBackground>
        </AuthGuard>
      )}
    </>
  );
}