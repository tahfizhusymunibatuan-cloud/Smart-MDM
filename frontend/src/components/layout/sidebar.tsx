'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Smartphone,
  History,
  AppWindow,
  Clock,
  ShieldCheck,
  BellRing,
  FileSpreadsheet,
  Bot,
  Users,
  Settings,
  ShieldAlert,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Perangkat', href: '/devices', icon: Smartphone },
  { name: 'Timeline Aktivitas', href: '/activity', icon: History },
  { name: 'Monitoring App', href: '/apps', icon: AppWindow },
  { name: 'Jam Aktif & Begadang', href: '/active-hours', icon: Clock },
  { name: 'Policy Engine', href: '/policies', icon: ShieldCheck },
  { name: 'Kepatuhan (Health)', href: '/compliance', icon: ShieldAlert },
  { name: 'Audit Logs', href: '/audit-logs', icon: BellRing },
  { name: 'Laporan Web', href: '/reports', icon: FileSpreadsheet },
  { name: 'AI Pembinaan', href: '/ai-assistant', icon: Bot },
  { name: 'Pengguna', href: '/users', icon: Users },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border/50 bg-card/60 backdrop-blur-xl h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-border/40 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none tracking-wide text-foreground">Smart MDM</h1>
          <span className="text-xs font-medium text-emerald-500">Pondok Pesantren</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group touch-target',
                isActive
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-emerald-500' : 'text-muted-foreground',
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Profile & Theme Toggle */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-accent/40 hover:bg-accent text-foreground transition-colors touch-target"
        >
          <div className="flex items-center space-x-2">
            {mounted && theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span>{mounted && theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/80 uppercase font-semibold">
            {mounted ? theme : 'DARK'}
          </span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 bg-card rounded-xl border border-border/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold flex items-center justify-center text-xs">
              KA
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground truncate max-w-[110px]">Khairol Anam</p>
              <p className="text-[10px] text-muted-foreground">Super Admin</p>
            </div>
          </div>
          <Link href="/login" className="text-muted-foreground hover:text-rose-500 transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
