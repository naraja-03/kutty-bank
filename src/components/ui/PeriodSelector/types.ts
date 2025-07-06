export interface PeriodData {
  id: string;
  label: string;
  date: Date;
  value: number;
  isUnderControl: boolean;
  isActive: boolean;
}

export interface PeriodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onPeriodSelect: (period: PeriodData) => void;
}
