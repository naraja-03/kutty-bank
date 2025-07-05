export interface ThreadBottomBarProps {
  activeThread: ThreadPeriod;
  threads?: ThreadPeriod[];
  onThreadChange: (thread: ThreadPeriod) => void;
  onCustomThread: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
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

export interface ThreadQuickAction {
  id: string;
  label: string;
  period: ThreadPeriod;
  icon?: string;
}
