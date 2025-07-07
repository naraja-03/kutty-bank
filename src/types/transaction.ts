export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note?: string;
  createdAt: string | Date;
  userName: string;
  userId: string;
}

export interface TransactionWithFamily extends Transaction {
  familyId: string;
  familyName?: string;
  budgetId?: string;
}
