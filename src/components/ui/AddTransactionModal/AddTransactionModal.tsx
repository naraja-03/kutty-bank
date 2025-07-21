"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, IndianRupee, Calendar, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { CommonModal } from '../CommonModal/CommonModal';
import { Button, Input } from '../';
import { useGetCategoriesQuery } from '@/store/api/categoriesApi';
import { CategoryType, TransactionData } from './type';
import { defaultCategories } from '@/constants/defaultCategories';
import { Transaction } from '@/store/api/transactionsApi';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (transaction: Transaction) => void;
}

const CATEGORY_TYPE_CONFIG: Record<CategoryType, {
  label: string;
  icon: React.ElementType;
  colorClass: string; // Tailwind safe class string
}> = {
  income: { label: 'Income', icon: IndianRupee, colorClass: 'from-green-500 to-green-600 border-green-400 shadow-green-500/25' },
  essential: { label: 'Essential', icon: FileText, colorClass: 'from-blue-500 to-blue-600 border-blue-400 shadow-blue-500/25' },
  commitment: { label: 'Commitment', icon: Calendar, colorClass: 'from-purple-500 to-purple-600 border-purple-400 shadow-purple-500/25' },
  saving: { label: 'Saving', icon: Plus, colorClass: 'from-orange-500 to-orange-600 border-orange-400 shadow-orange-500/25' },
};

export const AddTransactionModal = ({ isOpen, onClose, onSubmit }: AddTransactionModalProps) => {
  const { theme } = useTheme();
  const { data: apiCategories = [] } = useGetCategoriesQuery(undefined, { skip: !isOpen });

  const allCategories = useMemo(() => {
    const merged = [...defaultCategories, ...(apiCategories || [])];
    const seen = new Set();
    return merged.filter((cat) => {
      const key = `${cat.mainCategory}-${cat.name.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [apiCategories]);

  const getDefaultCategory = (type: CategoryType) =>
    allCategories.find((cat) => cat.mainCategory === type)?.name || '';

  const [formData, setFormData] = useState<TransactionData>({
    categoryType: 'income',
    subCategory: '',
    category: getDefaultCategory('income'),
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [customCategory, setCustomCategory] = useState('');

  const filteredCategories = useMemo(
    () => allCategories.filter((cat) => cat.mainCategory === formData.categoryType),
    [allCategories, formData.categoryType]
  );

  const handleCategoryTypeChange = (type: CategoryType) => {
    setFormData((prev) => ({
      ...prev,
      categoryType: type,
      category: getDefaultCategory(type),
    }));
    setCustomCategory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isOther = formData.category === 'Other';
    const trimmedCustom = customCategory.trim();

    if (isOther && !trimmedCustom) return;

    const subCategory = isOther ? trimmedCustom : formData.category;

  const transactionData: Transaction = {
    category: formData.categoryType,
    subCategory,
    customCategory: isOther ? trimmedCustom : undefined,
    amount: formData.amount,
    description: formData.description?.trim() || '',
    date: formData.date || new Date().toISOString(),
  };

    onSubmit?.(transactionData);
    handleReset();
    onClose();
  };


  const handleReset = () => {
    const defaultType: CategoryType = 'income';
    setFormData({
      categoryType: defaultType,
      subCategory: '',
      category: getDefaultCategory(defaultType),
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setCustomCategory('');
  };

  const CATEGORY_TYPES = useMemo(
    () =>
      (Object.entries(CATEGORY_TYPE_CONFIG) as [CategoryType, typeof CATEGORY_TYPE_CONFIG[CategoryType]][]).map(
        ([id, config]) => ({
          id,
          ...config,
        })
      ),
    []
  );

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} size="lg" className="max-h-[90vh] overflow-hidden">
      <div className={`relative ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-white via-blue-50/30 to-white'
        }`}>
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category Type Selector */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Category Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.categoryType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      type="button"
                      onClick={() => handleCategoryTypeChange(type.id as CategoryType)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group
                        ${isSelected
                          ? `bg-gradient-to-br ${type.colorClass} text-white shadow-lg`
                          : theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <Icon size={20} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCategories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.name }))}
                    className={`p-3 rounded-lg text-sm transition-all duration-300 border
                      ${formData.category === category.name
                        ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300'
                        : theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {formData.category === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    type="text"
                    placeholder="Enter custom category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="mt-2"
                  />
                </motion.div>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Amount
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Description (Optional)
              </label>
              <Input
                type="text"
                placeholder="Add a note..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Date */}
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </form>
        </div>

        <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark'
          ? 'border-gray-700 bg-gray-900/50'
          : 'border-gray-200 bg-gray-50/50'
          }`}>
          <div className="flex justify-between w-full gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={!formData.amount || (formData.category === 'Other' && !customCategory.trim())}
            >
              Add {formData.categoryType === 'income' ? 'Income' : 'Expense'}
            </Button>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};
