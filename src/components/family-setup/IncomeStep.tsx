'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, DollarSign, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { FamilySetupData } from './FamilySetupContainer';

interface IncomeStepProps {
  data: FamilySetupData;
  updateData: (data: Partial<FamilySetupData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const INCOME_CATEGORIES = [
  'Salary',
  'Business', 
  'Investment',
  'Other'
];

export const IncomeStep = ({ data, updateData, onNext, onPrev, isFirstStep }: IncomeStepProps) => {
  const { theme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
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

    const updatedSources = [...data.income.sources, newSource];
    const totalIncome = updatedSources.reduce((sum, item) => sum + item.amount, 0);

    updateData({
      income: {
        sources: updatedSources,
        totalIncome,
      },
    });

    setSource('');
    setAmount('');
    setCustomCategory('');
    setShowAddModal(false);
  };

  const removeIncomeSource = (id: string) => {
    const updatedSources = data.income.sources.filter(item => item.id !== id);
    const totalIncome = updatedSources.reduce((sum, item) => sum + item.amount, 0);

    updateData({
      income: {
        sources: updatedSources,
        totalIncome,
      },
    });
  };

  const handleNext = () => {
    if (data.income.totalIncome > 0) {
      onNext();
    }
  };

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
            theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
          }`}>
            <DollarSign className={`w-8 h-8 ${
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

        {/* Add Income Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddModal(true)}
            className={`w-full text-center ${
              theme === 'dark'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Add Income Source
          </Button>
        </div>

        {/* Income List */}
        {data.income.sources.length > 0 && (
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Your Income Sources</h3>
            <div className="space-y-3">
              {data.income.sources.map((income) => (
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
                      ${income.amount.toLocaleString()}
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
        {data.income.totalIncome > 0 && (
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
                ${data.income.totalIncome.toLocaleString()}
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
            disabled={data.income.totalIncome === 0}
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

      {/* Add Income Modal */}
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
              }`}>Add Income Source</h3>
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

              {/* Source Input */}
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

              {/* Amount Input */}
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

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
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
