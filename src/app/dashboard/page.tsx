'use client';

import { WelcomeBackground } from '@/components/ui';

export default function DashboardPage() {
  return (
    <WelcomeBackground>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-gray-300">Welcome to your family budget dashboard!</p>
        </div>
      </div>
    </WelcomeBackground>
  );
}
