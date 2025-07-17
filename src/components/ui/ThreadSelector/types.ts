export interface ThreadSelectorProps {
  activeThread: ThreadPeriod;
  onThreadChange: (thread: ThreadPeriod) => void;
  className?: string;
}

export interface ThreadPeriod {
  id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface ThreadSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ThreadPeriod[];
  activeThread: ThreadPeriod;
  onThreadSelect: (thread: ThreadPeriod) => void;
  onNewThread: () => void;
}

export const DEFAULT_THREADS: ThreadPeriod[] = [
  {
    id: 'current-year',
    label: 'This Year',
    value: 'year',
  },
  {
    id: 'current-month',
    label: 'This Month',
    value: 'month',
  },
  {
    id: 'current-week',
    label: 'This Week',
    value: 'week',
    isActive: true,
  },
];
