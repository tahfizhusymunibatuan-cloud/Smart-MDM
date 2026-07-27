'use client';

import React from 'react';
import { Moon, Clock, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activeHoursMatrix = [
  { day: 'Hari Senin', activeUntil: '22.10 WIB', status: 'Normal', color: 'emerald' },
  { day: 'Hari Selasa', activeUntil: '00.55 WIB', status: 'Begadang', color: 'amber' },
  { day: 'Hari Rabu', activeUntil: '02.15 WIB', status: 'Sangat Terlambat', color: 'rose' },
  { day: 'Hari Kamis', activeUntil: '21.45 WIB', status: 'Normal', color: 'emerald' },
  { day: 'Hari Jumat', activeUntil: '22.30 WIB', status: 'Normal', color: 'emerald' },
  { day: 'Hari Sabtu', activeUntil: '01.10 WIB', status: 'Begadang', color: 'amber' },
  { day: 'Hari Minggu', activeUntil: '22.05 WIB', status: 'Normal', color: 'emerald' },
];

const thirtyDaysNightData = Array.from({ length: 30 }, (_, i) => ({
  day: `Tgl ${i + 1}`,
  lateNightDevices: Math.floor(Math.random() * 5) + 1,
  bedtimeViolation: Math.floor(Math.random() * 3),
}));

export default function ActiveHoursPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center space-x-2">
            <Moon className="w-6 h-6 text-amber-500" />
            <span>Monitoring Jam Aktif & Pola Begadang</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Deteksi riwayat keaktifan HP santri hingga tengah malam dan analisis tren 30 hari.
          </p>
        </div>
      </div>

      {/* Daily Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeHoursMatrix.map((item, idx) => (
          <div
            key={idx}
            className={`glass-card p-4 rounded-2xl border-l-4 space-y-2 ${
              item.color === 'emerald'
                ? 'border-l-emerald-500'
                : item.color === 'amber'
                ? 'border-l-amber-500'
                : 'border-l-rose-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">{item.day}</span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  item.color === 'emerald'
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
                    : item.color === 'amber'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                    : 'bg-rose-500/15 text-rose-500 border border-rose-500/20'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-xs text-muted-foreground">Aktif Sampai:</span>
              <span className="text-xl font-extrabold text-foreground">{item.activeUntil}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 30-Day Activity Trend Graph */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">Grafik Tren Kebiasaan Begadang (30 Hari)</h3>
            <p className="text-xs text-muted-foreground">Jumlah perangkat aktif di atas jam 22.00 WIB setiap malam</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={thirtyDaysNightData}>
              <defs>
                <linearGradient id="colorLateNight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" stroke="#888888" fontSize={10} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="lateNightDevices" name="Jumlah Device Begadang" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLateNight)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
