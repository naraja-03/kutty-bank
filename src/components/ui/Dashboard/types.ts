export interface DashboardProps {
  className?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal?: number;
  savingsProgress?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  color: 'green' | 'red' | 'blue' | 'purple';
}
