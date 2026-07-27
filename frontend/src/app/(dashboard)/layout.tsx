import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { PwaInstallBanner } from '@/components/layout/pwa-install-banner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        <Header />
        <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
        <BottomNav />
        <PwaInstallBanner />
      </div>
    </div>
  );
}
