'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, CreditCard } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { FamilySetupData } from './FamilySetupContainer';

interface CommitmentsStepProps {
  data: FamilySetupData;
  updateData: (data: Partial<FamilySetupData>) => void;
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

export const CommitmentsStep = ({ data, updateData, onNext, onPrev }: CommitmentsStepProps) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Loan EMI');
  const [amount, setAmount] = useState('');

  const addCommitment = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Check if category already exists
    const existingIndex = data.commitments.categories.findIndex(
      item => item.name === selectedCategory
    );

    let updatedCategories;
    if (existingIndex >= 0) {
      // Update existing category
      updatedCategories = [...data.commitments.categories];
      updatedCategories[existingIndex].amount += parseFloat(amount);
    } else {
      // Add new category
      const newCategory = {
        id: Date.now().toString(),
        name: selectedCategory,
        amount: parseFloat(amount),
      };
      updatedCategories = [...data.commitments.categories, newCategory];
    }

    const totalCommitments = updatedCategories.reduce((sum, item) => sum + item.amount, 0);

    updateData({
      commitments: {
        categories: updatedCategories,
        totalCommitments,
      },
    });

    setAmount('');
  };

  const removeCommitment = (id: string) => {
    const updatedCategories = data.commitments.categories.filter(item => item.id !== id);
    const totalCommitments = updatedCategories.reduce((sum, item) => sum + item.amount, 0);

    updateData({
      commitments: {
        categories: updatedCategories,
        totalCommitments,
      },
    });
  };

  const commitmentPercentage = data.income.totalIncome > 0 
    ? (data.commitments.totalCommitments / data.income.totalIncome) * 100 
    : 0;

  const isOverBudget = commitmentPercentage > 30;

  return (
    <div className="max-h-screen overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 lg:p-8 border-2 ${
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
            Add your fixed monthly commitments (recommended: 30% of income)
          </p>
        </div>

        {/* Budget Status */}
        {data.income.totalIncome > 0 && (
          <div className={`border rounded-xl p-4 mb-6 ${
            isOverBudget 
              ? theme === 'dark'
                ? 'bg-red-500/20 border-red-400/30'
                : 'bg-red-50 border-red-300'
              : theme === 'dark'
                ? 'bg-orange-500/20 border-orange-400/30'
                : 'bg-orange-50 border-orange-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Commitment expenses:</span>
              <div className="text-right">
                <span className={`font-bold text-lg ${
                  isOverBudget 
                    ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    : theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {commitmentPercentage.toFixed(1)}%
                </span>
                <span className="text-gray-400 ml-2">(Target: 30%)</span>
              </div>
            </div>
          </div>
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
          </div>

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
          </div>

          <Button
            onClick={addCommitment}
            disabled={!amount || parseFloat(amount) <= 0}
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
        {data.commitments.categories.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Commitments</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.commitments.categories.map((commitment) => (
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
        {data.commitments.totalCommitments > 0 && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-red-300 font-medium">Total Commitments:</span>
              <span className="text-red-400 font-bold text-xl">
                ${data.commitments.totalCommitments.toLocaleString()}
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
            className="flex items-center bg-purple-500 hover:bg-purple-600"
          >
            Next →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
