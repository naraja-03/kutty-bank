export interface ThreadSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ThreadPeriod[];
  activeThread: ThreadPeriod;
  onThreadSelect: (thread: ThreadPeriod) => void;
}

export interface ThreadPeriod {
  id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  color?: string;
}

export interface SavedThread extends ThreadPeriod {
  createdAt: Date;
  totalTransactions: number;
  totalAmount: number;
  isCustom?: boolean;
  description?: string;
  targetAmount?: number;
}
