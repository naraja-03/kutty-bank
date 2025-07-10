import type { Transaction } from '../../../types/transaction';

export type { Transaction };

export interface RecentTransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: () => void;
  formatTime: (timestamp: string | Date) => string;
  formatAmount: (amount: number, type: 'income' | 'expense') => string;
  dropdownOpen: string | null;
  setDropdownOpen: (id: string | null) => void;
  className?: string;
}
