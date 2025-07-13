import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "../store/ReduxProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import AppLayout from "../components/AppLayout";


export const metadata: Metadata = {
  title: "Next.js App",
  description: "A Next.js application",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Next.js App" />
      </head>
      <body className="antialiased bg-black text-white">
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
