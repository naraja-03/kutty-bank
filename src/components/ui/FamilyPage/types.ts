export interface FamilyPageProps {
  className?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'admin' | 'member' | 'view-only';
  joinedAt: Date;
  lastActive?: Date;
  totalContributions: number;
}

export interface FamilySettings {
  name: string;
  budgetCap?: number;
  currency: string;
  timezone: string;
}

export interface InviteFormData {
  email: string;
  role: 'admin' | 'member' | 'view-only';
}
