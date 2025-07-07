'use client';

import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { QuickActionsGridProps, QuickAction } from './types';

export default function QuickActionsGrid({ 
  totalIncome, 
  totalExpenses, 
  netAmount, 
  savingsTarget,
  className 
}: QuickActionsGridProps) {
  const quickActions: QuickAction[] = [
    { id: 'income', label: 'Income', icon: TrendingUp, value: totalIncome, color: 'green' },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown, value: totalExpenses, color: 'red' },
    { id: 'balance', label: 'Balance', icon: Wallet, value: netAmount, color: 'blue' },
    { id: 'goal', label: 'Savings Goal', icon: Target, value: savingsTarget, color: 'purple' },
  ];

  return (
    <div className={clsx('grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6', className)}>
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <div
            key={action.id}
            className={clsx(
              'bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl',
              action.color === 'green' && 'bg-gradient-to-br from-green-950/30 to-green-900/15 border-green-600/20',
              action.color === 'red' && 'bg-gradient-to-br from-red-950/30 to-red-900/15 border-red-600/20',
              action.color === 'blue' && 'bg-gradient-to-br from-blue-950/30 to-blue-900/15 border-blue-600/20',
              action.color === 'purple' && 'bg-gradient-to-br from-purple-950/30 to-purple-900/15 border-purple-600/20'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon
                size={20}
                className={clsx(
                  action.color === 'green' && 'text-green-400',
                  action.color === 'red' && 'text-red-400',
                  action.color === 'blue' && 'text-blue-400',
                  action.color === 'purple' && 'text-purple-400'
                )}
              />
              <span className="text-xs text-gray-400 font-medium">
                {action.id === 'income' && '+12.5%'}
                {action.id === 'expenses' && '-8.2%'}
                {action.id === 'balance' && 'Available'}
                {action.id === 'goal' && 'Target'}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-lg md:text-xl font-bold text-white">{action.value}</p>
              <p className="text-gray-400 text-xs md:text-sm">{action.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
