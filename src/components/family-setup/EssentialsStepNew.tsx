'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Home } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useFamilySetup, CategoryItem } from '@/contexts/FamilySetupContext';
import { AvailableBalance } from './AvailableBalance';

interface EssentialsStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isOverBudget?: boolean;
  totalSpendingPercentage?: number;
}

const ESSENTIAL_CATEGORIES = [
  'Housing',
  'Food & Groceries',
  'Transportation',
  'Utilities',
  'Healthcare',
  'Other'
];

export const EssentialsStep = ({ onNext, onPrev, isFirstStep, isOverBudget, totalSpendingPercentage }: EssentialsStepProps) => {
  const { theme } = useTheme();
  const { formData, updateFormData } = useFamilySetup();
  const [selectedCategory, setSelectedCategory] = useState('Housing');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');

  const addEssential = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
    if (selectedCategory === 'Other' && !customCategory.trim()) return;

    // Check if category already exists
    const existingIndex = formData.essentials.categories.findIndex(
      (item: CategoryItem) => item.name === finalCategory
    );

    let updatedCategories;
    if (existingIndex >= 0) {
      // Update existing category
      updatedCategories = [...formData.essentials.categories];
      updatedCategories[existingIndex].amount += parseFloat(amount);
    } else {
      // Add new category
      const newCategory: CategoryItem = {
        id: Date.now().toString(),
        name: finalCategory,
        amount: parseFloat(amount),
      };
      updatedCategories = [...formData.essentials.categories, newCategory];
    }

    const totalEssentials = updatedCategories.reduce((sum: number, item: CategoryItem) => sum + item.amount, 0);

    updateFormData({
      essentials: {
        categories: updatedCategories,
        totalEssentials,
      },
    });

    setAmount('');
    setCustomCategory('');
  };

  const removeEssential = (id: string) => {
    const updatedCategories = formData.essentials.categories.filter((item: CategoryItem) => item.id !== id);
    const totalEssentials = updatedCategories.reduce((sum: number, item: CategoryItem) => sum + item.amount, 0);

    updateFormData({
      essentials: {
        categories: updatedCategories,
        totalEssentials,
      },
    });
  };

  const canProceed = !isOverBudget;
  const usedForEssentials = formData.essentials.totalEssentials;

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
            theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
          }`}>
            <Home size={32} className={`${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`} />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Essential Expenses
          </h2>
          <p className={`max-w-md mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Add your necessary monthly expenses like housing, food, and transportation.
          </p>
        </div>

        {/* Available Balance */}
        {formData.income.totalIncome > 0 && (
          <AvailableBalance
            totalIncome={formData.income.totalIncome}
            usedAmount={usedForEssentials}
            label="Essential expenses"
          />
        )}
        
        {/* Over Budget Warning */}
        {isOverBudget && totalSpendingPercentage && (
          <div className={`mt-4 p-4 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-red-900/20 border-red-500/30' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className={`text-sm font-medium ${
              theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}>
              ⚠️ Budget Exceeded: You&apos;re spending {totalSpendingPercentage.toFixed(1)}% of your income
            </div>
            <div className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              Please reduce your expenses to stay within your income limits.
            </div>
          </div>
        )}

        {/* Add Essential Form */}
        <div className={`border rounded-xl p-6 mb-6 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Add Essential Expense</h3>

          {/* Category Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ESSENTIAL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? theme === 'dark'
                        ? 'bg-orange-500 text-white border-2 border-orange-400'
                        : 'bg-orange-500 text-white border-2 border-orange-400'
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
                placeholder="Enter category name"
                className="w-full"
              />
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-4">
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
            />
          </div>

          <Button
            onClick={addEssential}
            disabled={
              !amount || 
              parseFloat(amount) <= 0 ||
              (selectedCategory === 'Other' && !customCategory.trim())
            }
            className={`w-full ${
              theme === 'dark'
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            Add Essential
          </Button>
        </div>

        {/* Essential Categories List */}
        {formData.essentials.categories.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Essential Expenses</h3>
            <div className="space-y-3">
              {formData.essentials.categories.map((essential: CategoryItem) => (
                <motion.div
                  key={essential.id}
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
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {essential.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      ₹{essential.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeEssential(essential.id)}
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
            disabled={isFirstStep}
            variant="outline"
            className="flex items-center"
          >
            ← Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!canProceed}
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
    </div>
  );
};
