'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAnonymousGuard } from '@/hooks/useAnonymousGuard';
import BottomSheet from '../BottomSheet';
import {
  AddEntryModalProps,
  TransactionFormData,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from './types';

export default function AddEntryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData,
}: AddEntryModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'expense',
    budgetId: '',
    note: '',
    image: undefined,
  });

  const isEditMode = !!editData;
  const { activeThread } = useSelector((state: RootState) => state.threads);
  const { requireAuth } = useAnonymousGuard();

  useEffect(() => {
    const budgetId = activeThread?.isCustomBudget ? activeThread.budgetId : 'daily';

    if (editData) {
      setFormData({
        amount: editData.amount,
        date: editData.date,
        category: editData.category,
        type: editData.type,
        budgetId: budgetId || 'daily',
        note: editData.note || '',
        image: undefined,
      });
    } else {
      setFormData({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: 'expense',
        budgetId: budgetId || 'daily',
        note: '',
        image: undefined,
      });
    }
  }, [editData, isOpen, activeThread]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || !formData.category) return;
    
    // Check if user needs to sign in to save transactions
    requireAuth(
      () => onSubmit(formData),
      'You need to sign in to save transactions. Sign in now?'
    );
  };

  const handleClose = () => {
    if (isLoading) return;
    const budgetId = activeThread?.isCustomBudget ? activeThread.budgetId : 'daily';

    setFormData({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: '',
      type: 'expense',
      budgetId: budgetId || 'daily',
      note: '',
      image: undefined,
    });
    onClose();
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Transaction' : 'Add Transaction'}
      maxHeight="max-h-[90vh]"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              formData.type === 'expense'
                ? 'bg-red-500/80 border border-red-400/40 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              formData.type === 'income'
                ? 'bg-green-500/80 border border-green-400/40 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              ₹
            </span>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
              }
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Category</label>
          <select
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 appearance-none"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value} className="bg-gray-900">
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">Note (Optional)</label>
          <textarea
            value={formData.note}
            onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 resize-none"
            rows={3}
            placeholder="Add a note about this transaction..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || formData.amount <= 0 || !formData.category}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border ${
            formData.type === 'income'
              ? 'bg-green-500/80 border-green-400/40 hover:bg-green-500/90 text-white'
              : 'bg-red-500/80 border-red-400/40 hover:bg-red-500/90 text-white'
          }`}
        >
          {isLoading
            ? isEditMode
              ? 'Updating...'
              : 'Adding...'
            : isEditMode
              ? `Update ${formData.type === 'income' ? 'Income' : 'Expense'}`
              : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </BottomSheet>
  );
}
