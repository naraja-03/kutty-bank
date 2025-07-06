import BottomNav from '../../components/ui/BottomNav';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-gray-800/50 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-8 text-center pb-24">
        <div className="text-gray-400">
          <p className="text-lg font-medium mb-2">Coming Soon</p>
          <p className="text-sm">Family chat feature will be available soon!</p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
