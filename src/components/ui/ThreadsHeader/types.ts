export interface ThreadsHeaderProps {
  title: string;
  onLeftAction?: () => void;
  onRightAction?: () => void;
  leftIcon?: React.ComponentType<{ size?: number; className?: string }>;
  rightIcon?: React.ComponentType<{ size?: number; className?: string }>;
  activeThread?: ThreadPeriod;
  showThreadSelector?: boolean;
  onThreadSelectorClick?: () => void;
  className?: string;
}

export interface ThreadPeriod {
  id: string;
  label: string;
  value: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}
