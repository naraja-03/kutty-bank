import { FamilyBudgetData } from '../types';

// 50/30/20 Budget Rule percentages
export const BUDGET_RULE = {
  ESSENTIALS: 50, // 50% for needs
  COMMITMENTS: 30, // 30% for wants/commitments  
  SAVINGS: 20, // 20% for savings
} as const;

export interface BudgetAllocation {
  totalIncome: number;
  essentialsLimit: number;
  commitmentsLimit: number;
  savingsLimit: number;
  essentialsUsed: number;
  commitmentsUsed: number;
  savingsUsed: number;
  essentialsRemaining: number;
  commitmentsRemaining: number;
  savingsRemaining: number;
  essentialsPercentage: number;
  commitmentsPercentage: number;
  savingsPercentage: number;
  totalUsedPercentage: number;
  isWithinLimits: boolean;
}

export function calculateBudgetAllocation(data: FamilyBudgetData): BudgetAllocation {
  const totalIncome = data.income.reduce((sum, source) => sum + source.amount, 0);
  
  // Calculate limits based on 50/30/20 rule
  const essentialsLimit = (totalIncome * BUDGET_RULE.ESSENTIALS) / 100;
  const commitmentsLimit = (totalIncome * BUDGET_RULE.COMMITMENTS) / 100;
  const savingsLimit = (totalIncome * BUDGET_RULE.SAVINGS) / 100;
  
  // Calculate currently used amounts
  const essentialsUsed = Array.isArray(data.essentials) 
    ? data.essentials.reduce((sum, expense) => sum + expense.amount, 0)
    : Object.values(data.essentials).reduce((sum, val) => sum + val, 0);
    
  const commitmentsUsed = Array.isArray(data.commitments)
    ? data.commitments.reduce((sum, expense) => sum + expense.amount, 0) 
    : Object.values(data.commitments).reduce((sum, val) => sum + val, 0);
    
  const savingsUsed = Array.isArray(data.savings)
    ? data.savings.reduce((sum, expense) => sum + expense.amount, 0)
    : Object.values(data.savings).reduce((sum, val) => sum + val, 0);
  
  // Calculate remaining amounts
  const essentialsRemaining = Math.max(0, essentialsLimit - essentialsUsed);
  const commitmentsRemaining = Math.max(0, commitmentsLimit - commitmentsUsed);
  const savingsRemaining = Math.max(0, savingsLimit - savingsUsed);
  
  // Calculate percentages
  const essentialsPercentage = totalIncome > 0 ? (essentialsUsed / totalIncome) * 100 : 0;
  const commitmentsPercentage = totalIncome > 0 ? (commitmentsUsed / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (savingsUsed / totalIncome) * 100 : 0;
  const totalUsedPercentage = essentialsPercentage + commitmentsPercentage + savingsPercentage;
  
  // Check if within limits
  const isWithinLimits = totalUsedPercentage <= 100 && 
                        essentialsPercentage <= BUDGET_RULE.ESSENTIALS &&
                        commitmentsPercentage <= BUDGET_RULE.COMMITMENTS &&
                        savingsPercentage <= BUDGET_RULE.SAVINGS;
  
  return {
    totalIncome,
    essentialsLimit,
    commitmentsLimit, 
    savingsLimit,
    essentialsUsed,
    commitmentsUsed,
    savingsUsed,
    essentialsRemaining,
    commitmentsRemaining,
    savingsRemaining,
    essentialsPercentage,
    commitmentsPercentage,
    savingsPercentage,
    totalUsedPercentage,
    isWithinLimits
  };
}

export function canAddExpense(
  data: FamilyBudgetData, 
  category: 'essentials' | 'commitments' | 'savings',
  amount: number
): { canAdd: boolean; reason?: string; availableAmount: number } {
  const allocation = calculateBudgetAllocation(data);
  
  switch (category) {
    case 'essentials':
      if (amount <= allocation.essentialsRemaining) {
        return { canAdd: true, availableAmount: allocation.essentialsRemaining };
      }
      return { 
        canAdd: false, 
        reason: `Amount exceeds essentials limit. Available: ₹${allocation.essentialsRemaining.toLocaleString()}`,
        availableAmount: allocation.essentialsRemaining
      };
      
    case 'commitments':
      if (amount <= allocation.commitmentsRemaining) {
        return { canAdd: true, availableAmount: allocation.commitmentsRemaining };
      }
      return { 
        canAdd: false, 
        reason: `Amount exceeds commitments limit. Available: ₹${allocation.commitmentsRemaining.toLocaleString()}`,
        availableAmount: allocation.commitmentsRemaining
      };
      
    case 'savings':
      if (amount <= allocation.savingsRemaining) {
        return { canAdd: true, availableAmount: allocation.savingsRemaining };
      }
      return { 
        canAdd: false, 
        reason: `Amount exceeds savings limit. Available: ₹${allocation.savingsRemaining.toLocaleString()}`,
        availableAmount: allocation.savingsRemaining
      };
      
    default:
      return { canAdd: false, reason: 'Invalid category', availableAmount: 0 };
  }
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString()}`;
}

export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}
