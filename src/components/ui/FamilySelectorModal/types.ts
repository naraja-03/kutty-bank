export interface FamilySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFamily: (familyId: string) => void;
  onCreateFamily?: (familyData: {
    name: string;
    targetSavingPerMonth: number;
    members: Array<{ email: string; name: string; role: 'admin' | 'member' | 'viewer' }>;
  }) => void;
}

export interface FamilyOption {
  id: string;
  name: string;
  memberCount: number;
  isActive: boolean;
}
