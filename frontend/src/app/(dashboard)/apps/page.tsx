'use client';

import React from 'react';
import { AppWindow, BarChart3, Clock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const appStats = [
  { name: 'YouTube', durationMinutes: 156, durationText: '2j 36m', frequency: 14, category: 'Hiburan / Media' },
  { name: 'TikTok', durationMinutes: 103, durationText: '1j 43m', frequency: 22, category: 'Media Sosial' },
  { name: 'WhatsApp', durationMinutes: 96, durationText: '1j 36m', frequency: 38, category: 'Komunikasi' },
  { name: 'Mobile Legends', durationMinutes: 75, durationText: '1j 15m', frequency: 5, category: 'Game' },
  { name: 'Google Chrome', durationMinutes: 53, durationText: '53m', frequency: 11, category: 'Browsing' },
  { name: 'Instagram', durationMinutes: 46, durationText: '46m', frequency: 18, category: 'Media Sosial' },
];

export default function AppMonitoringPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">Monitoring Aplikasi Perangkat</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Analisis durasi, frekuensi buka/tutup, serta grafik tren penggunaan aplikasi santri.
          </p>
        </div>
      </div>

      {/* OS Limitation Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
        <div className="flex items-center space-x-2 text-amber-500 font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>Informasi Resmi Kapabilitas OS:</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Pada <strong>Android</strong>, data aplikasi dibaca secara native via <code>UsageStatsManager</code>. Pada <strong>iOS</strong>, monitoring aplikasi global memerlukan <strong>Apple MDM Supervised Enrollment</strong> via API <code>DeviceActivity</code> resmi Apple demi menjaga kepatuhan privasi sandbox iOS.
        </p>
      </div>

      {/* Chart: App Duration Ranking */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">Grafik Durasi Penggunaan Aplikasi (Menit)</h3>
            <p className="text-xs text-muted-foreground">Peringkat aplikasi paling lama diakses santri hari ini</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={appStats} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" stroke="#888888" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="durationMinutes" name="Durasi (Menit)" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* App Table */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-foreground">Rincian Penggunaan & Frekuensi Buka Aplikasi</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] font-semibold">
                <th className="pb-3">Nama Aplikasi</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Total Durasi</th>
                <th className="pb-3">Frekuensi Buka</th>
                <th className="pb-3">Jam Dibuka - Ditutup</th>
                <th className="pb-3 text-right">Status Kebijakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {appStats.map((item, idx) => (
                <tr key={idx} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3 font-bold text-foreground flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                      {item.name[0]}
                    </div>
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{item.category}</td>
                  <td className="py-3 font-bold text-emerald-500">{item.durationText}</td>
                  <td className="py-3 font-semibold text-foreground">{item.frequency}x dibuka</td>
                  <td className="py-3 text-muted-foreground">05.14 - 22.40 WIB</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-[10px]">
                      Terapkan Batasan
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
