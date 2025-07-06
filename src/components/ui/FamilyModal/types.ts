export interface FamilyMember {
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface FamilyFormData {
  name: string;
  targetSavingPerMonth: number;
  members: FamilyMember[];
}

export interface Family {
  id: string;
  name: string;
  members?: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
}

export interface FamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFamily: (familyId: string) => void;
  onCreateFamily: (familyData: FamilyFormData) => void;
  families: Family[];
  isLoading: boolean;
  canDismiss?: boolean;
}
