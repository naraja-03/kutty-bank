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
  description: "A Threads-style family budget tracker PWA for real-time family expense tracking",
  manifest: "/manifest.json",
  keywords: "family budget, expense tracker, financial management, PWA",
  authors: [{ name: "Threedot Family" }],
  appleWebApp: {
    capable: true,
    title: "KuttyBank",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "KuttyBank - Family Budget Tracker",
    description: "A Threads-style family budget tracker PWA for real-time family expense tracking",
    type: "website",
    siteName: "KuttyBank",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "KuttyBank",
    "application-name": "KuttyBank",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "none",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  colorScheme: "dark",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
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
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KuttyBank" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="KuttyBank" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
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
