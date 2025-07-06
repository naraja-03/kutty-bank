export interface FamilySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFamily: (familyId: string) => void;
}

export interface FamilyOption {
  id: string;
  name: string;
  memberCount: number;
  isActive: boolean;
}
