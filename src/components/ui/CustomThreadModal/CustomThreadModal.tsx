'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomThreadModalProps, CustomThreadFormData } from './types';
import {
  createCustomThread,
  updateCustomThread,
  removeSavedThread,
} from '@/store/slices/threadsSlice';
import {
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} from '@/store/api/budgetsApi';
import { RootState } from '@/store';
import FormModal from '../FormModal';
import ConfirmationModal from '../ConfirmationModal';

export default function CustomThreadModal({
  isOpen,
  onClose,
  mode = 'create',
  threadData,
}: CustomThreadModalProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [createBudget, { isLoading: isCreating }] = useCreateBudgetMutation();
  const [updateBudget, { isLoading: isUpdating }] = useUpdateBudgetMutation();
  const [deleteBudget, { isLoading: isDeleting }] = useDeleteBudgetMutation();

  const [formData, setFormData] = useState<CustomThreadFormData>({
    name: '',
    description: '',
    targetAmount: 0,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && threadData) {
        setFormData(threadData);
      } else {
        setFormData({
          name: '',
          description: '',
          targetAmount: 0,
        });
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, mode, threadData]);

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (data: Record<string, string | number>) => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    try {
      const budgetData = {
        label: data.name as string,
        description: data.description as string,
        targetAmount: data.targetAmount as number,
        userId: currentUser.id,
        familyId: currentUser.familyId || '',
      };

      if (mode === 'edit' && threadData?.id) {
        await updateBudget({
          id: threadData.id,
          label: budgetData.label,
          description: budgetData.description,
          targetAmount: budgetData.targetAmount,
          userId: currentUser.id,
        }).unwrap();

        dispatch(
          updateCustomThread({
            id: threadData.id,
            label: budgetData.label,
            description: budgetData.description,
            targetAmount: budgetData.targetAmount,
          })
        );
      } else {
        await createBudget({
          label: budgetData.label,
          description: budgetData.description,
          targetAmount: budgetData.targetAmount,
          userId: currentUser.id,
          familyId: budgetData.familyId,
        }).unwrap();

        dispatch(
          createCustomThread({
            label: budgetData.label,
            description: budgetData.description,
            targetAmount: budgetData.targetAmount,
          })
        );
      }

      onClose();
    } catch (error) {
      console.error('Failed to save custom budget:', error);
    }
  };

  const handleDelete = async () => {
    if (!threadData?.id || !currentUser) return;

    try {
      await deleteBudget({
        id: threadData.id,
        userId: currentUser.id,
      }).unwrap();

      dispatch(removeSavedThread(threadData.id));
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <>
      <FormModal
        isOpen={isOpen && !showDeleteConfirm}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={mode === 'edit' ? 'Edit Custom Budget' : 'Create Custom Budget'}
        subtitle={
          mode === 'edit'
            ? 'Update your budget settings'
            : 'Create a personalized budget to track specific goals'
        }
        fields={[
          {
            id: 'name',
            label: 'Budget Name',
            type: 'text',
            value: formData.name,
            placeholder: 'e.g., Vacation Fund, New Car',
            required: true,
          },
          {
            id: 'description',
            label: 'Description',
            type: 'textarea',
            value: formData.description,
            placeholder: 'What is this budget for?',
            required: false,
          },
          {
            id: 'targetAmount',
            label: 'Target Amount (₹)',
            type: 'number',
            value: formData.targetAmount,
            placeholder: '50000',
            required: true,
          },
        ]}
        onFieldChange={handleFieldChange}
        submitText={mode === 'edit' ? 'Update Budget' : 'Create Budget'}
        isLoading={isLoading}
        showDeleteButton={mode === 'edit'}
        onDelete={() => setShowDeleteConfirm(true)}
      />

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Custom Budget"
        message={
          <div>
            <p className="mb-4">
              Are you sure you want to delete &quot;{threadData?.name}&quot;? This action cannot be
              undone and will permanently delete:
            </p>
            <ul className="text-sm space-y-1 text-left">
              <li>• All budget data and settings</li>
              <li>• All associated transactions</li>
              <li>• All progress tracking</li>
            </ul>
          </div>
        }
        confirmText="Delete Budget"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
