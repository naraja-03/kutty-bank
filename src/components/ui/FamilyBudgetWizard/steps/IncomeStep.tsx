'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, DollarSign, ChevronDown } from 'lucide-react';
import { FamilyBudgetData, IncomeSource } from '../types';
import { useGetCategoriesQuery, useCreateCategoryMutation } from '../../../../store/api/categoriesApi';
import DynamicIcon from '../../DynamicIcon';

interface IncomeStepProps {
  data: FamilyBudgetData;
  onUpdate: (data: Partial<FamilyBudgetData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function IncomeStep({ data, onUpdate, onNext, onPrevious }: IncomeStepProps) {
  const [newSource, setNewSource] = useState<Partial<IncomeSource>>({
    name: '',
    amount: 0,
    frequency: 'monthly',
    categoryId: ''
  });
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // RTK Query hooks
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ mainCategory: 'income' });
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  const categories = categoriesData?.categories || [];

  // Auto-select first category when categories load and none is selected
  React.useEffect(() => {
    if (categories.length > 0 && !newSource.categoryId) {
      setNewSource(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, newSource.categoryId]);

  const addIncomeSource = () => {
    if (newSource.name && newSource.amount && newSource.amount > 0 && newSource.categoryId) {
      const source: IncomeSource = {
        id: Date.now().toString(),
        name: newSource.name,
        amount: newSource.amount,
        frequency: newSource.frequency || 'monthly',
        categoryId: newSource.categoryId
      };

      onUpdate({
        income: [...data.income, source]
      });

      setNewSource({
        name: '',
        amount: 0,
        frequency: 'monthly',
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
          mainCategory: 'income',
          icon: 'Tag',
          color: '#5F27CD'
        }).unwrap();

        setNewSource({ ...newSource, categoryId: result.category.id });
        setNewCategoryName('');
        setShowAddCategory(false);
        setShowCategorySelector(false);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const removeIncomeSource = (id: string) => {
    onUpdate({
      income: data.income.filter(source => source.id !== id)
    });
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === newSource.categoryId);
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const canProceed = data.income.length > 0;

  return (
    <div className="space-y-6">
      {/* Add new income source */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-xl p-4 space-y-4"
      >
        <h4 className="text-lg font-medium text-white">Add Income Source</h4>
        
        <div className="space-y-4">
          {/* Category selection - moved to top */}
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
                    {/* Main categories */}
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">INCOME</div>
                      {categories.map((category, index) => (
                        <button
                          key={category.id || `category-${index}`}
                          type="button"
                          onClick={() => {
                            setNewSource({ ...newSource, categoryId: category.id });
                            setShowCategorySelector(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-white/5 transition-colors duration-100 text-sm rounded flex items-center space-x-2 ${
                            newSource.categoryId === category.id 
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

          {/* Source name and amount - moved below category */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newSource.name || ''}
              onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
              placeholder="Source name"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              value={newSource.amount || ''}
              onChange={(e) => setNewSource({ ...newSource, amount: Number(e.target.value) })}
              placeholder="Amount"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          {/* Frequency selection */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' }
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setNewSource({ ...newSource, frequency: freq.value as 'weekly' | 'monthly' | 'yearly' })}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    newSource.frequency === freq.value
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={addIncomeSource}
          disabled={!newSource.name || !newSource.amount || newSource.amount <= 0 || !newSource.categoryId}
          className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            newSource.name && newSource.amount && newSource.amount > 0 && newSource.categoryId
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
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
              <h3 className="text-lg font-medium text-white mb-4">Add Income Category</h3>
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

      {/* Income sources list */}
      <div className="space-y-3">
        {data.income.map((source, index) => {
          const category = getCategoryById(source.categoryId);
          return (
            <motion.div
              key={source.id || `income-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <DynamicIcon 
                    name={category?.icon || 'Tag'} 
                    size={18} 
                    color={category?.color}
                  />
                </div>
                <div>
                  <p className="text-white font-medium">{source.name}</p>
                  <p className="text-sm text-gray-400">{category?.name || 'Unknown'} • {source.frequency}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">₹{source.amount.toLocaleString()}</span>
                <button
                  onClick={() => removeIncomeSource(source.id)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

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
          disabled={!canProceed}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            canProceed
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
