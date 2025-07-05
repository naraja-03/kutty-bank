'use client';

import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import { User } from 'lucide-react';
import Image from 'next/image';
import { TransactionPostProps } from './types';

export default function TransactionPost({
  userName,
  profileImage,
  amount,
  category,
  timestamp,
  type,
  note,
  image,
  className
}: TransactionPostProps) {
  const formatTimestamp = (ts: string | Date) => {
    const date = typeof ts === 'string' ? new Date(ts) : ts;
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={clsx(
      'bg-black border-b border-gray-800 p-4 hover:bg-gray-950 transition-colors duration-200',
      className
    )}>
      <div className="flex items-start space-x-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${userName}'s profile`}
              width={40}
              height={40}
              className="rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
              <User size={20} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-white font-medium text-sm">{userName}</span>
            <span className="text-gray-500 text-xs">
              {formatTimestamp(timestamp)}
            </span>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={clsx(
                'text-lg font-semibold',
                type === 'income' ? 'text-green-400' : 'text-red-400'
              )}>
                {type === 'income' ? '+' : '-'}{formatAmount(Math.abs(amount))}
              </span>
              <span className="text-gray-400 text-sm">• {category}</span>
            </div>

            {/* Note */}
            {note && (
              <p className="text-gray-300 text-sm leading-relaxed">
                {note}
              </p>
            )}

            {/* Image */}
            {image && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-700">
                <Image
                  src={image}
                  alt="Transaction image"
                  width={400}
                  height={300}
                  className="w-full max-w-sm h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Hint */}
          <div className="mt-3 text-xs text-gray-500">
            {type === 'income' ? '💰 Income added' : '💸 Expense logged'}
          </div>
        </div>
      </div>
    </div>
  );
}
