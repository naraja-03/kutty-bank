export interface BottomNavProps {
  activeTab?: 'dashboard' | 'messages' | 'activity' | 'family';
  onTabChange?: (tab: string) => void;
  onAddClick?: () => void;
}

export interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
}
