import AppLayout from '../../components/AppLayout';

export default function MessagesPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-black text-white">
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-10">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
        </div>
        
        <div className="px-4 py-8 text-center">
          <div className="text-gray-400">
            <p className="text-lg font-medium mb-2">Coming Soon</p>
            <p className="text-sm">Family chat feature will be available soon!</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
