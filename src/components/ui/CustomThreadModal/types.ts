export interface CustomThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateThread: (label: string, startDate: Date, endDate: Date) => void;
  className?: string;
}

export interface CustomThreadForm {
  label: string;
  startDate: string;
  endDate: string;
}
