'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { FamilyBudgetData, ExpenseItem } from '../types';
import { useGetCategoriesQuery, useCreateCategoryMutation } from '../../../../store/api/categoriesApi';
import { selectIsAnonymous } from '../../../../store/slices/authSlice';
import DynamicIcon from '../../DynamicIcon';
import SignInModal from '../../SignInModal';

interface EssentialsStepProps {
  data: FamilyBudgetData;
  onUpdate: (data: Partial<FamilyBudgetData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function EssentialsStep({ data, onUpdate, onNext, onPrevious }: EssentialsStepProps) {
  const [newExpense, setNewExpense] = useState<Partial<ExpenseItem>>({
    name: '',
    amount: 0,
    categoryId: ''
  });
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Redux selectors
  const isAnonymous = useSelector(selectIsAnonymous);

  // RTK Query hooks
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ mainCategory: 'essentials' });
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  const categories = categoriesData?.categories || [];

  // Auto-select first category when categories load and none is selected
  React.useEffect(() => {
    if (categories.length > 0 && !newExpense.categoryId) {
      setNewExpense(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, newExpense.categoryId]);

  // Get current essentials as array
  const currentEssentials = Array.isArray(data.essentials) ? data.essentials : [];

  const addEssentialExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.amount > 0 && newExpense.categoryId) {
      const expense: ExpenseItem = {
        id: Date.now().toString(),
        name: newExpense.name,
        amount: newExpense.amount,
        categoryId: newExpense.categoryId
      };

      const updatedEssentials = [...currentEssentials, expense];
      onUpdate({
        essentials: updatedEssentials
      });

      setNewExpense({
        name: '',
        amount: 0,
        categoryId: categories.length > 0 ? categories[0].id : ''
      });
    }
  };

  const removeEssentialExpense = (id: string) => {
    const updatedEssentials = currentEssentials.filter(expense => expense.id !== id);
    onUpdate({
      essentials: updatedEssentials
    });
  };

  const addCustomCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const result = await createCategory({
          name: newCategoryName.trim(),
          mainCategory: 'essentials',
          icon: 'Tag',
          color: '#FF6B6B'
        }).unwrap();

        setNewExpense({ ...newExpense, categoryId: result.category.id });
        setNewCategoryName('');
        setShowAddCategory(false);
      } catch (error: any) {
        console.error('Failed to create category:', error);
        
        // Check if error requires sign in
        if (error?.data?.requireSignIn || error?.status === 401 || error?.status === 403) {
          setShowAddCategory(false);
          setShowSignInModal(true);
        }
      }
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === newExpense.categoryId);
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Existing essentials */}
      {currentEssentials.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Current Essentials</h4>
          {currentEssentials.map((expense, index) => {
            const category = getCategoryById(expense.categoryId);
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <DynamicIcon 
                    name={category?.icon || 'Tag'} 
                    size={20} 
                    color={category?.color || '#FF6B6B'}
                  />
                  <div>
                    <div className="text-white font-medium">{expense.name}</div>
                    <div className="text-xs text-gray-400">{category?.name || 'Unknown Category'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">₹{expense.amount.toLocaleString()}</span>
                  <button
                    onClick={() => removeEssentialExpense(expense.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add new essential expense */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-xl p-4 space-y-4"
      >
        <h4 className="text-lg font-medium text-white">Add Essential Expense</h4>

        <div className="space-y-4">
          {/* Category selector */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 flex items-center justify-between"
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
                  <>
                    <span className="text-gray-400">
                      {categoriesLoading ? 'Loading...' : 'Select category'}
                    </span>
                  </>
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
                      <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">ESSENTIALS</div>
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
                      {!isAnonymous ? (
                        <button
                          type="button"
                          onClick={() => setShowAddCategory(true)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-700/50 transition-colors duration-100 text-sm rounded flex items-center space-x-2 text-purple-400 border-t border-white/10 mt-2 pt-2"
                          disabled={isCreatingCategory}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Category</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowSignInModal(true)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-700/50 transition-colors duration-100 text-sm rounded flex items-center space-x-2 text-gray-400 border-t border-white/10 mt-2 pt-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Sign in to add categories</span>
                        </button>
                      )}
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
          onClick={addEssentialExpense}
          disabled={!newExpense.name || !newExpense.amount || newExpense.amount <= 0 || !newExpense.categoryId}
          className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            newExpense.name && newExpense.amount && newExpense.amount > 0 && newExpense.categoryId
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
              <h3 className="text-lg font-medium text-white mb-4">Add Essential Category</h3>
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
          className="flex-1 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          Continue
        </button>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        title="Sign In to Add Categories"
        message="Create an account or sign in to add custom expense categories and save your budget data."
      />
    </div>
  );
}
