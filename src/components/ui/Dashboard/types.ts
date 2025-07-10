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
