import FamilyPage from '../../components/ui/FamilyPage';
import AuthGuard from '../../components/AuthGuard';

export default function FamilyPageRoute() {
  return (
    <AuthGuard requireAuth={true}>
      <FamilyPage />
    </AuthGuard>
  );
}
