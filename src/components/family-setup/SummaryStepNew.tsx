'use client';

import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { useFamilySetup, IncomeSource, CategoryItem } from '@/contexts/FamilySetupContext';

interface SummaryStepProps {
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isOverBudget?: boolean;
  totalSpendingPercentage?: number;
}

export const SummaryStep = ({ onPrev, onSubmit }: SummaryStepProps) => {
  const { theme } = useTheme();
  const { formData } = useFamilySetup();
  const totalIncome = formData.income.totalIncome;
  const totalEssentials = formData.essentials.totalEssentials;
  const totalCommitments = formData.commitments.totalCommitments;
  const totalSavings = formData.savings.totalSavings;
  const remainingBalance = totalIncome - totalEssentials - totalCommitments - totalSavings;

  const essentialPercentage = totalIncome > 0 ? (totalEssentials / totalIncome) * 100 : 0;
  const commitmentPercentage = totalIncome > 0 ? (totalCommitments / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const getBudgetStatus = () => {
    if (essentialPercentage <= 50 && commitmentPercentage <= 30 && savingsPercentage >= 20) {
      return { 
        status: 'excellent', 
        color: theme === 'dark' ? 'text-green-400' : 'text-green-600', 
        message: 'Excellent budget balance!' 
      };
    } else if (essentialPercentage <= 60 && commitmentPercentage <= 40) {
      return { 
        status: 'good', 
        color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600', 
        message: 'Good budget, with room for improvement' 
      };
    } else {
      return { 
        status: 'needs-work', 
        color: theme === 'dark' ? 'text-red-400' : 'text-red-600', 
        message: 'Budget needs adjustment' 
      };
    }
  };

  const budgetStatus = getBudgetStatus();

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
            theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
          }`}>
            <CheckCircle size={32} className={`${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
          </div>
          <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Budget Summary
          </h2>
          <p className={`max-w-md mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Review your family&apos;s budget setup before completing the process.
          </p>
        </div>

        {/* Budget Overview */}
        <div className={`border rounded-xl p-6 mb-6 ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign size={20} className={`mr-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Budget Overview</h3>
            </div>
            <div className={`${budgetStatus.color} font-medium`}>
              {budgetStatus.message}
            </div>
          </div>

          {/* Income */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Monthly Income</span>
              <span className={`font-semibold text-lg ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                ₹{totalIncome.toLocaleString()}
              </span>
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {formData.income.sources.length} income source{formData.income.sources.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="space-y-4">
            {/* Essentials */}
            <div className={`flex justify-between items-center p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-orange-500/10 border-orange-400/20'
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div>
                <div className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Essential Expenses</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {essentialPercentage.toFixed(1)}% of income (Recommended: 50%)
                </div>
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`}>
                ₹{totalEssentials.toLocaleString()}
              </div>
            </div>

            {/* Commitments */}
            <div className={`flex justify-between items-center p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-red-500/10 border-red-400/20'
                : 'bg-red-50 border-red-200'
            }`}>
              <div>
                <div className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Commitments & Debt</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  {commitmentPercentage.toFixed(1)}% of income (Recommended: 30%)
                </div>
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                ₹{totalCommitments.toLocaleString()}
              </div>
            </div>

            {/* Savings */}
            <div className={`flex justify-between items-center p-4 rounded-lg border ${
              theme === 'dark'
                ? 'bg-purple-500/10 border-purple-400/20'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div>
                <div className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Savings & Goals</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {savingsPercentage.toFixed(1)}% of income (Recommended: 20%)
                </div>
              </div>
              <div className={`font-semibold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                ₹{totalSavings.toLocaleString()}
              </div>
            </div>

            {/* Remaining Balance */}
            {remainingBalance !== 0 && (
              <div className={`flex justify-between items-center p-4 rounded-lg border ${
                remainingBalance > 0 
                  ? theme === 'dark' 
                    ? 'bg-green-500/10 border-green-400/20' 
                    : 'bg-green-50 border-green-200'
                  : theme === 'dark'
                    ? 'bg-red-500/10 border-red-400/20'
                    : 'bg-red-50 border-red-200'
              }`}>
                <div>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {remainingBalance > 0 ? 'Unallocated Income' : 'Over Budget'}
                  </div>
                  <div className={`text-sm ${
                    remainingBalance > 0 
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>
                    {remainingBalance > 0 ? 'Available for additional allocation' : 'Expenses exceed income'}
                  </div>
                </div>
                <div className={`font-semibold ${
                  remainingBalance > 0 
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  ₹{Math.abs(remainingBalance).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Income Sources */}
          <div className={`rounded-xl border p-6 ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              <TrendingUp size={20} className={`mr-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Income Sources</h4>
            </div>
            <div className="space-y-3">
              {formData.income.sources.map((source: IncomeSource) => (
                <div key={source.id} className="flex justify-between">
                  <div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{source.source}</div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>{source.category}</div>
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    ₹{source.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Categories */}
          <div className={`rounded-xl border p-6 ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                theme === 'dark' ? 'bg-orange-400' : 'bg-orange-500'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Essentials</h4>
            </div>
            <div className="space-y-3">
              {formData.essentials.categories.map((category: CategoryItem) => (
                <div key={category.id} className="flex justify-between">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{category.name}</div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                    ₹{category.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commitment Categories */}
          <div className={`rounded-xl border p-6 ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Commitments</h4>
            </div>
            <div className="space-y-3">
              {formData.commitments.categories.map((category: CategoryItem) => (
                <div key={category.id} className="flex justify-between">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{category.name}</div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>
                    ₹{category.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings Goals */}
        {formData.savings.categories.length > 0 && (
          <div className={`rounded-xl border p-6 mb-8 ${
            theme === 'dark'
              ? 'bg-white/5 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
              }`} />
              <h4 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Savings Goals</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.savings.categories.map((category: CategoryItem) => (
                <div key={category.id} className="flex justify-between">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{category.name}</div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    ₹{category.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            onClick={onPrev}
            variant="outline"
            className="order-2 sm:order-1 flex items-center justify-center"
          >
            ← Previous
          </Button>
          <Button
            onClick={onSubmit}
            className={`order-1 sm:order-2 flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Complete Setup
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
