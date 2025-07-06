'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { openThreadSidebar, closeThreadSidebar } from '@/store/slices/threadsSlice';
import ThreadSidebar from '@/components/ui/ThreadSidebar';

export default function SidebarTestPage() {
  const dispatch = useDispatch();
  const { isThreadSidebarOpen, allThreads, activeThread } = useSelector((state: RootState) => state.threads);

  const handleOpenSidebar = () => {
    dispatch(openThreadSidebar());
  };

  const handleCloseSidebar = () => {
    dispatch(closeThreadSidebar());
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-8">Sidebar Animation Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleOpenSidebar}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Sidebar
        </button>
        
        <p className="text-gray-400">
          Click the button above to test the sidebar sliding animation.
        </p>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Test Instructions:</h2>
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>• Click &quot;Open Sidebar&quot; to slide the sidebar in from the left</li>
            <li>• Click the backdrop (dark area) to close the sidebar</li>
            <li>• Press ESC key to close the sidebar</li>
            <li>• Click the X button in the sidebar header to close</li>
            <li>• Test on different screen sizes (mobile, tablet, desktop)</li>
          </ul>
        </div>
      </div>

      {/* Sidebar Component */}
      <ThreadSidebar
        isOpen={isThreadSidebarOpen}
        onClose={handleCloseSidebar}
        threads={allThreads}
        activeThread={activeThread}
        onThreadSelect={() => {}}
      />
    </div>
  );
}
