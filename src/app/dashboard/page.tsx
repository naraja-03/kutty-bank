'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import BudgetPieChart from '@/components/charts/BudgetPieChart';
import ComparisonBarChart from '@/components/charts/ComparisonBarChart';
import CategoryBreakdown from '@/components/charts/CategoryBreakdown';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/navigation/BottomNav';
import SideNav from '@/components/navigation/SideNav';
import { WelcomeBackground } from '@/components/ui/Welcome';
import { 
  DollarSign, 
  TrendingDown, 
  AlertCircle,
  Calendar,
  Target,
  Wallet,
} from 'lucide-react';
import { Transaction, useAddTransactionMutation, useGetTransactionsQuery } from '@/store/api/transactionsApi';
import { useGetFamilyQuery } from '@/store/api/familyApi';
import Link from 'next/link';
import { AddTransactionModal } from '@/components/ui';


export default function DashboardPage() {
  const { theme } = useTheme();
  const { data: familyData, isLoading: loading } = useGetFamilyQuery();
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: transactions = [], refetch } = useGetTransactionsQuery();
  const [addTransaction] = useAddTransactionMutation();

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      await addTransaction(transaction).unwrap();
      refetch();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
console.log("transaction data:", transactions);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!familyData?.detailedBudget) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <AlertCircle className={`mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} size={48} />
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No Budget Data Found
          </h2>
          <p className={`$${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Please complete your family budget setup first.
          <Link
            href="/"
            className={`mt-6 inline-block px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Go to Home
          </Link>
          </p>
        </div>
      </div>
    );
  }

  const { detailedBudget } = familyData;

  // Calculate actual spending from transactions
  const actualSpending = transactions?.reduce((acc, transaction) => {
    switch (transaction.category) {
      case 'essential':
        acc.essentials += transaction.amount;
        break;
      case 'commitment':
        acc.commitments += transaction.amount;
        break;
      case 'saving':
        acc.savings += transaction.amount;
        break;
      case 'income':
        acc.income += transaction.amount;
        break;
    }
    return acc;
  }, { essentials: 0, commitments: 0, savings: 0, income: 0 });

  // Prepare data for charts
  const budgetOverviewData = [
    {
      name: 'Essentials',
      value: detailedBudget.essentials.totalEssentials,
      color: '#f97316',
      planned: detailedBudget.essentials.totalEssentials
    },
    {
      name: 'Commitments',
      value: detailedBudget.commitments.totalCommitments,
      color: '#ef4444',
      planned: detailedBudget.commitments.totalCommitments
    },
    {
      name: 'Savings',
      value: detailedBudget.savings.totalSavings,
      color: '#8b5cf6',
      planned: detailedBudget.savings.totalSavings
    }
  ];

  const actualSpendingData = [
    {
      name: 'Essentials',
      value: actualSpending.essentials,
      color: '#f97316'
    },
    {
      name: 'Commitments',
      value: actualSpending.commitments,
      color: '#ef4444'
    },
    {
      name: 'Savings',
      value: actualSpending.savings,
      color: '#8b5cf6'
    }
  ].filter(item => item.value > 0);

  const comparisonData = [
    {
      name: 'Essentials',
      planned: detailedBudget.essentials.totalEssentials,
      actual: actualSpending.essentials
    },
    {
      name: 'Commitments',
      planned: detailedBudget.commitments.totalCommitments,
      actual: actualSpending.commitments
    },
    {
      name: 'Savings',
      planned: detailedBudget.savings.totalSavings,
      actual: actualSpending.savings
    }
  ];

  // Convert budget categories to actual spending format
  const actualCategories = {
    essentials: detailedBudget.essentials.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      planned: cat.amount,
      actual: transactions
        ?.filter(t => t.category === 'essential' && t.subCategory === cat.name)
        .reduce((sum, t) => sum + t.amount, 0)
    })),
    commitments: detailedBudget.commitments.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      planned: cat.amount,
      actual: transactions
        ?.filter(t => t.category === 'commitment' && t.subCategory === cat.name)
        .reduce((sum, t) => sum + t.amount, 0)
    })),
    savings: detailedBudget.savings.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      planned: cat.amount,
      actual: transactions
        ?.filter(t => t.category === 'saving' && t.subCategory === cat.name)
        .reduce((sum, t) => sum + t.amount, 0)
    }))
  };

  const totalPlanned = detailedBudget.income.totalIncome;
  const totalActual = actualSpending.essentials + actualSpending.commitments + actualSpending.savings;
  const remainingBudget = totalPlanned - totalActual;

  return (
    <WelcomeBackground>
      <div className="flex h-screen">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <SideNav />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 pb-20 md:pb-6 relative z-10">
          {/* Page Header */}
          <div className="mb-6 flex justify-between w-full items-center">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {familyData.name} • {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 lg:mt-0">
              <div className="flex items-center gap-1">
                <Calendar className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} size={16} />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Monthly Budget
                </span>
              </div>
            </div>
          </div>      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Income */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/20 border-white/30 hover:bg-white/30'
        } transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Total Income
              </p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                ₹{totalPlanned.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-500/30">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Spending */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/20 border-white/30 hover:bg-white/30'
        } transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Total Spending
              </p>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                ₹{totalActual.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-full backdrop-blur-sm border border-red-500/30">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/20 border-white/30 hover:bg-white/30'
        } transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Remaining Budget
              </p>
              <p className={`text-2xl font-bold ${
                remainingBudget >= 0 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                ₹{Math.abs(remainingBudget).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full backdrop-blur-sm border ${
              remainingBudget >= 0 
                ? 'bg-blue-500/20 border-blue-500/30' 
                : 'bg-orange-500/20 border-orange-500/30'
            }`}>
              <Wallet className={`${
                remainingBudget >= 0 
                  ? 'text-blue-600' 
                  : 'text-orange-600'
              }`} size={24} />
            </div>
          </div>
        </div>

        {/* Budget Status */}
        <div className={`p-6 rounded-xl border backdrop-blur-sm ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:bg-white/10'
            : 'bg-white/20 border-white/30 hover:bg-white/30'
        } transition-colors duration-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Budget Status
              </p>
              <p className={`text-lg font-bold ${
                remainingBudget >= 0 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {remainingBudget >= 0 ? 'On Track' : 'Over Budget'}
              </p>
            </div>
            <div className={`p-3 rounded-full backdrop-blur-sm border ${
              remainingBudget >= 0 
                ? 'bg-purple-500/20 border-purple-500/30' 
                : 'bg-yellow-500/20 border-yellow-500/30'
            }`}>
              <Target className={`${
                remainingBudget >= 0 
                  ? 'text-purple-600' 
                  : 'text-yellow-600'
              }`} size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BudgetPieChart 
          data={budgetOverviewData}
          title="Planned Budget Allocation"
          type="actual"
        />
        <BudgetPieChart 
          data={actualSpendingData}
          title="Actual Spending Distribution"
          type="actual"
        />
      </div>

      {/* Comparison Chart */}
      <div className="mb-6">
        <ComparisonBarChart 
          data={comparisonData}
          title="Planned vs Actual Spending"
        />
      </div>

          {/* Category Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CategoryBreakdown 
              title="Essential Expenses"
              categories={actualCategories.essentials}
              color="#f97316"
            />
            <CategoryBreakdown 
              title="Commitments & Debt"
              categories={actualCategories.commitments}
              color="#ef4444"
            />
            <CategoryBreakdown 
              title="Savings & Goals"
              categories={actualCategories.savings}
              color="#8b5cf6"
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTransaction}
      />
      </div>
    </WelcomeBackground>
  );
}
