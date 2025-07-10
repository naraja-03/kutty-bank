'use client';

import { useState, Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { X, IndianRupee, Calendar, Tag, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { RootState } from '@/store';
import { 
  AddEntryModalProps, 
  TransactionFormData, 
  EXPENSE_CATEGORIES, 
  INCOME_CATEGORIES 
} from './types';

export default function AddEntryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData
}: AddEntryModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'expense',
    budgetId: '',
    note: '',
    image: undefined
  });

  const isEditMode = !!editData;
  
  const { activeThread } = useSelector((state: RootState) => state.threads);

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
        image: undefined
      });
    } else {
      setFormData({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: 'expense',
        budgetId: budgetId || 'daily',
        note: '',
        image: undefined
      });
    }
  }, [editData, isOpen, activeThread]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || !formData.category) return;
    
    onSubmit(formData);
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
      image: undefined
    });
    onClose();
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md sm:max-w-lg lg:max-w-xl transform overflow-hidden rounded-2xl bg-black border border-gray-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all mx-4">
                {}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg sm:text-xl font-semibold text-white">
                    {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
                  >
                    <X size={20} />
                  </button>
                </div>

                {}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {}
                  <div className="flex bg-gray-900/95 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                      className={clsx(
                        'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                        formData.type === 'expense'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                      className={clsx(
                        'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                        formData.type === 'income'
                          ? 'bg-green-600 text-white'
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      Income
                    </button>
                  </div>

                  {}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Amount
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/95 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/95 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/95 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent appearance-none"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Note (Optional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900/95 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Add a note about this transaction..."
                      />
                    </div>
                  </div>

                  {}
                  {}

                  {}
                  <button
                    type="submit"
                    disabled={isLoading || formData.amount <= 0 || !formData.category}
                    className={clsx(
                      'w-full py-3 px-4 rounded-lg font-medium transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      formData.type === 'income'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    )}
                  >
                    {isLoading ? 
                      (isEditMode ? 'Updating...' : 'Adding...') : 
                      (isEditMode ? 
                        `Update ${formData.type === 'income' ? 'Income' : 'Expense'}` : 
                        `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`
                      )
                    }
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
