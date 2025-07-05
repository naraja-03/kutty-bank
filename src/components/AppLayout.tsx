'use client';

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../store';
import { openAddEntryModal, closeAddEntryModal } from '../store/slices/uiSlice';
import { useCreateTransactionMutation } from '../store/api/transactionApi';
import BottomNav from '../components/ui/BottomNav';
import AddEntryModal, { TransactionFormData } from '../components/ui/AddEntryModal';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const isAddEntryModalOpen = useTypedSelector(state => state.ui.isAddEntryModalOpen);
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();

  const handleAddClick = () => {
    dispatch(openAddEntryModal());
  };

  const handleCloseModal = () => {
    dispatch(closeAddEntryModal());
  };

  const handleSubmitTransaction = async (data: TransactionFormData) => {
    try {
      await createTransaction({
        amount: data.amount,
        category: data.category,
        type: data.type,
        note: data.note,
        date: data.date,
        // TODO: Handle image upload
      });
      dispatch(closeAddEntryModal());
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pb-20">
        {children}
      </main>
      
      <BottomNav onAddClick={handleAddClick} />
      
      <AddEntryModal
        isOpen={isAddEntryModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        isLoading={isLoading}
      />
    </div>
  );
}
