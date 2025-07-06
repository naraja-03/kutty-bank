export interface TransactionPostProps {
  id?: string;
  userName: string;
  amount: number;
  category: string;
  timestamp: string | Date;
  type: 'income' | 'expense';
  note?: string;
  image?: string;
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdateNote?: (id: string, note: string) => void;
  showActions?: boolean;
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
