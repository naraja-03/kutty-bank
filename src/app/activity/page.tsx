import ActivityFeed from '../../components/ui/ActivityFeed';
import AuthGuard from '../../components/AuthGuard';

export default function ActivityPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ActivityFeed className="h-screen" />
    </AuthGuard>
  );
}
