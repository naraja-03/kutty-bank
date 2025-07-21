'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  amount: number;
}

export interface IncomeSource {
  id: string;
  category: string;
  source: string;
  amount: number;
}

export interface FamilySetupData {
  familyInfo: {
    name: string;
    trackingPeriod: 'daily' | 'weekly' | 'monthly';
    startDate: string;
  };
  income: {
    sources: Array<IncomeSource>;
    totalIncome: number;
  };
  essentials: {
    categories: Array<CategoryItem>;
    totalEssentials: number;
  };
  commitments: {
    categories: Array<CategoryItem>;
    totalCommitments: number;
  };
  savings: {
    categories: Array<CategoryItem>;
    totalSavings: number;
    availableBalance: number;
  };
}

interface BudgetCalculations {
  totalIncome: number;
  essentialPercentage: number;
  commitmentPercentage: number;
  savingsPercentage: number;
  totalSpendingPercentage: number;
  isOverBudget: boolean;
  availableForEssentials: number;
  availableForCommitments: number;
  availableForSavings: number;
}

interface FamilySetupContextType {
  formData: FamilySetupData;
  updateFormData: (data: Partial<FamilySetupData>) => void;
  budget: BudgetCalculations;
  resetFormData: () => void;
}

const initialFormData: FamilySetupData = {
  familyInfo: {
    name: '',
    trackingPeriod: 'monthly',
    startDate: '1',
  },
  income: {
    sources: [],
    totalIncome: 0,
  },
  essentials: {
    categories: [],
    totalEssentials: 0,
  },
  commitments: {
    categories: [],
    totalCommitments: 0,
  },
  savings: {
    categories: [],
    totalSavings: 0,
    availableBalance: 0,
  },
};

const FamilySetupContext = createContext<FamilySetupContextType | undefined>(undefined);

export const useFamilySetup = () => {
  const context = useContext(FamilySetupContext);
  if (!context) {
    throw new Error('useFamilySetup must be used within a FamilySetupProvider');
  }
  return context;
};

interface FamilySetupProviderProps {
  children: ReactNode;
}

export const FamilySetupProvider = ({ children }: FamilySetupProviderProps) => {
  const [formData, setFormData] = useState<FamilySetupData>(initialFormData);

  const updateFormData = (stepData: Partial<FamilySetupData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...stepData };
      
      // Recalculate available balance
      const totalIncome = updated.income.totalIncome;
      const totalEssentials = updated.essentials.totalEssentials;
      const totalCommitments = updated.commitments.totalCommitments;
      const availableBalance = totalIncome - totalEssentials - totalCommitments;
      
      updated.savings.availableBalance = Math.max(0, availableBalance);
      
      return updated;
    });
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  // Calculate budget percentages and availability
  const budget: BudgetCalculations = {
    totalIncome: formData.income.totalIncome,
    essentialPercentage: formData.income.totalIncome > 0 
      ? (formData.essentials.totalEssentials / formData.income.totalIncome) * 100 
      : 0,
    commitmentPercentage: formData.income.totalIncome > 0 
      ? (formData.commitments.totalCommitments / formData.income.totalIncome) * 100 
      : 0,
    savingsPercentage: formData.income.totalIncome > 0 
      ? (formData.savings.totalSavings / formData.income.totalIncome) * 100 
      : 0,
    get totalSpendingPercentage() {
      return this.essentialPercentage + this.commitmentPercentage + this.savingsPercentage;
    },
    get isOverBudget() {
      return this.totalSpendingPercentage > 100;
    },
    availableForEssentials: formData.income.totalIncome,
    availableForCommitments: formData.income.totalIncome - formData.essentials.totalEssentials,
    availableForSavings: formData.income.totalIncome - formData.essentials.totalEssentials - formData.commitments.totalCommitments,
  };

  const value: FamilySetupContextType = {
    formData,
    updateFormData,
    budget,
    resetFormData,
  };

  return (
    <FamilySetupContext.Provider value={value}>
      {children}
    </FamilySetupContext.Provider>
  );
};
