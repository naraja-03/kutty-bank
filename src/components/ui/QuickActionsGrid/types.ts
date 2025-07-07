import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  color: 'green' | 'red' | 'blue' | 'purple';
}

export interface QuickActionsGridProps {
  totalIncome: string;
  totalExpenses: string;
  netAmount: string;
  savingsTarget: string;
  className?: string;
}
