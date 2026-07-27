'use client';

import React, { useState } from 'react';
import { Bell, Wifi, Moon, Sun, Menu, X, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/50 bg-card/70 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-accent/50 text-foreground touch-target flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm md:text-base font-bold text-foreground leading-tight">
              Pondok Pesantren Tahfizh Quran Al-Usymuni
            </h2>
            <p className="text-[11px] text-muted-foreground hidden sm:block">Smart MDM Monitoring Hub</p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {/* Realtime Socket Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Wifi className="w-3.5 h-3.5 animate-pulse" />
          <span>WebSocket Realtime</span>
        </div>

        {/* Notifications Button */}
        <button className="relative p-2 rounded-xl bg-accent/40 hover:bg-accent text-foreground transition-colors touch-target flex items-center justify-center">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        </button>

        {/* Theme Switcher Mobile */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="md:hidden p-2 rounded-xl bg-accent/40 text-foreground touch-target flex items-center justify-center"
        >
          {mounted && theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-card/95 backdrop-blur-2xl border-b border-border p-4 shadow-2xl space-y-2 z-50">
          <div className="text-xs font-semibold uppercase text-muted-foreground mb-2 px-2">Menu Lengkap Admin</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Dashboard', href: '/' },
              { name: 'Detail Perangkat', href: '/devices' },
              { name: 'Timeline Aktivitas', href: '/activity' },
              { name: 'Monitoring App', href: '/apps' },
              { name: 'Jam Aktif Begadang', href: '/active-hours' },
              { name: 'Policy Engine', href: '/policies' },
              { name: 'Kepatuhan System', href: '/compliance' },
              { name: 'Audit Logs', href: '/audit-logs' },
              { name: 'Laporan Web', href: '/reports' },
              { name: 'AI Pembinaan', href: '/ai-assistant' },
              { name: 'Pengguna', href: '/users' },
              { name: 'Pengaturan', href: '/settings' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-accent/30 text-xs font-medium text-foreground hover:bg-accent flex items-center space-x-2 touch-target"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
