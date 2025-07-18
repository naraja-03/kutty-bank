export interface SwipeableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  dismissible?: boolean;
  children: React.ReactNode;
  showAboveBottomNav?: boolean;
}
