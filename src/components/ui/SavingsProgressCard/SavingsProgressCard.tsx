'use client';

import { Target, AlertTriangle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { SavingsProgressCardProps } from './types';

export default function SavingsProgressCard({
  progress,
  className
}: SavingsProgressCardProps) {
  const getProgressColorClasses = () => {
    if (progress < 30) {
      return {
        containerClasses: 'bg-gradient-to-br from-red-950/30 to-red-900/15 border-red-600/40',
        iconColor: 'text-red-400',
        progressBar: 'bg-gradient-to-r from-red-600 to-red-500',
        alertIcon: AlertCircle,
        alertMessage: 'Critical: Savings are critically low!'
      };
    } else if (progress < 50) {
      return {
        containerClasses: 'bg-gradient-to-br from-orange-950/30 to-orange-900/15 border-orange-600/40',
        iconColor: 'text-orange-400',
        progressBar: 'bg-gradient-to-r from-orange-600 to-orange-500',
        alertIcon: AlertTriangle,
        alertMessage: 'Warning: Savings below target'
      };
    } else if (progress < 80) {
      return {
        containerClasses: 'bg-gradient-to-br from-yellow-950/30 to-yellow-900/15 border-yellow-600/40',
        iconColor: 'text-yellow-400',
        progressBar: 'bg-gradient-to-r from-yellow-600 to-yellow-500',
        alertIcon: AlertTriangle,
        alertMessage: 'Caution: Consider increasing savings'
      };
    } else {
      return {
        containerClasses: 'bg-gradient-to-br from-green-950/30 to-green-900/15 border-green-600/40',
        iconColor: 'text-green-400',
        progressBar: 'bg-gradient-to-r from-green-600 to-green-500',
        alertIcon: null,
        alertMessage: null
      };
    }
  };

  const colorClasses = getProgressColorClasses();
  const AlertIcon = colorClasses.alertIcon;

  return (
    <div className={clsx(
      'backdrop-blur-xl rounded-2xl p-3 border shadow-xl mb-4',
      colorClasses.containerClasses,
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center text-white text-sm">
          <Target size={14} className={clsx('mr-2', colorClasses.iconColor)} />
          Savings Progress
        </h3>
        <span className="text-xs text-gray-300">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
        <div
          className={clsx(colorClasses.progressBar, 'h-1.5 rounded-full transition-all duration-300')}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {colorClasses.alertMessage && AlertIcon && (
        <div className={clsx(
          'flex items-center text-xs p-2 rounded-lg mt-2',
          'bg-black/20')}>
          <AlertIcon size={12} className={clsx('mr-2', colorClasses.iconColor)} />
          {colorClasses.alertMessage}
        </div>
      )}
    </div>
  );
}
