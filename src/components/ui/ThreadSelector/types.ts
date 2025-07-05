export interface ThreadSelectorProps {
  activeThread: ThreadPeriod;
  onThreadChange: (thread: ThreadPeriod) => void;
  className?: string;
}

export interface ThreadPeriod {
  id: string;
  label: string;
  value: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface CustomThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (thread: ThreadPeriod) => void;
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
    id: 'current-week',
    label: 'This Week',
    value: 'week',
    isActive: true
  },
  {
    id: 'current-month',
    label: 'This Month',
    value: 'month'
  },
  {
    id: 'current-quarter',
    label: 'This Quarter',
    value: 'quarter'
  },
  {
    id: 'current-year',
    label: 'This Year',
    value: 'year'
  }
];
