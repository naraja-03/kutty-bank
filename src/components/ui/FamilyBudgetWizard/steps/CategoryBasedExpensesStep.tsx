'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { FamilyBudgetData } from '../types';
import { useGetCategoriesQuery, useCreateCategoryMutation } from '../../../../store/api/categoriesApi';
import DynamicIcon from '../../DynamicIcon';
import BudgetAnalysis from '../../BudgetAnalysis';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
}

interface CategoryBasedExpensesStepProps {
  data: FamilyBudgetData;
  onUpdate: (data: Partial<FamilyBudgetData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  stepType: 'essentials' | 'commitments' | 'savings';
}

const STEP_CONFIG = {
  essentials: {
    title: 'Essential Expenses',
    subtitle: 'Monthly expenses you can\'t avoid',
    dataKey: 'essentials',
    color: '#FF6B6B'
  },
  commitments: {
    title: 'Commitments',
    subtitle: 'Fixed monthly commitments and obligations',
    dataKey: 'commitments', 
    color: '#54A0FF'
  },
  savings: {
    title: 'Savings & Investments',
    subtitle: 'Money you save and invest for the future',
    dataKey: 'savings',
    color: '#26DE81'
  }
};

export default function CategoryBasedExpensesStep({ 
  data, 
  onUpdate, 
  onNext, 
  onPrevious, 
  stepType 
}: CategoryBasedExpensesStepProps) {
  const config = STEP_CONFIG[stepType];
  const [newExpense, setNewExpense] = useState<Partial<ExpenseItem>>({
    name: '',
    amount: 0,
    categoryId: ''
  });
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // RTK Query hooks
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ 
    mainCategory: stepType 
  });
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  const categories = categoriesData?.categories || [];
  const currentExpenses = (() => {
    switch (stepType) {
      case 'essentials':
        return Array.isArray(data.essentials) ? data.essentials : [];
      case 'commitments':
        return Array.isArray(data.commitments) ? data.commitments : [];
      case 'savings':
        return Array.isArray(data.savings) ? data.savings : [];
      default:
        return [];
    }
  })();

  const addExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.amount > 0 && newExpense.categoryId) {
      const expense: ExpenseItem = {
        id: Date.now().toString(),
        name: newExpense.name,
        amount: newExpense.amount,
        categoryId: newExpense.categoryId
      };

      onUpdate({
        [config.dataKey]: [...currentExpenses, expense]
      });

      setNewExpense({
        name: '',
        amount: 0,
        categoryId: ''
      });
      setShowCategorySelector(false);
    }
  };

  const addCustomCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const result = await createCategory({
          name: newCategoryName,
          mainCategory: stepType,
          icon: 'Tag',
          color: config.color
        }).unwrap();

        setNewExpense({ ...newExpense, categoryId: result.category.id });
        setNewCategoryName('');
        setShowAddCategory(false);
        setShowCategorySelector(false);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const removeExpense = (id: string) => {
    onUpdate({
      [config.dataKey]: currentExpenses.filter((expense: ExpenseItem) => expense.id !== id)
    });
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === newExpense.categoryId);
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const getTotalByType = (type: 'essentials' | 'commitments' | 'savings') => {
    const expenses = (() => {
      switch (type) {
        case 'essentials':
          return Array.isArray(data.essentials) ? data.essentials : [];
        case 'commitments':
          return Array.isArray(data.commitments) ? data.commitments : [];
        case 'savings':
          return Array.isArray(data.savings) ? data.savings : [];
        default:
          return [];
      }
    })();
    return expenses.reduce((sum: number, expense: ExpenseItem) => sum + expense.amount, 0);
  };

  const totalIncome = data.income.reduce((sum, source) => sum + source.amount, 0);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>
        <p className="text-gray-300">{config.subtitle}</p>
      </motion.div>

      {/* Add new expense */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-xl p-4 space-y-4"
      >
        <h4 className="text-lg font-medium text-white">Add {config.title}</h4>
        
        <div className="space-y-4">
          {/* Category selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-left flex items-center justify-between"
              disabled={categoriesLoading}
            >
              <span className="flex items-center space-x-2">
                {getSelectedCategory() ? (
                  <>
                    <DynamicIcon 
                      name={getSelectedCategory()?.icon || 'Tag'} 
                      size={16} 
                      color={getSelectedCategory()?.color}
                    />
                    <span>{getSelectedCategory()?.name}</span>
                  </>
                ) : (
                  <span className="text-gray-400">
                    {categoriesLoading ? 'Loading...' : 'Select category'}
                  </span>
                )}
              </span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-150 ${showCategorySelector ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {showCategorySelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="max-h-48 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                        {stepType.toUpperCase()}
                      </div>
                      {categories.map((category, index) => (
                        <button
                          key={category.id || `category-${index}`}
                          type="button"
                          onClick={() => {
                            setNewExpense({ ...newExpense, categoryId: category.id });
                            setShowCategorySelector(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-white/5 transition-colors duration-100 text-sm rounded flex items-center space-x-2 ${
                            newExpense.categoryId === category.id 
                              ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' 
                              : 'text-white hover:bg-gray-700/50'
                          }`}
                        >
                          <DynamicIcon 
                            name={category.icon || 'Tag'} 
                            size={16} 
                            color={category.color}
                          />
                          <span>{category.name}</span>
                        </button>
                      ))}
                      
                      {/* Add category button */}
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(true)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-700/50 transition-colors duration-100 text-sm rounded flex items-center space-x-2 text-purple-400 border-t border-white/10 mt-2 pt-2"
                        disabled={isCreatingCategory}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expense name and amount */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newExpense.name || ''}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              placeholder="Expense name"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              value={newExpense.amount || ''}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              placeholder="Amount"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <button
          onClick={addExpense}
          disabled={!newExpense.name || !newExpense.amount || !newExpense.categoryId}
          className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            newExpense.name && newExpense.amount && newExpense.categoryId
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </motion.div>

      {/* Add category modal */}
      <AnimatePresence>
        {showAddCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddCategory(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-xl p-6 w-80 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium text-white mb-4">Add {config.title} Category</h3>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 mb-4"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  className="flex-1 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  disabled={isCreatingCategory}
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomCategory}
                  disabled={!newCategoryName.trim() || isCreatingCategory}
                  className={`flex-1 py-2 rounded-lg transition-colors ${
                    newCategoryName.trim() && !isCreatingCategory
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCreatingCategory ? 'Adding...' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expenses list */}
      <div className="space-y-3">
        {currentExpenses.map((expense: ExpenseItem, index: number) => {
          const category = getCategoryById(expense.categoryId);
          return (
            <motion.div
              key={expense.id || `expense-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <DynamicIcon 
                  name={category?.icon || 'Tag'} 
                  size={18} 
                  color={category?.color}
                />
                <div>
                  <p className="text-white font-medium">{expense.name}</p>
                  <p className="text-sm text-gray-400">{category?.name || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">₹{expense.amount.toLocaleString()}</span>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Budget Analysis - Only show on savings step */}
      {stepType === 'savings' && (
        <BudgetAnalysis
          totalIncome={totalIncome}
          essentialsTotal={getTotalByType('essentials')}
          commitmentsTotal={getTotalByType('commitments')}
          savingsTotal={getTotalByType('savings')}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex space-x-3 pt-8">
        <button
          onClick={onPrevious}
          className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
