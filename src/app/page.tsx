'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to welcome page
    router.replace('/welcome');
  }, [router]);

  // Show a minimal loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
          <Logo size="xl" animate className="mx-auto" />
      </div>
    </div>
  );
}
