export interface ThreadPeriod {
  id: string;
  label: string;
  startDate?: Date;
  endDate?: Date;
  isCustomBudget?: boolean;
  budgetId?: string;
}

export interface PeriodFilterHeaderProps {
  activeThread: ThreadPeriod;
  className?: string;
}
