'use client';

import { FamilySetupContainer } from '@/components/family-setup/FamilySetupContainer';
import { WelcomeBackground } from '@/components/ui';

export default function FamilySetupPage() {
  return (
    <WelcomeBackground>
      <FamilySetupContainer />
    </WelcomeBackground>
  );
}
