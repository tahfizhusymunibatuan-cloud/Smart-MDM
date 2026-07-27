'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Calendar, BarChart3, Clock, AlertTriangle, Smartphone, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WebReportsPage() {
  const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
            <span>Laporan Monitoring Web Interaktif</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ringkasan harian, mingguan, dan bulanan penggunaan perangkat santri secara langsung di Web Dashboard.
          </p>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-accent/40 rounded-xl border border-border">
          {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target ${
                period === p ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === 'DAILY' && 'Laporan Harian'}
              {p === 'WEEKLY' && 'Laporan Mingguan'}
              {p === 'MONTHLY' && 'Laporan Bulanan'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Total Screen Time</span>
          <p className="text-2xl font-extrabold text-emerald-500">
            {period === 'DAILY' ? '39j 40m' : period === 'WEEKLY' ? '278j 15m' : '1.140j'}
          </p>
          <span className="text-[10px] text-muted-foreground">Akumulasi seluruh santri</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Aktivitas Malam (Begadang)</span>
          <p className="text-2xl font-extrabold text-amber-500">
            {period === 'DAILY' ? '4 HP' : period === 'WEEKLY' ? '18 HP' : '64 HP'}
          </p>
          <span className="text-[10px] text-amber-500 font-semibold">Aktif &gt; 22.00 WIB</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Insiden Pelanggaran</span>
          <p className="text-2xl font-extrabold text-rose-500">
            {period === 'DAILY' ? '2 Insiden' : period === 'WEEKLY' ? '11 Insiden' : '42 Insiden'}
          </p>
          <span className="text-[10px] text-muted-foreground">Telah diproses pengurus</span>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Tingkat Kepatuhan</span>
          <p className="text-2xl font-extrabold text-teal-400">92%</p>
          <span className="text-[10px] text-teal-400 font-medium">Status Sangat Baik</span>
        </div>
      </div>

      {/* Full Report Details */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-foreground border-b border-border/50 pb-3">
          Detail Laporan {period === 'DAILY' ? 'Harian (26 Juli 2026)' : period === 'WEEKLY' ? 'Mingguan (20 - 26 Juli 2026)' : 'Bulanan (Juli 2026)'}
        </h3>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-accent/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Top 1 Aplikasi Paling Banyak Digunakan</span>
            <span className="font-bold text-emerald-500">YouTube (156 Menit)</span>
          </div>
          <div className="p-3 rounded-xl bg-accent/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Kamar Dengan Kebiasaan Begadang Tertinggi</span>
            <span className="font-bold text-amber-500">Kamar As-Syafi&apos;i (3 Santri)</span>
          </div>
          <div className="p-3 rounded-xl bg-accent/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Status Pendaftaran Perangkat</span>
            <span className="font-bold text-teal-400">6 Perangkat Aktif Terdaftar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
