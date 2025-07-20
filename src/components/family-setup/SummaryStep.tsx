'use client';

import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';
import { FamilySetupData } from './FamilySetupContainer';

interface SummaryStepProps {
  data: FamilySetupData;
  updateData: (data: Partial<FamilySetupData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const SummaryStep = ({ data, onPrev, onSubmit }: SummaryStepProps) => {
  const totalIncome = data.income.totalIncome;
  const totalEssentials = data.essentials.totalEssentials;
  const totalCommitments = data.commitments.totalCommitments;
  const totalSavings = data.savings.totalSavings;
  const remainingBalance = totalIncome - totalEssentials - totalCommitments - totalSavings;

  const essentialPercentage = totalIncome > 0 ? (totalEssentials / totalIncome) * 100 : 0;
  const commitmentPercentage = totalIncome > 0 ? (totalCommitments / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const getBudgetStatus = () => {
    if (essentialPercentage <= 50 && commitmentPercentage <= 30 && savingsPercentage >= 20) {
      return { status: 'excellent', color: 'text-green-400', message: 'Excellent budget balance!' };
    } else if (essentialPercentage <= 60 && commitmentPercentage <= 40) {
      return { status: 'good', color: 'text-yellow-400', message: 'Good budget, with room for improvement' };
    } else {
      return { status: 'needs-work', color: 'text-red-400', message: 'Budget needs adjustment' };
    }
  };

  const budgetStatus = getBudgetStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Budget Summary
        </h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Review your family&apos;s budget setup before completing the process.
        </p>
      </div>

      {/* Family Info Card */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Calendar size={20} className="text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Family Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400 text-sm">Family Name</div>
            <div className="text-white font-medium">{data.familyInfo.name}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Tracking Period</div>
            <div className="text-white font-medium capitalize">{data.familyInfo.trackingPeriod}</div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DollarSign size={20} className="text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Budget Overview</h3>
          </div>
          <div className={`${budgetStatus.color} font-medium`}>
            {budgetStatus.message}
          </div>
        </div>

        {/* Income */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">Total Monthly Income</span>
            <span className="text-green-400 font-semibold text-lg">
              ${totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {data.income.sources.length} income source{data.income.sources.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="space-y-4">
          {/* Essentials */}
          <div className="flex justify-between items-center p-4 bg-orange-500/10 rounded-lg border border-orange-400/20">
            <div>
              <div className="text-white font-medium">Essential Expenses</div>
              <div className="text-orange-400 text-sm">
                {essentialPercentage.toFixed(1)}% of income (Recommended: 50%)
              </div>
            </div>
            <div className="text-orange-400 font-semibold">
              ${totalEssentials.toLocaleString()}
            </div>
          </div>

          {/* Commitments */}
          <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-lg border border-red-400/20">
            <div>
              <div className="text-white font-medium">Commitments & Debt</div>
              <div className="text-red-400 text-sm">
                {commitmentPercentage.toFixed(1)}% of income (Recommended: 30%)
              </div>
            </div>
            <div className="text-red-400 font-semibold">
              ${totalCommitments.toLocaleString()}
            </div>
          </div>

          {/* Savings */}
          <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-lg border border-purple-400/20">
            <div>
              <div className="text-white font-medium">Savings & Goals</div>
              <div className="text-purple-400 text-sm">
                {savingsPercentage.toFixed(1)}% of income (Recommended: 20%)
              </div>
            </div>
            <div className="text-purple-400 font-semibold">
              ${totalSavings.toLocaleString()}
            </div>
          </div>

          {/* Remaining Balance */}
          {remainingBalance !== 0 && (
            <div className={`flex justify-between items-center p-4 rounded-lg border ${
              remainingBalance > 0 
                ? 'bg-green-500/10 border-green-400/20' 
                : 'bg-red-500/10 border-red-400/20'
            }`}>
              <div>
                <div className="text-white font-medium">
                  {remainingBalance > 0 ? 'Unallocated Income' : 'Over Budget'}
                </div>
                <div className={`text-sm ${remainingBalance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {remainingBalance > 0 ? 'Available for additional allocation' : 'Expenses exceed income'}
                </div>
              </div>
              <div className={`font-semibold ${remainingBalance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(remainingBalance).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Income Sources */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-green-400 mr-2" />
            <h4 className="font-semibold text-white">Income Sources</h4>
          </div>
          <div className="space-y-3">
            {data.income.sources.map((source) => (
              <div key={source.id} className="flex justify-between">
                <div>
                  <div className="text-white text-sm">{source.source}</div>
                  <div className="text-gray-400 text-xs">{source.category}</div>
                </div>
                <div className="text-green-400 text-sm font-medium">
                  ${source.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Categories */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-orange-400 rounded-full mr-2" />
            <h4 className="font-semibold text-white">Essentials</h4>
          </div>
          <div className="space-y-3">
            {data.essentials.categories.map((category) => (
              <div key={category.id} className="flex justify-between">
                <div className="text-white text-sm">{category.name}</div>
                <div className="text-orange-400 text-sm font-medium">
                  ${category.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment Categories */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2" />
            <h4 className="font-semibold text-white">Commitments</h4>
          </div>
          <div className="space-y-3">
            {data.commitments.categories.map((category) => (
              <div key={category.id} className="flex justify-between">
                <div className="text-white text-sm">{category.name}</div>
                <div className="text-red-400 text-sm font-medium">
                  ${category.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      {data.savings.categories.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full mr-2" />
            <h4 className="font-semibold text-white">Savings Goals</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.savings.categories.map((category) => (
              <div key={category.id} className="flex justify-between">
                <div className="text-white text-sm">{category.name}</div>
                <div className="text-purple-400 text-sm font-medium">
                  ${category.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          onClick={onPrev}
          variant="outline"
          className="order-2 sm:order-1"
        >
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          className="order-1 sm:order-2"
        >
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );
};
