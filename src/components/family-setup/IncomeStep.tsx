'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, IndianRupee } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useFamilySetup, IncomeSource } from '@/contexts/FamilySetupContext';

interface IncomeStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isOverBudget?: boolean;
  totalSpendingPercentage?: number;
}

const INCOME_CATEGORIES = [
  'Salary',
  'Business', 
  'Investment',
  'Other'
];

export const IncomeStep = ({ onNext, onPrev, isFirstStep }: IncomeStepProps) => {
  const { theme } = useTheme();
  const { formData, updateFormData } = useFamilySetup();
  const [selectedCategory, setSelectedCategory] = useState('Salary');
  const [customCategory, setCustomCategory] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');

  const addIncomeSource = () => {
    if (!source.trim() || !amount || parseFloat(amount) <= 0) return;

    const finalCategory = selectedCategory === 'Other' ? customCategory.trim() : selectedCategory;
    if (selectedCategory === 'Other' && !customCategory.trim()) return;

    const newSource = {
      id: Date.now().toString(),
      category: finalCategory,
      source: source.trim(),
      amount: parseFloat(amount),
    };

    const updatedSources = [...formData.income.sources, newSource];
    const totalIncome = updatedSources.reduce((sum, item) => sum + item.amount, 0);

    updateFormData({
      income: {
        sources: updatedSources,
        totalIncome,
      },
    });

    // Reset form
    setSource('');
    setAmount('');
    setCustomCategory('');
    setSelectedCategory('Salary');
  };

  const removeIncomeSource = (id: string) => {
    const updatedSources = formData.income.sources.filter((item: IncomeSource) => item.id !== id);
    const totalIncome = updatedSources.reduce((sum: number, item: IncomeSource) => sum + item.amount, 0);

    updateFormData({
      income: {
        sources: updatedSources,
        totalIncome,
      },
    });
  };

  const handleNext = () => {
    if (formData.income.totalIncome > 0) {
      onNext();
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 lg:p-8 mb-10 border-2 ${
          theme === 'dark'
            ? 'bg-gray-900/90 backdrop-blur-sm border-purple-500/30'
            : 'bg-white/90 backdrop-blur-sm border-purple-500/30'
        }`}
      >
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
          }`}>
            <IndianRupee className={`w-8 h-8 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Income Sources
          </h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Add your family&apos;s income sources
          </p>
        </div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border rounded-xl p-6 mb-6 ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Add New Income Source</h3>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {INCOME_CATEGORIES.map((category) => (
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
                    placeholder="e.g., Freelance, Gift, Rental"
                    className="w-full"
                    variant={theme === 'dark' ? 'default' : 'filled'}
                  />
                </div>
              )}

              {/* Source and Amount in same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Income Source *
                  </label>
                  <Input
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g., Raja Salary, Company ABC"
                    className="w-full"
                    variant={theme === 'dark' ? 'default' : 'filled'}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Amount *
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

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={addIncomeSource}
                  disabled={
                    !source.trim() || 
                    !amount || 
                    parseFloat(amount) <= 0 ||
                    (selectedCategory === 'Other' && !customCategory.trim())
                  }
                  className={`flex-1 ${
                    theme === 'dark'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Add Income
                </Button>
              </div>
            </div>
          </motion.div>

        {/* Income List */}
        {formData.income.sources.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Income Sources</h3>
            <div className="space-y-3">
              {formData.income.sources.map((income: IncomeSource) => (
                <motion.div
                  key={income.id}
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
                        {income.category}
                      </span>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{income.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ₹{income.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeIncomeSource(income.id)}
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

        {/* Total Income */}
        {formData.income.totalIncome > 0 && (
          <div className={`border rounded-xl p-4 mb-6 ${
            theme === 'dark'
              ? 'bg-green-500/20 border-green-400/30'
              : 'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                theme === 'dark' ? 'text-green-300' : 'text-green-700'
              }`}>Total Monthly Income:</span>
              <span className={`font-bold text-xl ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                ₹{formData.income.totalIncome.toLocaleString()}
              </span>
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
            onClick={handleNext}
            disabled={formData.income.totalIncome === 0}
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
