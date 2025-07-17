'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit3, Trash2, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  userName: string;
  userId: string;
  createdAt: string | Date;
  note?: string;
}

interface SwipeableTransactionCardProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReply?: () => void;
  formatTime: (timestamp: string | Date) => string;
  formatAmount: (amount: number, type: 'income' | 'expense') => string;
  dropdownOpen: string | null;
  setDropdownOpen: (id: string | null) => void;
  enableSwipe?: boolean;
  compact?: boolean;
}

export default function SwipeableTransactionCard({
  transaction,
  onEdit,
  onDelete,
  onReply,
  formatTime,
  formatAmount,
  dropdownOpen,
  setDropdownOpen,
  enableSwipe = true,
  compact = false,
}: SwipeableTransactionCardProps) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const [replied, setReplied] = useState(false);

  const bind = useDrag(
    ({ active, movement: [mx], cancel }) => {
      if (!enableSwipe || !onReply) return;

      if (mx < 0) {
        cancel();
        return;
      }

      const trigger = mx > 80;

      if (active) {
        api.start({ x: Math.min(mx, 100), immediate: true });
      } else {
        if (trigger && !replied) {
          setReplied(true);
          onReply();

          setTimeout(() => {
            api.start({ x: 0 });
            setReplied(false);
          }, 1000);
        } else {
          api.start({ x: 0 });
        }
      }
    },
    {
      axis: 'x',
      bounds: { left: 0, right: 100 },
      rubberband: true,
    }
  );

  return (
    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
      {enableSwipe && onReply && (
        <animated.div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 transition-opacity duration-200"
          style={{
            width: '100px',
            opacity: x.to((val: number) => (val > 30 ? 1 : 0)),
          }}
        >
          <MessageCircle size={24} className="text-white" />
        </animated.div>
      )}

      <animated.div
        {...(enableSwipe ? bind() : {})}
        style={enableSwipe ? { x } : {}}
        className={clsx('touch-pan-y', compact ? 'p-3' : 'p-4')}
      >
        <div className={clsx('flex items-start justify-between', compact ? 'mb-2' : 'mb-3')}>
          <div className="flex items-center space-x-3 flex-1">
            <div
              className={clsx(
                'rounded-full bg-gradient-to-br from-gray-950 to-black flex items-center justify-center border border-gray-800 flex-shrink-0',
                compact ? 'w-8 h-8' : 'w-10 h-10'
              )}
            >
              <span className={clsx('text-white font-semibold', compact ? 'text-xs' : 'text-sm')}>
                {getInitials(transaction.userName || 'U')}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <span className={clsx('text-white font-medium', compact ? 'text-xs' : 'text-sm')}>
                {transaction.userName || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="relative dropdown-container ml-2">
            <button
              onClick={() =>
                setDropdownOpen(dropdownOpen === transaction.id ? null : transaction.id)
              }
              className="text-gray-500 hover:text-gray-300 transition-colors p-2"
            >
              <MoreHorizontal size={compact ? 14 : 16} />
            </button>

            {dropdownOpen === transaction.id && (
              <div className="absolute right-0 top-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => onEdit(transaction.id)}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <div className={clsx('flex-shrink-0', compact ? 'w-8' : 'w-10')}></div>

          <div className="flex-1">
            <div
              className={clsx(
                'font-bold mb-1',
                compact ? 'text-lg' : 'text-2xl',
                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
              )}
            >
              {formatAmount(transaction.amount, transaction.type)}
            </div>

            <div className={clsx('text-gray-300', compact ? 'text-xs' : 'text-sm')}>
              {transaction.type === 'income'
                ? `received from ${transaction.category}`
                : `spent on ${transaction.category}`}
            </div>

            {transaction.note && (
              <div className={clsx(compact ? 'mt-2' : 'mt-3')}>
                <p
                  className={clsx('text-gray-300 leading-relaxed', compact ? 'text-xs' : 'text-sm')}
                >
                  {transaction.note}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-end">
            <p className={clsx('text-gray-400', compact ? 'text-xs' : 'text-xs')}>
              {formatTime(transaction.createdAt)}
            </p>
          </div>
        </div>
      </animated.div>
    </div>
  );
}
