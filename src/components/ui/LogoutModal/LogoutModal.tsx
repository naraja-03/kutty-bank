import ConfirmationModal from '../ConfirmationModal';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, userName }: LogoutModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sign Out"
      message={`Are you sure you want to sign out${userName ? `, ${userName}` : ''}?`}
      confirmText="Sign Out"
      variant="info"
    />
  );
}
