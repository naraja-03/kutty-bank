'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Home } from 'lucide-react';
import { Button, Input, CommonModal } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { FamilySetupData } from './FamilySetupContainer';

interface EssentialsStepProps {
  data: FamilySetupData;
  updateData: (data: Partial<FamilySetupData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const ESSENTIAL_CATEGORIES = [
  'Housing',
  'Food & Groceries',
  'Transportation',
  'Other'
];

export const EssentialsStep = ({ data, updateData, onNext, onPrev, isFirstStep }: EssentialsStepProps) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');

  const addCategory = () => {
    const categoryName = selectedCategory === 'Other' ? customCategory : selectedCategory;
    if (!categoryName || !amount) return;

    const newCategory = {
      id: Date.now().toString(),
      name: categoryName,
      amount: parseFloat(amount) || 0,
    };

    const updatedCategories = [...data.essentials.categories, newCategory];
    const totalEssentials = updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);

    updateData({
      essentials: {
        categories: updatedCategories,
        totalEssentials,
      },
    });

    // Reset form
    setSelectedCategory('');
    setCustomCategory('');
    setAmount('');
    setIsModalOpen(false);
  };

  const removeCategory = (id: string) => {
    const updatedCategories = data.essentials.categories.filter(cat => cat.id !== id);
    const totalEssentials = updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);

    updateData({
      essentials: {
        categories: updatedCategories,
        totalEssentials,
      },
    });
  };

  const canProceed = data.essentials.categories.length > 0;
  const totalIncome = data.income.totalIncome;
  const percentageUsed = totalIncome > 0 ? (data.essentials.totalEssentials / totalIncome) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full rounded-2xl p-6 lg:p-8 border-2 ${
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
          <br />
          <span className="text-orange-400 font-medium">Recommended: 50% of income</span>
        </p>
        {totalIncome > 0 && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-sm text-gray-300">
              Current total: <span className="text-white font-medium">${data.essentials.totalEssentials.toLocaleString()}</span>
              <span className="text-orange-400 ml-2">({percentageUsed.toFixed(1)}% of income)</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Recommended: ${(totalIncome * 0.5).toLocaleString()} (50%)
            </div>
          </div>
        )}
      </div>

      {/* Categories List */}
      <div className="space-y-4 mb-8">
        {data.essentials.categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div>
              <div className="text-white font-medium">{category.name}</div>
              <div className="text-gray-400 text-sm">Essential expense</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-orange-400 font-medium">
                ${category.amount.toLocaleString()}
              </div>
              <button
                onClick={() => removeCategory(category.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Category Button */}
      <div className="text-center mb-8">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Add Essential Expense
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          disabled={isFirstStep}
          className="order-2 sm:order-1"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="order-1 sm:order-2"
        >
          Continue
        </Button>
      </div>

      {/* Add Category Modal */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory('');
          setCustomCategory('');
          setAmount('');
        }}
        title="Add Essential Expense"
        size="sm"
      >
        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ESSENTIAL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedCategory === category
                      ? 'bg-orange-500/20 border-orange-400/50 text-orange-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monthly Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex space-x-3 pt-4 border-t border-white/10">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCategory('');
                setCustomCategory('');
                setAmount('');
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={addCategory}
              disabled={!selectedCategory || !amount || (selectedCategory === 'Other' && !customCategory)}
              className="flex-1"
            >
              Add
            </Button>
          </div>
        </div>
      </CommonModal>
    </motion.div>
  );
};
