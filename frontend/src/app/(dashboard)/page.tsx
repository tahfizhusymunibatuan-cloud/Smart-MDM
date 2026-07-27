'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  AlertTriangle,
  RefreshCw,
  Moon,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

const weeklyUsageData = [
  { day: 'Sen', screenTimeHours: 4.2, violations: 1, nightActive: 2 },
  { day: 'Sel', screenTimeHours: 5.8, violations: 3, nightActive: 4 },
  { day: 'Rab', screenTimeHours: 6.1, violations: 4, nightActive: 5 },
  { day: 'Kam', screenTimeHours: 3.9, violations: 1, nightActive: 1 },
  { day: 'Jum', screenTimeHours: 4.5, violations: 2, nightActive: 3 },
  { day: 'Sab', screenTimeHours: 7.4, violations: 5, nightActive: 6 },
  { day: 'Min', screenTimeHours: 5.2, violations: 2, nightActive: 3 },
];

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalDevices: 6,
    onlineDevices: 5,
    offlineDevices: 1,
    activeInUse: 4,
    totalScreenTimeText: '39j 40m',
    totalViolationsToday: 2,
    unsyncedDevices: 1,
    lateNightDevices: [
      { name: 'Muhammad Rizky', device: 'Redmi Note 12 Pro', room: "Kamar As-Syafi'i", time: '00.55 WIB', app: 'TikTok' },
      { name: 'Ahmad Fadhil', device: 'Samsung Galaxy A54', room: "Kamar As-Syafi'i", time: '00.42 WIB', app: 'YouTube' },
      { name: 'Ali Zaineddin', device: 'Oppo Reno 8 T', room: 'Kamar Al-Ghazali', time: '02.15 WIB', app: 'Mobile Legends' },
      { name: 'Umar Al-Faruq', device: 'iPhone 13 Mini', room: 'Kamar Al-Ghazali', time: '23.40 WIB', app: 'Safari' },
    ],
  });

  const [aiInsight, setAiInsight] = useState({
    summaryText: 'Hari ini terdapat 4 perangkat yang masih aktif setelah pukul 22.00. Rata-rata screen time santri meningkat 18% dibanding kemarin. Tiga santri di Kamar As-Syafi\'i menunjukkan pola begadang selama 3 hari berturut-turut.',
    recommendation: 'Aktifkan Kunci Otomatis Jam Tidur (22.00 - 04.00)',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const summaryRes = await fetchApi('/devices/dashboard-summary');
      if (summaryRes?.success && summaryRes?.data) {
        setMetrics((prev) => ({
          ...prev,
          totalDevices: summaryRes.data.totalDevices || prev.totalDevices,
          onlineDevices: summaryRes.data.onlineDevices || prev.onlineDevices,
          offlineDevices: summaryRes.data.offlineDevices || prev.offlineDevices,
          activeInUse: summaryRes.data.activeInUse || prev.activeInUse,
          totalScreenTimeText: summaryRes.data.totalScreenTimeText || prev.totalScreenTimeText,
          totalViolationsToday: summaryRes.data.totalViolationsToday || prev.totalViolationsToday,
          unsyncedDevices: summaryRes.data.unsyncedDevices || prev.unsyncedDevices,
        }));
      }

      const aiRes = await fetchApi('/ai/daily-summary');
      if (aiRes?.success && aiRes?.data) {
        setAiInsight({
          summaryText: aiRes.data.summaryText,
          recommendation: aiRes.data.recommendations?.[0] || 'Aktifkan Kunci Otomatis Jam Tidur',
        });
      }
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Monitoring Overview</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/20">
              Realtime WS
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pemantauan pola penggunaan HP santri & kepatuhan perangkat pondok.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/active-hours"
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 text-xs font-semibold flex items-center gap-1.5 transition-colors touch-target"
          >
            <Moon className="w-4 h-4" />
            <span>Deteksi Begadang ({metrics.lateNightDevices.length} HP)</span>
          </Link>
        </div>
      </div>

      {/* AI Daily Summary Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-card border border-emerald-500/30 dark:border-emerald-500/40 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0 shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
                <span>Ringkasan AI & Pembinaan Santri Hari Ini</span>
              </h3>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold hidden sm:inline-block">
                Model: Gemini 1.5 Pro
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
              &quot;{aiInsight.summaryText}&quot;
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">Rekomendasi Pengasuh:</span>
              <span className="text-xs bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-950 dark:text-emerald-100 font-semibold px-3 py-1 rounded-xl shadow-sm">
                {aiInsight.recommendation}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Device</span>
            <Smartphone className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{metrics.totalDevices}</span>
            <span className="text-xs text-muted-foreground">HP Terdaftar</span>
          </div>
          <div className="text-[11px] text-emerald-500 font-medium">100% Tercover Monitoring</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Device Online</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500">{metrics.onlineDevices}</span>
            <span className="text-xs text-muted-foreground">Aktif</span>
          </div>
          <div className="text-[11px] text-emerald-500/80 font-medium">Koneksi Stabil</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Device Offline</span>
            <WifiOff className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">{metrics.offlineDevices}</span>
            <span className="text-xs text-muted-foreground">Mati / Loss</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Terakhir sync 2j lalu</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Sedang Digunakan</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400">{metrics.activeInUse}</span>
            <span className="text-xs text-muted-foreground">Screen ON</span>
          </div>
          <div className="text-[11px] text-teal-400 font-medium">Layar sedang aktif</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Screen Time Hari Ini</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-foreground">{metrics.totalScreenTimeText}</span>
          </div>
          <div className="text-[11px] text-muted-foreground">Akumulasi seluruh santri</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pelanggaran</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">{metrics.totalViolationsToday}</span>
            <span className="text-xs text-muted-foreground">Insiden</span>
          </div>
          <div className="text-[11px] text-amber-500 font-medium">Perlu perhatian pengurus</div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Tidak Sinkron</span>
            <RefreshCw className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500">{metrics.unsyncedDevices}</span>
            <span className="text-xs text-muted-foreground">HP</span>
          </div>
          <div className="text-[11px] text-rose-500 font-medium">&gt; 15 menit tanpa heartbeat</div>
        </div>
      </div>

      {/* Main Charts & Night Owl Active Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-4 sm:p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground">Grafik Penggunaan & Pelanggaran Mingguan</h3>
              <p className="text-xs text-muted-foreground">Tren akumulasi jam layar (Screen Time) dan insiden malam</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyUsageData}>
                <defs>
                  <linearGradient id="colorScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorNight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="screenTimeHours" name="Screen Time (Jam)" stroke="#10b981" fillOpacity={1} fill="url(#colorScreen)" strokeWidth={2} />
                <Area type="monotone" dataKey="nightActive" name="Device Begadang" stroke="#f59e0b" fillOpacity={1} fill="url(#colorNight)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Masih Aktif Malam Hari (Begadang Widget) */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Aktif Malam Hari</h3>
                <p className="text-[11px] text-muted-foreground">Aktif setelah 22.00 WIB</p>
              </div>
            </div>
            <Link href="/active-hours" className="text-xs text-emerald-500 hover:underline flex items-center">
              <span>Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
            {metrics.lateNightDevices.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-accent/40 border border-border/40 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.device} • {item.room}</p>
                  <span className="text-[10px] text-amber-500 font-medium">Buka app: {item.app}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-500">{item.time}</span>
                  <p className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase mt-1 font-semibold">Begadang</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
