// PWA Installation Test Component
'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">Install KuttyBank</h3>
          <p className="text-sm text-gray-400">Add to your home screen for quick access</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstall(false)}
            className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
