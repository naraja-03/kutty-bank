export interface FamilyBudgetWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (familyData: FamilyBudgetData) => void;
  editMode?: boolean;
  existingData?: FamilyBudgetData;
}

export interface BasicInfo {
  name: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDay: number;
}

export interface Category {
  id: string;
  name: string;
  mainCategory: 'income' | 'essentials' | 'commitments' | 'savings';
  isDefault: boolean;
  icon?: string;
  color?: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  categoryId: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
}

export interface CategoryAmounts {
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  internet: number;
  education: number;
  medical: number;
}

export interface CommitmentAmounts {
  loanEmi: number;
  creditCard: number;
  subscriptions: number;
  insurance: number;
}

export interface SavingsAmounts {
  emergencyFund: number;
  longTermGoal: number;
  sip: number;
}

export interface FamilyBudgetData {
  basicInfo: BasicInfo;
  categories: Category[];
  income: IncomeSource[];
  essentials: CategoryAmounts | ExpenseItem[];
  commitments: CommitmentAmounts | ExpenseItem[];
  savings: SavingsAmounts | ExpenseItem[];
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
}

export interface WizardStep {
  id: number;
  title: string;
  subtitle: string;
  component: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Start with the basics",
    subtitle: "We recommend using the same budget period as your regular income.",
    component: 'BasicInfoStep'
  },
  {
    id: 2,
    title: "Add your income",
    subtitle: "Include all sources of income for accurate planning.",
    component: 'IncomeStep'
  },
  {
    id: 3,
    title: "Essential expenses",
    subtitle: "Monthly expenses you can't avoid - aim for 50-70% of income.",
    component: 'EssentialsStep'
  },
  {
    id: 4,
    title: "Commitments",
    subtitle: "Fixed monthly commitments - aim for 20-30% of income.",
    component: 'CommitmentsStep'
  },
  {
    id: 5,
    title: "Savings & Investments", 
    subtitle: "Money you save and invest - aim for at least 20% of income.",
    component: 'SavingsStep'
  },
  {
    id: 6,
    title: "Review & Complete",
    subtitle: "Review your budget and finalize your family financial plan.",
    component: 'SummaryStep'
  }
];
