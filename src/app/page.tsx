'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">R</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">RightTrack</h1>
        <p className="text-gray-400 text-sm mb-8">Family budget tracker</p>
        <a 
          href="/welcome" 
          className="inline-block bg-white text-black py-3 px-8 rounded-xl font-medium hover:bg-gray-100 transition-colors"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
