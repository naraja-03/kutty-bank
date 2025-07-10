import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Gamepad2, 
  Zap, 
  Heart, 
  GraduationCap, 
  Plane, 
  MoreHorizontal,
  DollarSign,
  Laptop,
  Building,
  TrendingUp,
  Gift,
  ArrowDownLeft,
  Wallet,
  LucideIcon
} from 'lucide-react';

export interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  isLoading?: boolean;
  editData?: {
    id: string;
    amount: number;
    date: string;
    category: string;
    type: 'income' | 'expense';
    note?: string;
  };
}

export interface TransactionFormData {
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  budgetId?: string;
  note?: string;
  image?: File;
}

export interface CategoryOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const EXPENSE_CATEGORIES: CategoryOption[] = [
  { value: 'food', label: 'Food & Dining', icon: Utensils },
  { value: 'transport', label: 'Transportation', icon: Car },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'entertainment', label: 'Entertainment', icon: Gamepad2 },
  { value: 'bills', label: 'Bills & Utilities', icon: Zap },
  { value: 'healthcare', label: 'Health & Fitness', icon: Heart },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'other', label: 'Other', icon: MoreHorizontal }
];

export const INCOME_CATEGORIES: CategoryOption[] = [
  { value: 'salary', label: 'Salary', icon: DollarSign },
  { value: 'freelance', label: 'Freelance', icon: Laptop },
  { value: 'business', label: 'Business', icon: Building },
  { value: 'investment', label: 'Investment', icon: TrendingUp },
  { value: 'allowance', label: 'Allowance', icon: Wallet },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'refund', label: 'Refund', icon: ArrowDownLeft },
  { value: 'other', label: 'Other', icon: MoreHorizontal }
];
