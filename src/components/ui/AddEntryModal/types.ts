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
  emoji: string;
}

export const EXPENSE_CATEGORIES: CategoryOption[] = [
  { value: 'food', label: 'Food & Dining', emoji: '🍽️' },
  { value: 'transportation', label: 'Transportation', emoji: '🚗' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'bills', label: 'Bills & Utilities', emoji: '💡' },
  { value: 'health', label: 'Health & Fitness', emoji: '🏥' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'other', label: 'Other', emoji: '📦' }
];

export const INCOME_CATEGORIES: CategoryOption[] = [
  { value: 'salary', label: 'Salary', emoji: '💼' },
  { value: 'freelance', label: 'Freelance', emoji: '💻' },
  { value: 'business', label: 'Business', emoji: '🏢' },
  { value: 'investment', label: 'Investment', emoji: '📈' },
  { value: 'gift', label: 'Gift', emoji: '🎁' },
  { value: 'refund', label: 'Refund', emoji: '💰' },
  { value: 'other', label: 'Other', emoji: '📦' }
];
