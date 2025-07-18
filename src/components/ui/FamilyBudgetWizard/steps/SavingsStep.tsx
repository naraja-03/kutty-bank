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

interface SavingsStepProps {
  data: FamilyBudgetData;
  onUpdate: (data: Partial<FamilyBudgetData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function SavingsStep({ data, onUpdate, onNext, onPrevious }: SavingsStepProps) {
  const [newSaving, setNewSaving] = useState<Partial<ExpenseItem>>({
    name: '',
    amount: 0,
    categoryId: ''
  });
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Redux selectors
  const isAnonymous = useSelector(selectIsAnonymous);

  // RTK Query hooks
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({ mainCategory: 'savings' });
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

  const categories = React.useMemo(() => categoriesData?.categories || [], [categoriesData?.categories]);

  // Auto-select first category when categories load and none is selected
  React.useEffect(() => {
    if (categories.length > 0 && !newSaving.categoryId) {
      setNewSaving(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, newSaving.categoryId]);

  // Get current savings as array
  const currentSavings = Array.isArray(data.savings) ? data.savings : [];

  const addSaving = () => {
    if (newSaving.name && newSaving.amount && newSaving.amount > 0 && newSaving.categoryId) {
      // Check if adding this saving would exceed available balance
      const totalAfterAddition = essentialsUsed + commitmentsUsed + currentSavingsUsed + newSaving.amount;
      if (totalAfterAddition > totalIncome) {
        setValidationError(`Cannot exceed available balance. Available: ₹${availableBalance.toLocaleString()}`);
        return;
      }

      // Clear validation error if we got here
      setValidationError('');

      const saving: ExpenseItem = {
        id: Date.now().toString(),
        name: newSaving.name,
        amount: newSaving.amount,
        categoryId: newSaving.categoryId
      };

      const updatedSavings = [...currentSavings, saving];
      onUpdate({
        savings: updatedSavings
      });

      setNewSaving({
        name: '',
        amount: 0,
        categoryId: categories.length > 0 ? categories[0].id : ''
      });
    } else {
      setValidationError('Please fill in all fields');
    }
  };

  const removeSaving = (id: string) => {
    const updatedSavings = currentSavings.filter(saving => saving.id !== id);
    onUpdate({
      savings: updatedSavings
    });
  };

  const addCustomCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const result = await createCategory({
          name: newCategoryName.trim(),
          mainCategory: 'savings',
          icon: 'PiggyBank',
          color: '#4ECDC4'
        }).unwrap();

        setNewSaving({ ...newSaving, categoryId: result.category.id });
        setNewCategoryName('');
        setShowAddCategory(false);
      } catch (error: unknown) {
        console.error('Failed to create category:', error);
        
        // Check if error requires sign in
        const typedError = error as { data?: { requireSignIn?: boolean }; status?: number };
        if (typedError?.data?.requireSignIn || typedError?.status === 401 || typedError?.status === 403) {
          setShowAddCategory(false);
          setShowSignInModal(true);
        }
      }
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === newSaving.categoryId);
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  // Calculate available balance (Income - Essentials - Commitments - Savings)
  const totalIncome = data.totalIncome || 0;
  const essentialsUsed = Array.isArray(data.essentials) 
    ? data.essentials.reduce((sum, expense) => sum + expense.amount, 0)
    : 0;
  const commitmentsUsed = Array.isArray(data.commitments) 
    ? data.commitments.reduce((sum, commitment) => sum + commitment.amount, 0)
    : 0;
  const currentSavingsUsed = currentSavings.reduce((sum, saving) => sum + saving.amount, 0);
  const availableBalance = totalIncome - essentialsUsed - commitmentsUsed - currentSavingsUsed;

  return (
    <div className="space-y-6">
      {/* Available Balance Display */}
      {totalIncome > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-1">Available Balance</h3>
          <p className={`text-3xl font-bold ${availableBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ₹{availableBalance.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            After essentials (₹{essentialsUsed.toLocaleString()}) and commitments (₹{commitmentsUsed.toLocaleString()})
          </p>
        </motion.div>
      )}

      {/* Existing savings */}
      {currentSavings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Current Savings</h4>
          {currentSavings.map((saving, index) => {
            const category = getCategoryById(saving.categoryId);
            return (
              <motion.div
                key={saving.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <DynamicIcon 
                    name={category?.icon || 'PiggyBank'} 
                    size={20} 
                    color={category?.color || '#4ECDC4'}
                  />
                  <div>
                    <div className="text-white font-medium">{saving.name}</div>
                    <div className="text-xs text-gray-400">{category?.name || 'Unknown Category'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-white font-medium">₹{saving.amount.toLocaleString()}</span>
                  <button
                    onClick={() => removeSaving(saving.id)}
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

      {/* Add new saving */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-xl p-4 space-y-4"
      >
        <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Add Saving Goal</h4>
        
        <div className="space-y-3">
          {/* Category selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 flex items-center justify-between"
              disabled={categoriesLoading}
            >
              <div className="flex items-center space-x-2">
                {getSelectedCategory() ? (
                  <>
                    <DynamicIcon 
                      name={getSelectedCategory()?.icon || 'PiggyBank'} 
                      size={16} 
                      color={getSelectedCategory()?.color}
                    />
                    <span>{getSelectedCategory()?.name}</span>
                  </>
                ) : (
                  <span className="text-gray-400">
                    {categoriesLoading ? 'Loading categories...' : 'Select category'}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategorySelector ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCategorySelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 z-10 mt-1"
                >
                  <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">SAVINGS</div>
                      {categories.map((category, index) => (
                        <button
                          key={category.id || `category-${index}`}
                          type="button"
                          onClick={() => {
                            setNewSaving({ ...newSaving, categoryId: category.id });
                            setShowCategorySelector(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-white/5 transition-colors duration-100 text-sm rounded flex items-center space-x-2 ${
                            newSaving.categoryId === category.id 
                              ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' 
                              : 'text-white hover:bg-gray-700/50'
                          }`}
                        >
                          <DynamicIcon 
                            name={category.icon || 'PiggyBank'} 
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

          {/* Saving name and amount */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={newSaving.name || ''}
              onChange={(e) => setNewSaving({ ...newSaving, name: e.target.value })}
              placeholder="Saving goal name"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <input
              type="number"
              value={newSaving.amount || ''}
              onChange={(e) => setNewSaving({ ...newSaving, amount: Number(e.target.value) })}
              placeholder="Amount"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>
          
          {/* Validation Error */}
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-300 text-sm">{validationError}</p>
            </motion.div>
          )}
        </div>

        <button
          onClick={addSaving}
          disabled={!newSaving.name || !newSaving.amount || newSaving.amount <= 0 || !newSaving.categoryId}
          className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            newSaving.name && newSaving.amount && newSaving.amount > 0 && newSaving.categoryId
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Saving Goal</span>
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
              <h3 className="text-lg font-medium text-white mb-4">Add Savings Category</h3>
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
        message="Create an account or sign in to add custom savings categories and save your budget data."
      />
    </div>
  );
}
