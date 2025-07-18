'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertTriangle, Target, TrendingUp } from 'lucide-react';

interface BudgetAnalysisProps {
  totalIncome: number;
  essentialsTotal: number;
  commitmentsTotal: number;
  savingsTotal: number;
}

const COLORS = {
  essentials: '#FF6B6B',
  commitments: '#54A0FF', 
  savings: '#26DE81',
  remaining: '#9B59B6'
};

const BUDGET_RULES = {
  '50/30/20': {
    essentials: 50,
    commitments: 30,
    savings: 20,
    description: 'Balanced approach for steady income'
  },
  '70/20/10': {
    essentials: 70,
    commitments: 20,
    savings: 10,
    description: 'Conservative approach for tight budgets'
  },
  '40/30/30': {
    essentials: 40,
    commitments: 30,
    savings: 30,
    description: 'Aggressive savings approach'
  }
};

export default function BudgetAnalysis({ 
  totalIncome, 
  essentialsTotal, 
  commitmentsTotal, 
  savingsTotal 
}: BudgetAnalysisProps) {
  const totalExpenses = essentialsTotal + commitmentsTotal + savingsTotal;
  const remaining = Math.max(0, totalIncome - totalExpenses);

  const currentPercentages = {
    essentials: totalIncome > 0 ? (essentialsTotal / totalIncome) * 100 : 0,
    commitments: totalIncome > 0 ? (commitmentsTotal / totalIncome) * 100 : 0,
    savings: totalIncome > 0 ? (savingsTotal / totalIncome) * 100 : 0,
    remaining: totalIncome > 0 ? (remaining / totalIncome) * 100 : 0
  };

  const pieData = [
    { name: 'Essentials', value: essentialsTotal, percentage: currentPercentages.essentials, color: COLORS.essentials },
    { name: 'Commitments', value: commitmentsTotal, percentage: currentPercentages.commitments, color: COLORS.commitments },
    { name: 'Savings', value: savingsTotal, percentage: currentPercentages.savings, color: COLORS.savings },
    { name: 'Remaining', value: remaining, percentage: currentPercentages.remaining, color: COLORS.remaining }
  ].filter(item => item.value > 0);

  const getBestRule = () => {
    let bestRule = '50/30/20';
    let bestScore = Infinity;

    Object.entries(BUDGET_RULES).forEach(([ruleName, rule]) => {
      const score = Math.abs(rule.essentials - currentPercentages.essentials) +
                   Math.abs(rule.commitments - currentPercentages.commitments) +
                   Math.abs(rule.savings - currentPercentages.savings);
      
      if (score < bestScore) {
        bestScore = score;
        bestRule = ruleName;
      }
    });

    return { ruleName: bestRule, rule: BUDGET_RULES[bestRule as keyof typeof BUDGET_RULES] };
  };

  const { ruleName, rule } = getBestRule();
  const isGoodSavings = currentPercentages.savings >= 20;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-white/20">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300">₹{data.value.toLocaleString()}</p>
          <p className="text-gray-400">{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  if (totalIncome === 0) {
    return (
      <div className="bg-white/5 rounded-xl p-6 text-center">
        <p className="text-gray-400">Add income to see budget analysis</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center space-x-2">
        <Target className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-medium text-white">Budget Analysis</h3>
      </div>

      {/* Pie Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Current Breakdown */}
      <div className="space-y-3">
        <h4 className="text-white font-medium">Current Breakdown</h4>
        <div className="grid grid-cols-2 gap-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <p className="text-white text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs">{item.percentage.toFixed(1)}%</p>
              </div>
              <p className="text-white text-sm">₹{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Rule */}
      <div className="bg-white/5 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h4 className="text-white font-medium">Recommended: {ruleName} Rule</h4>
        </div>
        <p className="text-gray-300 text-sm">{rule.description}</p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-red-300 font-medium">{rule.essentials}%</p>
            <p className="text-gray-400 text-xs">Essentials</p>
          </div>
          <div className="text-center">
            <p className="text-blue-300 font-medium">{rule.commitments}%</p>
            <p className="text-gray-400 text-xs">Commitments</p>
          </div>
          <div className="text-center">
            <p className="text-green-300 font-medium">{rule.savings}%</p>
            <p className="text-gray-400 text-xs">Savings</p>
          </div>
        </div>
      </div>

      {/* Savings Alert */}
      {!isGoodSavings && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <p className="text-orange-300 font-medium">Low Savings Alert</p>
          </div>
          <p className="text-orange-200 text-sm mt-1">
            Try to increase savings to at least 20% of your income for financial security.
          </p>
        </div>
      )}

      {/* Suggestions */}
      <div className="space-y-2">
        <h4 className="text-white font-medium text-sm">Optimization Tips</h4>
        <div className="space-y-1">
          {currentPercentages.essentials > rule.essentials && (
            <p className="text-red-300 text-xs">• Consider reducing essential expenses by {(currentPercentages.essentials - rule.essentials).toFixed(1)}%</p>
          )}
          {currentPercentages.commitments > rule.commitments && (
            <p className="text-blue-300 text-xs">• Try to lower commitments by {(currentPercentages.commitments - rule.commitments).toFixed(1)}%</p>
          )}
          {currentPercentages.savings < rule.savings && (
            <p className="text-green-300 text-xs">• Aim to increase savings by {(rule.savings - currentPercentages.savings).toFixed(1)}%</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
