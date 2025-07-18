'use client';

import BottomNav from '@/components/ui/BottomNav';

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <h1 className="text-xl font-bold mb-2">AI Insights</h1>
        <p className="text-gray-400 text-sm">Intelligent budget analysis coming soon...</p>
      </div>
      
      <BottomNav />
    </div>
  );
}
