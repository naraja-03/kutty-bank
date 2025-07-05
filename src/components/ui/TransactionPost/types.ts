export interface TransactionPostProps {
  userName: string;
  profileImage?: string;
  amount: number;
  category: string;
  timestamp: string | Date;
  type: 'income' | 'expense';
  note?: string;
  image?: string;
  className?: string;
}

export interface TransactionData {
  id: string;
  userId: string;
  userName: string;
  profileImage?: string;
  amount: number;
  category: string;
  timestamp: Date;
  type: 'income' | 'expense';
  note?: string;
  imageUrl?: string;
}
