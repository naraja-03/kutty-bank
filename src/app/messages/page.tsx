import BottomNav from '../../components/ui/BottomNav';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="min-h-screen text-white">
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
      <div className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Messages Yet</h3>
          <p className="text-gray-400 mb-6 max-w-sm">
            Your messages will appear here. Start by sending your first message!
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
