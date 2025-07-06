export type BudgetPeriod = 'week' | 'month' | 'year';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: string;
  category: string;
  note?: string;
}

export interface BudgetProgress {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  progress: number;
  isOverBudget: boolean;
}

export function calculateBudgetProgress(
  transactions: Transaction[],
  period: BudgetPeriod,
  targetAmount: number
): BudgetProgress {
  const now = new Date();
  let periodStart: Date;
  
  switch (period) {
    case 'week':
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      break;
    case 'month':
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      periodStart = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  const periodTransactions = transactions.filter(t => 
    new Date(t.createdAt) >= periodStart
  );
  
  const totalIncome = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netAmount = totalIncome - totalExpenses;
  const progress = targetAmount > 0 ? (totalExpenses / targetAmount) * 100 : 0;
  const isOverBudget = totalExpenses > targetAmount;
  
  return {
    totalIncome,
    totalExpenses,
    netAmount,
    progress,
    isOverBudget
  };
}
