export interface ActivityFeedProps {
  className?: string;
}

export interface ActivityItem {
  id: string;
  type: 'transaction' | 'goal' | 'budget' | 'member';
  data: Record<string, unknown>;
  timestamp: Date;
}
