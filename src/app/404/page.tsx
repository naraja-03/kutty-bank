'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-400 mb-8">Sorry, the page you are looking for does not exist.</p>
            <Link href="/" className="text-blue-400 underline">Go Home</Link>
        </div>
    );
}