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
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://rightrack.vercel.app'),
  title: "Rightrack - Family Budget Tracker",
  description: "A Threads-style family budget tracker for real-time family expense tracking",
  keywords: "family budget, expense tracker, financial management",
  authors: [{ name: "Threedot Family" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Rightrack - Family Budget Tracker",
    description: "A Threads-style family budget tracker for real-time family expense tracking",
    type: "website",
    siteName: "Rightrack",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Rightrack - Family Budget Tracker",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
