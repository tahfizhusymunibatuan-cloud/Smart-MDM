import React from 'react';
import './globals.css';
import { Providers } from '@/components/providers';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Smart MDM Pondok - Sistem Monitoring & Policy HP Santri',
  description:
    'Sistem monitoring & pengelolaan perangkat HP santri khusus lingkungan pondok pesantren dengan telemetri realtime, deteksi begadang, policy engine, dan AI assistant.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Smart MDM',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-emerald-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
