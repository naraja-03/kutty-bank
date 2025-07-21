'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface AvailableBalanceProps {
  totalIncome: number;
  usedAmount: number;
  label: string;
  targetPercentage?: number;
}

export const AvailableBalance = ({ 
  totalIncome, 
  usedAmount, 
  label, 
  targetPercentage 
}: AvailableBalanceProps) => {
  const { theme } = useTheme();
  
  const availableAmount = totalIncome - usedAmount;
  const usedPercentage = totalIncome > 0 ? (usedAmount / totalIncome) * 100 : 0;
  const isOverTarget = targetPercentage ? usedPercentage > targetPercentage : false;
  
  return (
    <div className={`border rounded-xl p-4 mb-6 ${
      isOverTarget
        ? theme === 'dark'
          ? 'bg-red-500/20 border-red-400/30'
          : 'bg-red-50 border-red-300'
        : theme === 'dark'
          ? 'bg-green-500/20 border-green-400/30'
          : 'bg-green-50 border-green-300'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{label}:</span>
        <div className="text-right">
          <span className={`font-bold text-lg ${
            isOverTarget 
              ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
              : theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}>
            {usedPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Available:</span>
        <span className={`font-bold text-lg ${
          availableAmount >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          ₹{availableAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
