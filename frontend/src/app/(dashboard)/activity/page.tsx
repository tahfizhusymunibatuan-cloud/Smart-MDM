'use client';

import React, { useState } from 'react';
import { History, Clock, Smartphone, Unlock, Tv, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

const mockTimeline = [
  { time: '05.12', eventType: 'SCREEN_ON', title: 'Screen ON', subtitle: 'Layar dihidupkan santri', duration: '2 mnt', color: 'emerald' },
  { time: '05.14', eventType: 'APP_LAUNCH', title: 'WhatsApp', subtitle: 'Pesan grup kelas & keluarga', duration: '16 mnt', color: 'teal' },
  { time: '05.30', eventType: 'APP_LAUNCH', title: 'Google Chrome', subtitle: 'Membaca kajian islami online', duration: '30 mnt', color: 'indigo' },
  { time: '06.00', eventType: 'SCREEN_OFF', title: 'Screen OFF', subtitle: 'Layar dimatikan (Persiapan Sekolah)', duration: '', color: 'slate' },
  { time: '08.20', eventType: 'SCREEN_ON', title: 'Screen ON', subtitle: 'Layar dihidupkan santri', duration: '1 mnt', color: 'emerald' },
  { time: '08.21', eventType: 'APP_LAUNCH', title: 'TikTok', subtitle: 'Menonton video konten pendek', duration: '49 mnt', color: 'amber' },
  { time: '09.10', eventType: 'SCREEN_OFF', title: 'Screen OFF', subtitle: 'Layar dimatikan', duration: '', color: 'slate' },
  { time: '22.15', eventType: 'SCREEN_ON', title: 'Screen ON', subtitle: 'Layar dihidupkan saat Jam Tidur', duration: '1 mnt', color: 'rose' },
  { time: '22.16', eventType: 'APP_LAUNCH', title: 'YouTube', subtitle: 'Menonton live streaming / video', duration: '2j 26m', color: 'rose' },
  { time: '00.42', eventType: 'SCREEN_OFF', title: 'Screen OFF', subtitle: 'Layar dimatikan (Tidur terlambat)', duration: '', color: 'slate' },
];

export default function ActivityTimelinePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Timeline Aktivitas Perangkat</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Alur хроноologis aktivitas HP santri secara detail dari detik pertama hingga mati.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-accent/40 rounded-xl border border-border">
          {(['TODAY', 'WEEK', 'MONTH'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target ${
                selectedPeriod === period
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period === 'TODAY' && 'Hari Ini'}
              {period === 'WEEK' && 'Mingguan'}
              {period === 'MONTH' && '30 Hari'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Jam Pertama Digunakan */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold uppercase">Jam Pertama HP Dipakai</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-500">05.12 WIB</p>
          <span className="text-[10px] text-muted-foreground">Sesudah Subuh</span>
        </div>

        {/* Jam Terakhir Digunakan */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold uppercase">Jam Terakhir HP Dipakai</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-500">00.42 WIB</p>
          <span className="text-[10px] text-amber-500 font-semibold">Tergolong Begadang</span>
        </div>

        {/* Total Unlock */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold uppercase">Total Unlock Layar</span>
            <Unlock className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">18 Kali</p>
          <span className="text-[10px] text-muted-foreground">Frekuensi standar</span>
        </div>

        {/* Lama Layar Aktif vs Mati */}
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-semibold uppercase">Layar Aktif / Mati</span>
            <Tv className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-extrabold text-foreground">4j 04m / 19j 56m</p>
          <span className="text-[10px] text-emerald-500 font-medium">17% Waktu Layar Aktif</span>
        </div>
      </div>

      {/* Interactive Timeline Stream */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Timeline Interaktif (Samsung Galaxy A54 - Ahmad Fadhil)</h3>
            <p className="text-xs text-muted-foreground">26 Juli 2026 • Urutan kronologis event HP santri</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
            Terverifikasi Native OS
          </span>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
          {mockTimeline.map((item, idx) => (
            <div key={idx} className="relative flex items-start justify-between gap-4 group">
              {/* Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-3.5 h-3.5 rounded-full border-2 border-background ring-4 ${
                  item.color === 'rose'
                    ? 'bg-rose-500 ring-rose-500/20'
                    : item.color === 'amber'
                    ? 'bg-amber-500 ring-amber-500/20'
                    : item.color === 'emerald'
                    ? 'bg-emerald-500 ring-emerald-500/20'
                    : 'bg-slate-400 ring-slate-400/20'
                }`}
              />

              {/* Event Content */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-extrabold text-foreground">{item.time} WIB</span>
                  <span className="font-bold text-sm text-foreground">{item.title}</span>
                  {item.duration && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-foreground font-semibold">
                      {item.duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>

              {/* Action indicator */}
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-emerald-500 transition-colors">
                Detail
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
