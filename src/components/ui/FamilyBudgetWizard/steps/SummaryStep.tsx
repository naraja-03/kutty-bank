'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FamilyBudgetData } from '../types';
import { BUDGET_RULE } from '../utils/budgetValidation';

interface SummaryStepProps {
  data: FamilyBudgetData;
  onPrevious: () => void;
  onComplete: () => void;
  editMode: boolean;
}

export default function SummaryStep({ data, onPrevious, onComplete, editMode }: SummaryStepProps) {
  const totalAllocated = data.totalExpenses + data.totalSavings;
  const remainingIncome = data.totalIncome - totalAllocated;
  
  // Calculate category totals for pie chart
  const getEssentialsTotal = () => {
    if (Array.isArray(data.essentials)) {
      return data.essentials.reduce((sum, expense) => sum + expense.amount, 0);
    }
    return Object.values(data.essentials).reduce((sum, val) => sum + val, 0);
  };

  const getCommitmentsTotal = () => {
    if (Array.isArray(data.commitments)) {
      return data.commitments.reduce((sum, expense) => sum + expense.amount, 0);
    }
    return Object.values(data.commitments).reduce((sum, val) => sum + val, 0);
  };

  const getSavingsTotal = () => {
    if (Array.isArray(data.savings)) {
      return data.savings.reduce((sum, expense) => sum + expense.amount, 0);
    }
    return Object.values(data.savings).reduce((sum, val) => sum + val, 0);
  };

  const essentialsTotal = getEssentialsTotal();
  const commitmentsTotal = getCommitmentsTotal();
  const savingsTotal = getSavingsTotal();
  
  const essentialsPercentage = data.totalIncome > 0 ? (essentialsTotal / data.totalIncome) * 100 : 0;
  const commitmentsPercentage = data.totalIncome > 0 ? (commitmentsTotal / data.totalIncome) * 100 : 0;
  const savingsPercentage = data.totalIncome > 0 ? (savingsTotal / data.totalIncome) * 100 : 0;
  const remainingPercentage = data.totalIncome > 0 ? (remainingIncome / data.totalIncome) * 100 : 0;

  // Pie chart data - using percentages for chart values
  const pieData = [
    {
      name: 'Essentials',
      value: essentialsPercentage,
      rawAmount: essentialsTotal,
      target: BUDGET_RULE.ESSENTIALS,
      color: '#FF6B6B'
    },
    {
      name: 'Commitments', 
      value: commitmentsPercentage,
      rawAmount: commitmentsTotal,
      target: BUDGET_RULE.COMMITMENTS,
      color: '#4ECDC4'
    },
    {
      name: 'Savings',
      value: savingsPercentage,
      rawAmount: savingsTotal,
      target: BUDGET_RULE.SAVINGS,
      color: '#45B7D1'
    },
    {
      name: 'Available',
      value: remainingPercentage > 0 ? remainingPercentage : 0,
      rawAmount: remainingIncome > 0 ? remainingIncome : 0,
      target: 0,
      color: '#96CEB4'
    }
  ].filter(item => item.value > 0);

  const customTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string; rawAmount: number; target: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3">
          <p className="text-white font-medium">{data.payload.name}</p>
          <p className="text-gray-300">₹{data.payload.rawAmount.toLocaleString()}</p>
          <p className="text-gray-400">{data.value.toFixed(1)}% {data.payload.target > 0 ? `(Target: ${data.payload.target}%)` : ''}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Confetti celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          You&apos;re all set up!
        </h3>
        <p className="text-gray-400">
          Great job! Remember you can edit everything you&apos;ve just entered and add new categories later on.
        </p>
      </motion.div>

      {/* Total planned expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center bg-white/5 rounded-xl p-6"
      >
        <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Total Planned Expenses
        </p>
        <p className="text-4xl font-bold text-white">
          ₹{totalAllocated.toLocaleString()}
        </p>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 rounded-xl p-6"
      >
        <h4 className="text-white font-medium mb-4 text-center">Budget Allocation</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-white text-sm">{item.name}</span>
              <span className="text-gray-400 text-sm">
                {item.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Budget breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-white">Income</span>
          </div>
          <span className="text-white font-medium">₹{data.totalIncome.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-[#FF6B6B] rounded"></div>
            <span className="text-white">Essentials</span>
          </div>
          <span className="text-white font-medium">₹{essentialsTotal.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-[#4ECDC4] rounded"></div>
            <span className="text-white">Commitments</span>
          </div>
          <span className="text-white font-medium">₹{commitmentsTotal.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-[#45B7D1] rounded"></div>
            <span className="text-white">Savings</span>
          </div>
          <span className="text-white font-medium">₹{savingsTotal.toLocaleString()}</span>
        </div>

        {remainingIncome > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#96CEB4] rounded"></div>
              <span className="text-white">Available</span>
            </div>
            <span className="text-white font-medium">₹{remainingIncome.toLocaleString()}</span>
          </div>
        )}
      </motion.div>

      {/* Budget Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white/5 rounded-xl p-4"
      >
        <h4 className="text-white font-medium mb-3">Budget Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Essentials:</span>
            <span className="text-white">{essentialsPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Commitments:</span>
            <span className="text-white">{commitmentsPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Savings:</span>
            <span className="text-white">{savingsPercentage.toFixed(1)}%</span>
          </div>
          {remainingPercentage > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Available:</span>
              <span className="text-white">{remainingPercentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
        
      </motion.div>

      {/* Action buttons */}
      <div className="flex space-x-3 pt-8">
        <button
          onClick={onPrevious}
          className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onComplete}
          className="flex-1 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors font-medium"
        >
          {editMode ? 'Update Family' : 'Create Family'}
        </button>
      </div>
    </div>
  );
}
