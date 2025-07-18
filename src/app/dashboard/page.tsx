import Dashboard from '../../components/ui/Dashboard';
import AuthGuard from '../../components/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <Dashboard />
    </AuthGuard>
  );
}
