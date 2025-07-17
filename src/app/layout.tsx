import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '../store/ReduxProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import AppLayout from '../components/AppLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://rightrack.vercel.app'),
  title: 'RighTrack - Family Budget Tracker',
  description: "Track your family's expenses and manage budgets together in real-time",
  keywords: 'family budget, expense tracker, financial management, PWA, mobile app',
  authors: [{ name: 'Threedot Family' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-glass.svg',
    apple: '/icons/apple-touch-icon.png',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'RighTrack - Family Budget Tracker',
    description: "Track your family's expenses and manage budgets together in real-time",
    type: 'website',
    siteName: 'RighTrack',
    images: [
      {
        url: '/icon-glass.svg',
        width: 1200,
        height: 630,
        alt: 'RighTrack - Family Budget Tracker',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RighTrack',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RighTrack" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/icon-glass.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-hidden`}
      >
        <ErrorBoundary>
          <ReduxProvider>
            <AppLayout>{children}</AppLayout>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
