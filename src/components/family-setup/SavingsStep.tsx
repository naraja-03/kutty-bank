'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, PiggyBank, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { FamilySetupData } from './FamilySetupContainer';

interface SavingsStepProps {
  data: FamilySetupData;
  updateData: (data: Partial<FamilySetupData>) => void;
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

export const SavingsStep = ({ data, updateData, onNext, onPrev }: SavingsStepProps) => {
  const { theme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Bank');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');

  const addSavingsGoal = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
    if (selectedCategory === 'Other' && !customCategory.trim()) return;

    // Check if category already exists
    const existingIndex = data.savings.categories.findIndex(
      item => item.name === finalCategory
    );

    let updatedCategories;
    if (existingIndex >= 0) {
      // Update existing category
      updatedCategories = [...data.savings.categories];
      updatedCategories[existingIndex].amount += parseFloat(amount);
    } else {
      // Add new category
      const newCategory = {
        id: Date.now().toString(),
        name: finalCategory,
        amount: parseFloat(amount),
      };
      updatedCategories = [...data.savings.categories, newCategory];
    }

    const totalSavings = updatedCategories.reduce((sum, item) => sum + item.amount, 0);

    updateData({
      savings: {
        categories: updatedCategories,
        totalSavings,
        availableBalance: data.savings.availableBalance,
      },
    });

    setAmount('');
    setCustomCategory('');
    setShowAddModal(false);
  };

  const removeSavingsGoal = (id: string) => {
    const updatedCategories = data.savings.categories.filter(item => item.id !== id);
    const totalSavings = updatedCategories.reduce((sum, item) => sum + item.amount, 0);

    updateData({
      savings: {
        categories: updatedCategories,
        totalSavings,
        availableBalance: data.savings.availableBalance,
      },
    });
  };

  const savingsPercentage = data.income.totalIncome > 0 
    ? (data.savings.totalSavings / data.income.totalIncome) * 100 
    : 0;

  const availableForSavings = data.income.totalIncome - data.essentials.totalEssentials - data.commitments.totalCommitments;

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 lg:p-8 border-2 ${
          theme === 'dark'
            ? 'bg-gray-900/90 backdrop-blur-sm border-purple-500/30'
            : 'bg-white/90 backdrop-blur-sm border-purple-500/30'
        }`}
      >
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
          }`}>
            <PiggyBank className={`w-8 h-8 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Savings Goals
          </h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Plan your savings and investments (recommended: 20% of income)
          </p>
        </div>

        {/* Budget Status */}
        {data.income.totalIncome > 0 && (
          <div className={`border rounded-xl p-4 mb-6 ${
            theme === 'dark'
              ? 'bg-purple-500/20 border-purple-400/30'
              : 'bg-purple-50 border-purple-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Savings percentage:</span>
              <div className="text-right">
                <span className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {savingsPercentage.toFixed(1)}%
                </span>
                <span className={`ml-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>(Target: 20%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Available for savings:</span>
              <span className={`font-bold ${
                availableForSavings >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${availableForSavings.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Add Savings Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddModal(true)}
            className={`w-full ${
              theme === 'dark'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Add Savings Goal
          </Button>
        </div>

        {/* Savings List */}
        {data.savings.categories.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Savings Goals</h3>
            <div className="space-y-3">
              {data.savings.categories.map((savings) => (
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
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{savings.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      ${savings.amount.toLocaleString()}
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

        {/* Total Savings */}
        {data.savings.totalSavings > 0 && (
          <div className={`border rounded-xl p-4 mb-6 ${
            theme === 'dark'
              ? 'bg-purple-500/20 border-purple-400/30'
              : 'bg-purple-50 border-purple-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>Total Savings Goals:</span>
              <span className={`font-bold text-xl ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                ${data.savings.totalSavings.toLocaleString()}
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
            className={`flex items-center ${
              theme === 'dark'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Next →
          </Button>
        </div>
      </motion.div>

      {/* Add Savings Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Add Savings Goal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SAVINGS_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? theme === 'dark'
                            ? 'bg-purple-500 text-white border-2 border-purple-400'
                            : 'bg-purple-500 text-white border-2 border-purple-400'
                          : theme === 'dark'
                            ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-2 border-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
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
                    Custom Category *
                  </label>
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g., Emergency Fund, Retirement, Stocks"
                    className="w-full"
                    variant={theme === 'dark' ? 'default' : 'filled'}
                  />
                </div>
              )}

              {/* Amount Input */}
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
                {availableForSavings > 0 && (
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Available: ${availableForSavings.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addSavingsGoal}
                  disabled={
                    !amount || 
                    parseFloat(amount) <= 0 ||
                    (selectedCategory === 'Other' && !customCategory.trim())
                  }
                  className={`flex-1 ${
                    theme === 'dark'
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  Add
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
