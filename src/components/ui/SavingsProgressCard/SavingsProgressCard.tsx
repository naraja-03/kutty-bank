'use client';

import { Target } from 'lucide-react';
import { clsx } from 'clsx';
import { SavingsProgressCardProps } from './types';

export default function SavingsProgressCard({ 
  progress, 
  className 
}: SavingsProgressCardProps) {
  return (
    <div className={clsx(
      'bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-xl mb-4',
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center text-white text-sm">
          <Target size={14} className="mr-2 text-purple-400" />
          Savings Progress
        </h3>
        <span className="text-xs text-gray-400">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-purple-900 to-purple-800 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
