'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, CreditCard } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useFamilySetup, CategoryItem } from '@/contexts/FamilySetupContext';
import { AvailableBalance } from './AvailableBalance';

interface CommitmentsStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const COMMITMENT_CATEGORIES = [
  'Loan EMI',
  'Health Insurance',
  'Life Insurance',
  'Subscriptions',
  'Credit Card',
  'Education',
  'Investments',
  'Other'
];

export const CommitmentsStep = ({ onNext, onPrev }: CommitmentsStepProps) => {
  const { theme } = useTheme();
  const { formData, updateFormData, budget } = useFamilySetup();
  const [selectedCategory, setSelectedCategory] = useState('Loan EMI');
  const [customCategory, setCustomCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('');

  const addCommitment = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
    if (selectedCategory === 'Other' && !customCategory.trim()) return;

    // Use category name if provided, otherwise use the selected category
    const displayName = categoryName.trim() || finalCategory;

    // Check if category already exists
    const existingIndex = formData.commitments.categories.findIndex(
      (item: CategoryItem) => item.name === displayName
    );

    let updatedCategories;
    if (existingIndex >= 0) {
      // Update existing category
      updatedCategories = [...formData.commitments.categories];
      updatedCategories[existingIndex].amount += parseFloat(amount);
    } else {
      // Add new category
      const newCategory: CategoryItem = {
        id: Date.now().toString(),
        name: displayName,
        amount: parseFloat(amount),
      };
      updatedCategories = [...formData.commitments.categories, newCategory];
    }

    const totalCommitments = updatedCategories.reduce((sum: number, item: CategoryItem) => sum + item.amount, 0);

    updateFormData({
      commitments: {
        categories: updatedCategories,
        totalCommitments,
      },
    });

    setAmount('');
    setCustomCategory('');
    setCategoryName('');
  };

  const removeCommitment = (id: string) => {
    const updatedCategories = formData.commitments.categories.filter((item: CategoryItem) => item.id !== id);
    const totalCommitments = updatedCategories.reduce((sum: number, item: CategoryItem) => sum + item.amount, 0);

    updateFormData({
      commitments: {
        categories: updatedCategories,
        totalCommitments,
      },
    });
  };

  return (
    <div className="max-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 lg:p-8 mb-10 border-2 ${
          theme === 'dark'
            ? 'bg-gray-900/90 backdrop-blur-sm border-purple-500/30'
            : 'bg-white/90 backdrop-blur-sm border-purple-500/30'
        }`}
      >
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
          }`}>
            <CreditCard className={`w-8 h-8 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Commitments
          </h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Add your fixed monthly commitments
          </p>
        </div>

        {/* Available Balance */}
        {budget.totalIncome > 0 && (
          <AvailableBalance
            totalIncome={budget.totalIncome}
            usedAmount={formData.essentials.totalEssentials + formData.commitments.totalCommitments}
            label="Commitment expenses"
          />
        )}

        {/* Add Commitment Form */}
        <div className={`rounded-xl p-6 mb-6 space-y-4 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Add Commitment</h3>
          
          {/* Category Selection */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {COMMITMENT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? theme === 'dark'
                        ? 'bg-red-500 text-white border-2 border-red-400'
                        : 'bg-red-500 text-white border-2 border-red-400'
                      : theme === 'dark'
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-2 border-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Custom Category Input */}
            {selectedCategory === 'Other' && (
              <div className="mt-3">
                <Input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="w-full"
                  variant={theme === 'dark' ? 'default' : 'filled'}
                />
              </div>
            )}
          </div>

          {/* Category Name and Amount Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Category Name (Optional)
              </label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder={`e.g., ${selectedCategory === 'Other' ? customCategory || 'Custom name' : selectedCategory} details`}
                className="w-full"
                variant={theme === 'dark' ? 'default' : 'filled'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Monthly Amount *
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full"
                variant={theme === 'dark' ? 'default' : 'filled'}
              />
            </div>
          </div>

          <Button
            onClick={addCommitment}
            disabled={
              !amount || 
              parseFloat(amount) <= 0 || 
              (selectedCategory === 'Other' && !customCategory.trim())
            }
            className={`w-full ${
              theme === 'dark'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Add Commitment
          </Button>
        </div>

        {/* Commitments List */}
        {formData.commitments.categories.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Commitments</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {formData.commitments.categories.map((commitment: CategoryItem) => (
                <motion.div
                  key={commitment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-lg p-4 flex items-center justify-between ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-white font-medium">{commitment.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-red-400 font-bold text-lg">
                      ${commitment.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeCommitment(commitment.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Total Commitments */}
        {formData.commitments.totalCommitments > 0 && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-red-300 font-medium">Total Commitments:</span>
              <span className="text-red-400 font-bold text-xl">
                ₹{formData.commitments.totalCommitments.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={onPrev}
            variant="outline"
            className="flex items-center"
          >
            ← Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={budget.isOverBudget}
            className="flex items-center bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
