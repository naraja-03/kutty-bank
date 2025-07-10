import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../store/ReduxProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import AppLayout from "../components/AppLayout";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="format-detection" content="telephone=no" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <ErrorBoundary>
          <ReduxProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
