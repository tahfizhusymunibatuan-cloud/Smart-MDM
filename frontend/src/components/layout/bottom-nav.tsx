'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Smartphone, History, Clock, ShieldCheck } from 'lucide-react';

const mobileNavItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Devices', href: '/devices', icon: Smartphone },
  { name: 'Timeline', href: '/activity', icon: History },
  { name: 'Begadang', href: '/active-hours', icon: Clock },
  { name: 'Policy', href: '/policies', icon: ShieldCheck },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border/60 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all touch-target min-w-[60px]',
                isActive ? 'text-emerald-500 font-bold' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'p-1 rounded-xl transition-transform',
                  isActive ? 'bg-emerald-500/15 scale-110' : 'bg-transparent',
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
