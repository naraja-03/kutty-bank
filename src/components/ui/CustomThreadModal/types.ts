export interface CustomThreadFormData {
  id?: string;
  name: string;
  description: string;
  targetAmount: number;
}

export interface CustomThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  threadData?: CustomThreadFormData;
}
