'use client';

import { useState } from 'react';
import { Button, Input, CommonModal } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: string, amount: number) => void;
  title: string;
  categories: string[];
  amountLabel?: string;
  categoryLabel?: string;
}

export const ExpenseModal = ({
  isOpen,
  onClose,
  onAdd,
  title,
  categories,
  amountLabel = "Monthly Amount",
  categoryLabel = "Category"
}: ExpenseModalProps) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const categoryName = selectedCategory === 'Other' ? customCategory : selectedCategory;
    if (!categoryName || !amount) return;

    onAdd(categoryName, parseFloat(amount) || 0);

    // Reset form
    setSelectedCategory('');
    setCustomCategory('');
    setAmount('');
    onClose();
  };

  const handleClose = () => {
    setSelectedCategory('');
    setCustomCategory('');
    setAmount('');
    onClose();
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {categoryLabel}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-xl border transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300'
                    : theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Category Input */}
        {selectedCategory === 'Other' && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Custom Category Name
            </label>
            <Input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {amountLabel}
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ₹
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="pl-8"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className={`flex space-x-3 pt-4 border-t ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <Button
            onClick={handleClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedCategory || !amount || (selectedCategory === 'Other' && !customCategory)}
            className="flex-1"
          >
            Add
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
