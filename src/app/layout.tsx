import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../store/ReduxProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import AppLayout from "../components/AppLayout";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";
import SafeAreaProvider from "../components/SafeAreaProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KuttyBank - Family Budget Tracker",
  description: "A Threads-style family budget tracker for real-time family expense tracking",
  keywords: "family budget, expense tracker, financial management",
  authors: [{ name: "Threedot Family" }],
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "KuttyBank - Family Budget Tracker",
    description: "A Threads-style family budget tracker for real-time family expense tracking",
    type: "website",
    siteName: "KuttyBank",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  colorScheme: "dark",
  viewportFit: "cover",
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KuttyBank" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ErrorBoundary>
          <ReduxProvider>
            <ServiceWorkerRegistration />
            <SafeAreaProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </SafeAreaProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
