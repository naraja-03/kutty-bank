'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, PiggyBank } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useFamilySetup, CategoryItem } from '@/contexts/FamilySetupContext';
import { AvailableBalance } from './AvailableBalance';

interface SavingsStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const SAVINGS_CATEGORIES = [
  'Bank',
  'Gold', 
  'Investment',
  'Other'
];

export const SavingsStep = ({ onNext, onPrev }: SavingsStepProps) => {
  const { theme } = useTheme();
  const { formData, updateFormData, budget } = useFamilySetup();
  const [selectedCategory, setSelectedCategory] = useState('Bank');
  const [customCategory, setCustomCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('');

  const addSavingsGoal = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
    if (selectedCategory === 'Other' && !customCategory.trim()) return;

    // Use category name if provided, otherwise use the selected category
    const displayName = categoryName.trim() || finalCategory;

    // Check if category already exists
    const existingIndex = formData.savings.categories.findIndex(
      (item: CategoryItem) => item.name === displayName
    );

    let updatedCategories;
    if (existingIndex >= 0) {
      // Update existing category
      updatedCategories = [...formData.savings.categories];
      updatedCategories[existingIndex].amount += parseFloat(amount);
    } else {
      // Add new category
      const newCategory: CategoryItem = {
        id: Date.now().toString(),
        name: displayName,
        amount: parseFloat(amount),
      };
      updatedCategories = [...formData.savings.categories, newCategory];
    }

    const totalSavings = updatedCategories.reduce((sum: number, item: CategoryItem) => sum + item.amount, 0);

    updateFormData({
      savings: {
        categories: updatedCategories,
        totalSavings,
        availableBalance: formData.savings.availableBalance,
      },
    });

    setAmount('');
    setCustomCategory('');
    setCategoryName('');
  };

  const removeSavingsGoal = (id: string) => {
    const updatedCategories = formData.savings.categories.filter((item: CategoryItem) => item.id !== id);
    const totalSavings = updatedCategories.reduce((sum: number, item: CategoryItem) => sum + item.amount, 0);

    updateFormData({
      savings: {
        categories: updatedCategories,
        totalSavings,
        availableBalance: formData.savings.availableBalance,
      },
    });
  };

  // Check if all available balance is allocated
  const availableBalance = budget.totalIncome - formData.essentials.totalEssentials - formData.commitments.totalCommitments - formData.savings.totalSavings;
  const canProceed = availableBalance <= 0;

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
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
          }`}>
            <PiggyBank size={32} className={`${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Savings Goals
          </h2>
          <p className={`max-w-md mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Plan your savings and investments. You must allocate all remaining balance to proceed.
          </p>
        </div>

        {/* Available Balance */}
        {budget.totalIncome > 0 && (
          <AvailableBalance 
            totalIncome={budget.totalIncome}
            usedAmount={formData.essentials.totalEssentials + formData.commitments.totalCommitments + formData.savings.totalSavings}
            label="allocated to savings"
          />
        )}

        {/* Budget Allocation Warning */}
        {availableBalance > 0 && (
          <div className={`mt-4 p-4 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-yellow-900/20 border-yellow-500/30' 
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              ⚠️ Remaining Balance: ₹{availableBalance.toLocaleString()}
            </div>
            <div className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              Please allocate all remaining income to savings goals before proceeding.
            </div>
          </div>
        )}

        {/* Add Savings Form */}
        <div className={`border rounded-xl p-6 mb-6 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Add Savings Goal</h3>

          {/* Category Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAVINGS_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? theme === 'dark'
                        ? 'bg-purple-500 text-white border-2 border-purple-400'
                        : 'bg-purple-500 text-white border-2 border-purple-400'
                      : theme === 'dark'
                        ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-2 border-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Category Input */}
          {selectedCategory === 'Other' && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Custom Category Name
              </label>
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Emergency Fund, Retirement, Stocks"
                className="w-full"
              />
            </div>
          )}

          {/* Category Name and Amount Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                Amount (₹)
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
            onClick={addSavingsGoal}
            disabled={
              !amount || 
              parseFloat(amount) <= 0 ||
              (selectedCategory === 'Other' && !customCategory.trim())
            }
            className={`w-full ${
              theme === 'dark'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Add Savings Goal
          </Button>
        </div>

        {/* Savings Goals List */}
        {formData.savings.categories.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Savings Goals</h3>
            <div className="space-y-3">
              {formData.savings.categories.map((savings: CategoryItem) => (
                <motion.div
                  key={savings.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-lg p-4 flex items-center justify-between ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded mb-1 sm:mb-0 w-fit ${
                        theme === 'dark'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {savings.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      ₹{savings.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeSavingsGoal(savings.id)}
                      className={`transition-colors ${
                        theme === 'dark'
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-red-500 hover:text-red-400'
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
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
            disabled={!canProceed}
            className={`flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
              !canProceed ? 'cursor-not-allowed' : ''
            } ${
              theme === 'dark'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Next →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
